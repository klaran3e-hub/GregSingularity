package gtibd.crops;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.tags.TagKey;
import net.minecraft.util.RandomSource;
import net.minecraft.world.Containers;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.LevelReader;
import net.minecraft.world.level.LevelAccessor;
import net.minecraft.world.level.block.BaseEntityBlock;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.FarmBlock;
import net.minecraft.world.level.block.RenderShape;
import net.minecraft.world.level.block.SoundType;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.block.state.StateDefinition;
import net.minecraft.world.level.block.state.properties.BlockStateProperties;
import net.minecraft.world.level.block.state.properties.BooleanProperty;
import net.minecraft.world.level.block.state.properties.IntegerProperty;
import net.minecraft.world.level.storage.loot.LootParams;
import net.minecraft.world.level.storage.loot.parameters.LootContextParams;
import net.minecraft.world.phys.BlockHitResult;
import net.minecraft.world.phys.shapes.CollisionContext;
import net.minecraft.world.phys.shapes.VoxelShape;
import net.minecraft.world.level.BlockGetter;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.common.IPlantable;
import net.minecraftforge.common.PlantType;
import org.jetbrains.annotations.Nullable;

public final class CropPlotBlock extends BaseEntityBlock implements IPlantable {
    public static final IntegerProperty AGE = BlockStateProperties.AGE_3;
    public static final BooleanProperty CROSSED = BooleanProperty.create("crossed");
    private static final int MAX_AGE = 3;
    private static final int INTERVAL = 60;
    private static final VoxelShape SHAPE = Block.box(1, 0, 1, 15, 14, 15);

    private final CropCatalog.Crop crop;

    CropPlotBlock(@Nullable CropCatalog.Crop crop) {
        super(BlockBehaviour.Properties.of().strength(0.15F).noCollission().noOcclusion().sound(SoundType.WOOD));
        this.crop = crop;
        registerDefaultState(stateDefinition.any().setValue(AGE, 0).setValue(CROSSED, false));
    }

    @Nullable
    public CropCatalog.Crop crop() {
        return crop;
    }

    @Override
    public BlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new CropPlotEntity(pos, state);
    }

    @Override
    public RenderShape getRenderShape(BlockState state) {
        return RenderShape.MODEL;
    }

    @Override
    public VoxelShape getShape(BlockState state, BlockGetter level, BlockPos pos, CollisionContext context) {
        return SHAPE;
    }

    @Override
    protected void createBlockStateDefinition(StateDefinition.Builder<Block, BlockState> builder) {
        builder.add(AGE, CROSSED);
    }

    @Override
    public boolean canSurvive(BlockState state, LevelReader level, BlockPos pos) {
        return level.getBlockState(pos.below()).is(Blocks.FARMLAND);
    }

    @Override
    public PlantType getPlantType(BlockGetter level, BlockPos pos) {
        return PlantType.CROP;
    }

    @Override
    public BlockState getPlant(BlockGetter level, BlockPos pos) {
        BlockState state = level.getBlockState(pos);
        return state.is(this) ? state : defaultBlockState();
    }

    @Override
    public BlockState updateShape(BlockState state, Direction direction, BlockState neighbor, LevelAccessor level,
                                  BlockPos pos, BlockPos neighborPos) {
        return direction == Direction.DOWN && !canSurvive(state, level, pos) ? Blocks.AIR.defaultBlockState()
                : super.updateShape(state, direction, neighbor, level, pos, neighborPos);
    }

    @Override
    public void onPlace(BlockState state, Level level, BlockPos pos, BlockState oldState, boolean moving) {
        super.onPlace(state, level, pos, oldState, moving);
        if (level instanceof ServerLevel server && !oldState.is(this) && (crop != null || state.getValue(CROSSED))) {
            schedule(server, pos);
        }
    }

    @Override
    public InteractionResult use(BlockState state, Level level, BlockPos pos, Player player, InteractionHand hand,
                                 BlockHitResult hit) {
        ItemStack held = player.getItemInHand(hand);
        if (held.is(GregCrops.ANALYZER.get())) {
            if (!level.isClientSide) inspect(level, pos, state, player);
            return InteractionResult.sidedSuccess(level.isClientSide);
        }
        if (crop != null && state.getValue(AGE) == MAX_AGE) {
            if (held.is(GregCrops.KNIFE.get())) {
                if (level instanceof ServerLevel server && level.getBlockEntity(pos) instanceof CropPlotEntity plot) {
                    ItemStack seed = CropSeedItem.stack(crop, plot.genes());
                    server.setBlock(pos, GregCrops.STICKS.get().defaultBlockState(), Block.UPDATE_ALL);
                    drop(server, pos, seed);
                    held.hurtAndBreak(1, player, p -> p.broadcastBreakEvent(hand));
                }
                return InteractionResult.sidedSuccess(level.isClientSide);
            }
            if (held.isEmpty() || !player.isShiftKeyDown()) {
                if (level instanceof ServerLevel server) harvest(server, pos, false, stacks -> {
                    stacks.forEach(stack -> drop(server, pos, stack));
                    return true;
                });
                return InteractionResult.sidedSuccess(level.isClientSide);
            }
        }
        if (crop != null || state.getValue(CROSSED)) return InteractionResult.PASS;
        if (held.is(GregCrops.STICK_ITEM.get())) {
            if (level instanceof ServerLevel server) {
                server.setBlock(pos, state.setValue(CROSSED, true), Block.UPDATE_ALL);
                schedule(server, pos);
                consume(player, held);
            }
            return InteractionResult.sidedSuccess(level.isClientSide);
        }

        var definition = fromSeed(held);
        if (definition == null) return InteractionResult.PASS;
        if (level instanceof ServerLevel server) {
            SeedGenes genes = held.is(GregCrops.SEED_PACKET.get()) && held.hasTag()
                    ? SeedGenes.fromTag(held.getTag()) : SeedGenes.DEFAULT;
            if (hasSubstrate(server, pos, definition)) {
                plant(server, pos, definition, genes);
                consume(player, held);
            } else {
                player.displayClientMessage(Component.translatable("message.gtibdcrops.substrate", definition.substrate()), true);
            }
        }
        return InteractionResult.sidedSuccess(level.isClientSide);
    }

    @Override
    public void tick(BlockState state, ServerLevel level, BlockPos pos, RandomSource random) {
        if (!canSurvive(state, level, pos)) {
            level.destroyBlock(pos, true);
            return;
        }
        if (crop == null) {
            if (state.getValue(CROSSED) && !breed(level, pos, random)) schedule(level, pos);
            return;
        }
        if (!(level.getBlockEntity(pos) instanceof CropPlotEntity plot)) return;
        boolean mature = state.getValue(AGE) == MAX_AGE;
        if (mature && !plot.isReplenishingProduce()) return;
        if (growing(level, pos, crop, plot.genes())) {
            int growth = INTERVAL * (100 + 12 * (plot.genes().growth() - 1)) / 100;
            if (plot.advance(growth, crop.growthTicks())) {
                if (mature) {
                    plot.setReplenishingProduce(false);
                } else {
                    state = state.cycle(AGE);
                    level.setBlock(pos, state, Block.UPDATE_CLIENTS);
                }
            }
        }
        if (state.getValue(AGE) < MAX_AGE || plot.isReplenishingProduce()) schedule(level, pos);
    }

    public static boolean harvest(ServerLevel level, BlockPos pos, boolean produceOnly, Predicate<List<ItemStack>> accept) {
        BlockState state = level.getBlockState(pos);
        if (!(state.getBlock() instanceof CropPlotBlock block) || block.crop == null || state.getValue(AGE) != MAX_AGE
                || !(level.getBlockEntity(pos) instanceof CropPlotEntity plot)
                || plot.isReplenishingProduce()
                || !hasSubstrate(level, pos, block.crop)) return false;

        List<ItemStack> drops = new ArrayList<>(2);
        if (!produceOnly) {
            var cutting = block.crop.id().equals("stickreed") ? Items.SUGAR_CANE : GregCrops.PLANT_CUTTINGS.get();
            drops.add(new ItemStack(cutting));
        }
        if (produceOnly || plot.rollCuttingProduce(level.random)) {
            ItemStack produce = harvestStack(block.crop, plot.genes());
            if (!produce.isEmpty()) drops.add(produce);
        }
        if (drops.isEmpty() || !accept.test(drops)) return false;
        plot.setReplenishingProduce(produceOnly);
        if (!produceOnly) level.setBlock(pos, state.setValue(AGE, 1), Block.UPDATE_CLIENTS);
        block.schedule(level, pos);
        return true;
    }

    private static ItemStack harvestStack(CropCatalog.Crop definition, SeedGenes genes) {
        var item = definition.tier() == 0
                ? ForgeRegistries.ITEMS.getValue(new ResourceLocation(definition.output().id()))
                : GregCrops.HARVESTS.get(definition.id()).get();
        if (item == null || item == Items.AIR) return ItemStack.EMPTY;
        return new ItemStack(item, definition.yield() + (genes.gain() - 1) / 12);
    }

    @Override
    public List<ItemStack> getDrops(BlockState state, LootParams.Builder params) {
        var sticks = new ItemStack(GregCrops.STICK_ITEM.get(), state.getValue(CROSSED) ? 2 : 1);
        var entity = params.getOptionalParameter(LootContextParams.BLOCK_ENTITY);
        if (crop != null && entity instanceof CropPlotEntity plot && state.getValue(AGE) >= 2) {
            return List.of(sticks, CropSeedItem.stack(crop, plot.genes()));
        }
        return List.of(sticks);
    }

    private void schedule(ServerLevel level, BlockPos pos) {
        level.scheduleTick(pos, this, INTERVAL + level.random.nextInt(21));
    }

    private static boolean growing(ServerLevel level, BlockPos pos, CropCatalog.Crop definition, SeedGenes genes) {
        int lightNeeded = Math.max(7, 10 - (genes.resistance() - 1) / 10);
        var soil = level.getBlockState(pos.below());
        boolean hydrated = soil.is(Blocks.FARMLAND) && soil.getValue(FarmBlock.MOISTURE) > 0;
        return level.getRawBrightness(pos, 0) >= lightNeeded
                && (hydrated || genes.resistance() >= 16)
                && hasSubstrate(level, pos, definition);
    }

    private static boolean hasSubstrate(LevelReader level, BlockPos pos, CropCatalog.Crop definition) {
        String required = definition.substrate();
        if (required.isEmpty()) return true;
        BlockState substrate = level.getBlockState(pos.below(2));
        if (required.startsWith("#")) {
            return substrate.is(TagKey.create(Registries.BLOCK, new ResourceLocation(required.substring(1))));
        }
        return new ResourceLocation(required).equals(ForgeRegistries.BLOCKS.getKey(substrate.getBlock()));
    }

    @Nullable
    private static CropCatalog.Crop fromSeed(ItemStack stack) {
        if (stack.is(GregCrops.SEED_PACKET.get())) {
            return stack.hasTag() ? CropCatalog.BY_ID.get(stack.getTag().getString("Crop")) : null;
        }
        if (stack.isEmpty()) return null;
        ResourceLocation itemId = ForgeRegistries.ITEMS.getKey(stack.getItem());
        for (var definition : CropCatalog.ALL) {
            if (!definition.starterItem().isEmpty() && definition.starterItem().equals(String.valueOf(itemId))) return definition;
        }
        return null;
    }

    private static void plant(ServerLevel level, BlockPos pos, CropCatalog.Crop definition, SeedGenes genes) {
        var block = GregCrops.PLOTS.get(definition.id()).get();
        level.setBlock(pos, block.defaultBlockState(), Block.UPDATE_ALL);
        if (level.getBlockEntity(pos) instanceof CropPlotEntity plot) plot.setGenes(genes);
    }

    private record Parent(CropCatalog.Crop definition, SeedGenes genes) {}

    private static boolean breed(ServerLevel level, BlockPos pos, RandomSource random) {
        List<Parent> parents = new ArrayList<>(4);
        for (Direction direction : Direction.Plane.HORIZONTAL) {
            BlockPos side = pos.relative(direction);
            if (!level.hasChunkAt(side)) continue;
            BlockState state = level.getBlockState(side);
            if (state.getBlock() instanceof CropPlotBlock block && block.crop != null && state.getValue(AGE) == MAX_AGE
                    && level.getBlockEntity(side) instanceof CropPlotEntity plot && hasSubstrate(level, side, block.crop)) {
                parents.add(new Parent(block.crop, plot.genes()));
            }
        }
        if (parents.size() < 2) return false;

        Parent first = parents.remove(random.nextInt(parents.size()));
        Parent second = parents.get(random.nextInt(parents.size()));
        SeedGenes inherited = SeedGenes.inherit(first.genes(), second.genes(), random);
        List<CropCatalog.Crop> mutations = new ArrayList<>();
        for (var definition : CropCatalog.ALL) {
            if (definition.crosses().stream().anyMatch(pair -> matches(pair, first.definition(), second.definition()))
                    && growing(level, pos, definition, inherited)) {
                mutations.add(definition);
            }
        }
        if (!mutations.isEmpty()) {
            var child = mutations.get(random.nextInt(mutations.size()));
            if (random.nextInt(9 + child.tier() * 3) == 0) {
                plant(level, pos, child, inherited);
                return true;
            }
        }
        if (first.definition() == second.definition() && growing(level, pos, first.definition(), inherited)
                && random.nextInt(8) == 0) {
            plant(level, pos, first.definition(), inherited);
            return true;
        }
        return false;
    }

    private static boolean matches(CropCatalog.ParentPair pair, CropCatalog.Crop a, CropCatalog.Crop b) {
        return pair.first().equals(a.id()) && pair.second().equals(b.id())
                || pair.first().equals(b.id()) && pair.second().equals(a.id());
    }

    private void inspect(Level level, BlockPos pos, BlockState state, Player player) {
        if (crop == null || !(level.getBlockEntity(pos) instanceof CropPlotEntity plot)) {
            player.displayClientMessage(Component.translatable("message.gtibdcrops.empty"), true);
            return;
        }
        SeedGenes genes = plot.genes();
        var message = Component.translatable("message.gtibdcrops.inspect", getName(),
                state.getValue(AGE), MAX_AGE, genes.growth(), genes.gain(), genes.resistance());
        if (plot.isReplenishingProduce()) message.append(Component.translatable("message.gtibdcrops.produce_regrowing"));
        player.displayClientMessage(message, true);
    }

    private static void consume(Player player, ItemStack stack) {
        if (!player.getAbilities().instabuild) stack.shrink(1);
    }

    private static void drop(ServerLevel level, BlockPos pos, ItemStack stack) {
        Containers.dropItemStack(level, pos.getX() + 0.5, pos.getY() + 0.4, pos.getZ() + 0.5, stack);
    }
}
