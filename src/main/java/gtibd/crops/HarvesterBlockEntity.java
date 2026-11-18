package gtibd.crops;

import com.gregtechceu.gtceu.api.capability.IEnergyContainer;
import com.gregtechceu.gtceu.api.capability.forge.GTCapability;
import java.util.List;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.Containers;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.common.capabilities.ForgeCapabilities;
import net.minecraftforge.common.util.LazyOptional;
import net.minecraftforge.items.IItemHandler;
import net.minecraftforge.items.ItemStackHandler;

public final class HarvesterBlockEntity extends BlockEntity implements IEnergyContainer {
    private static final long INPUT_VOLTAGE = 32;
    private static final long HARVEST_COST = 32;
    private static final long ENERGY_CAPACITY = 2_048;
    private static final int OUTPUT_SLOTS = 9;
    private static final int SCAN_RADIUS = 4;
    private static final int SCAN_WIDTH = SCAN_RADIUS * 2 + 1;
    private static final int SCAN_SIZE = SCAN_WIDTH * SCAN_WIDTH;

    private final ItemStackHandler output = new ItemStackHandler(OUTPUT_SLOTS) {
        @Override
        protected void onContentsChanged(int slot) {
            setChanged();
        }
    };

    private final IItemHandler extractOnly = new IItemHandler() {
        @Override
        public int getSlots() {
            return output.getSlots();
        }

        @Override
        public ItemStack getStackInSlot(int slot) {
            return output.getStackInSlot(slot);
        }

        @Override
        public ItemStack insertItem(int slot, ItemStack stack, boolean simulate) {
            return stack;
        }

        @Override
        public ItemStack extractItem(int slot, int amount, boolean simulate) {
            return output.extractItem(slot, amount, simulate);
        }

        @Override
        public int getSlotLimit(int slot) {
            return output.getSlotLimit(slot);
        }

        @Override
        public boolean isItemValid(int slot, ItemStack stack) {
            return false;
        }
    };

    private LazyOptional<IItemHandler> itemCapability = LazyOptional.of(() -> extractOnly);
    private LazyOptional<IEnergyContainer> energyCapability = LazyOptional.of(() -> this);

    private long energy;
    private long lastEnergyPacket = Long.MIN_VALUE;
    private int scanIndex;
    private ItemStack analyzer = ItemStack.EMPTY;

    public HarvesterBlockEntity(BlockPos pos, BlockState state) {
        super(GregCrops.HARVESTER_ENTITY.get(), pos, state);
    }

    public static void tick(Level level, BlockPos pos, BlockState state, HarvesterBlockEntity harvester) {
        if (!(level instanceof ServerLevel server) || harvester.energy < HARVEST_COST) return;

        int index = harvester.scanIndex;
        harvester.scanIndex = (index + 1) % SCAN_SIZE;
        BlockPos candidate = pos.offset(index % SCAN_WIDTH - SCAN_RADIUS, 0, index / SCAN_WIDTH - SCAN_RADIUS);
        if (!server.hasChunkAt(candidate) || !(server.getBlockState(candidate).getBlock() instanceof CropPlotBlock)) {
            return;
        }

        CropPlotBlock.harvest(server, candidate, !harvester.analyzer.isEmpty(), harvester::acceptItems);
    }

    private boolean acceptItems(List<ItemStack> items) {
        if (energy < HARVEST_COST || items.isEmpty() || items.stream().allMatch(ItemStack::isEmpty)) return false;

        var staged = new ItemStackHandler(OUTPUT_SLOTS);
        for (int slot = 0; slot < OUTPUT_SLOTS; slot++) {
            staged.setStackInSlot(slot, output.getStackInSlot(slot).copy());
        }
        for (ItemStack stack : items) {
            ItemStack remainder = stack.copy();
            for (int slot = 0; slot < OUTPUT_SLOTS && !remainder.isEmpty(); slot++) {
                remainder = staged.insertItem(slot, remainder, false);
            }
            if (!remainder.isEmpty()) return false;
        }
        for (int slot = 0; slot < OUTPUT_SLOTS; slot++) {
            ItemStack result = staged.getStackInSlot(slot);
            if (!ItemStack.matches(output.getStackInSlot(slot), result)) output.setStackInSlot(slot, result);
        }
        changeEnergy(-HARVEST_COST);
        return true;
    }

    boolean installAnalyzer(ItemStack stack) {
        if (!analyzer.isEmpty() || !stack.is(GregCrops.ANALYZER.get())) return false;
        analyzer = stack.split(1);
        setChanged();
        return true;
    }

    ItemStack removeAnalyzer() {
        ItemStack installed = analyzer;
        analyzer = ItemStack.EMPTY;
        if (!installed.isEmpty()) setChanged();
        return installed;
    }

    @Override
    public long acceptEnergyFromNetwork(Direction side, long voltage, long amperage) {
        if (!inputsEnergy(side) || voltage <= 0 || voltage > INPUT_VOLTAGE
                || amperage <= 0 || energy + voltage > ENERGY_CAPACITY) {
            return 0;
        }

        long now = level.getGameTime();
        if (lastEnergyPacket == now) return 0;
        lastEnergyPacket = now;
        changeEnergy(voltage);
        return 1;
    }

    @Override
    public boolean inputsEnergy(Direction side) {
        return level instanceof ServerLevel && !isRemoved();
    }

    @Override
    public long changeEnergy(long amount) {
        long inserted = Math.max(-energy, Math.min(ENERGY_CAPACITY - energy, amount));
        if (inserted != 0) {
            energy += inserted;
            setChanged();
        }
        return inserted;
    }

    @Override
    public long getEnergyStored() {
        return energy;
    }

    @Override
    public long getEnergyCapacity() {
        return ENERGY_CAPACITY;
    }

    @Override
    public long getInputAmperage() {
        return 1;
    }

    @Override
    public long getInputVoltage() {
        return INPUT_VOLTAGE;
    }

    @Override
    public <T> LazyOptional<T> getCapability(Capability<T> capability, Direction side) {
        if (!isRemoved()) {
            if (capability == ForgeCapabilities.ITEM_HANDLER) return itemCapability.cast();
            if (capability == GTCapability.CAPABILITY_ENERGY_CONTAINER) return energyCapability.cast();
            if (capability == GTCapability.CAPABILITY_ENERGY_INFO_PROVIDER) return energyCapability.cast();
        }
        return super.getCapability(capability, side);
    }

    @Override
    public void invalidateCaps() {
        super.invalidateCaps();
        itemCapability.invalidate();
        energyCapability.invalidate();
    }

    @Override
    public void reviveCaps() {
        super.reviveCaps();
        itemCapability = LazyOptional.of(() -> extractOnly);
        energyCapability = LazyOptional.of(() -> this);
    }

    @Override
    protected void saveAdditional(CompoundTag tag) {
        super.saveAdditional(tag);
        tag.put("Output", output.serializeNBT());
        tag.putLong("Energy", energy);
        tag.putInt("ScanIndex", scanIndex);
        if (!analyzer.isEmpty()) tag.put("Analyzer", analyzer.save(new CompoundTag()));
    }

    @Override
    public void load(CompoundTag tag) {
        super.load(tag);
        CompoundTag storedOutput = tag.getCompound("Output").copy();
        storedOutput.putInt("Size", OUTPUT_SLOTS);
        output.deserializeNBT(storedOutput);
        energy = Math.max(0, Math.min(ENERGY_CAPACITY, tag.getLong("Energy")));
        scanIndex = Math.floorMod(tag.getInt("ScanIndex"), SCAN_SIZE);
        ItemStack installed = ItemStack.of(tag.getCompound("Analyzer"));
        analyzer = installed.is(GregCrops.ANALYZER.get()) ? installed.split(1) : ItemStack.EMPTY;
    }

    void dropContents() {
        if (level == null) return;
        for (int slot = 0; slot < OUTPUT_SLOTS; slot++) {
            ItemStack stack = output.extractItem(slot, output.getSlotLimit(slot), false);
            if (!stack.isEmpty()) {
                Containers.dropItemStack(level, worldPosition.getX(), worldPosition.getY(), worldPosition.getZ(), stack);
            }
        }
        ItemStack installed = removeAnalyzer();
        if (!installed.isEmpty()) {
            Containers.dropItemStack(level, worldPosition.getX(), worldPosition.getY(), worldPosition.getZ(), installed);
        }
    }
}
