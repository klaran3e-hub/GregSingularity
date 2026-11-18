package gtibd.crops;

import net.minecraft.core.BlockPos;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.util.RandomSource;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.state.BlockState;

final class CropPlotEntity extends BlockEntity {
    private static final int PRODUCE_ROLL_SIDES = 4;
    private static final byte ROLL_MISS = 1;
    private static final byte ROLL_HIT = 2;

    private SeedGenes genes = SeedGenes.DEFAULT;
    private int progress;
    private boolean replenishingProduce;
    private byte cuttingProduceRoll;

    CropPlotEntity(BlockPos pos, BlockState state) {
        super(GregCrops.PLOT_ENTITY.get(), pos, state);
    }

    SeedGenes genes() {
        return genes;
    }

    void setGenes(SeedGenes value) {
        genes = value;
        setChanged();
    }

    boolean isReplenishingProduce() {
        return replenishingProduce;
    }

    void setReplenishingProduce(boolean replenishing) {
        replenishingProduce = replenishing;
        cuttingProduceRoll = 0;
        progress = 0;
        setChanged();
    }

    boolean rollCuttingProduce(RandomSource random) {
        if (cuttingProduceRoll == 0) {
            cuttingProduceRoll = random.nextInt(PRODUCE_ROLL_SIDES) == 0 ? ROLL_HIT : ROLL_MISS;
            setChanged();
        }
        return cuttingProduceRoll == ROLL_HIT;
    }

    boolean advance(int amount, int threshold) {
        progress += amount;
        boolean grew = progress >= threshold;
        if (grew) progress -= threshold;
        setChanged();
        return grew;
    }

    @Override
    protected void saveAdditional(CompoundTag tag) {
        super.saveAdditional(tag);
        genes.save(tag);
        tag.putInt("Progress", progress);
        tag.putBoolean("ReplenishingProduce", replenishingProduce);
        tag.putByte("CuttingProduceRoll", cuttingProduceRoll);
    }

    @Override
    public void load(CompoundTag tag) {
        super.load(tag);
        genes = SeedGenes.fromTag(tag);
        progress = Math.max(0, tag.getInt("Progress"));
        replenishingProduce = tag.getBoolean("ReplenishingProduce");
        cuttingProduceRoll = tag.getByte("CuttingProduceRoll");
    }
}
