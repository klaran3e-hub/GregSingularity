package gtibd.crops;

import net.minecraft.core.BlockPos;
import net.minecraft.network.chat.Component;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.BaseEntityBlock;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.RenderShape;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.entity.BlockEntityTicker;
import net.minecraft.world.level.block.entity.BlockEntityType;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.phys.BlockHitResult;
import net.minecraftforge.event.entity.player.PlayerInteractEvent;
import net.minecraftforge.eventbus.api.Event;
import net.minecraftforge.eventbus.api.EventPriority;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

@Mod.EventBusSubscriber(modid = GregCrops.ID)
public final class HarvestBlock extends BaseEntityBlock {
    public HarvestBlock() {
        super(Properties.copy(Blocks.IRON_BLOCK).requiresCorrectToolForDrops());
    }

    @Override
    public HarvesterBlockEntity newBlockEntity(BlockPos pos, BlockState state) {
        return new HarvesterBlockEntity(pos, state);
    }

    @Override
    public RenderShape getRenderShape(BlockState state) {
        return RenderShape.MODEL;
    }

    @Override
    public <T extends BlockEntity> BlockEntityTicker<T> getTicker(
            Level level, BlockState state, BlockEntityType<T> type) {
        if (level.isClientSide) return null;
        return createTickerHelper(type, GregCrops.HARVESTER_ENTITY.get(), HarvesterBlockEntity::tick);
    }

    @Override
    public InteractionResult use(BlockState state, Level level, BlockPos pos, Player player,
            InteractionHand hand, BlockHitResult hit) {
        if (!(level.getBlockEntity(pos) instanceof HarvesterBlockEntity harvester)) return InteractionResult.PASS;

        ItemStack held = player.getItemInHand(hand);
        if (held.is(GregCrops.ANALYZER.get())) {
            if (!level.isClientSide) {
                String key = harvester.installAnalyzer(held)
                        ? "message.gtibdcrops.harvester.analyzer_installed"
                        : "message.gtibdcrops.harvester.analyzer_already_installed";
                player.displayClientMessage(Component.translatable(key), true);
            }
            return InteractionResult.sidedSuccess(level.isClientSide);
        }

        if (player.isShiftKeyDown() && held.isEmpty()) {
            if (!level.isClientSide) {
                ItemStack analyzer = harvester.removeAnalyzer();
                if (analyzer.isEmpty()) {
                    player.displayClientMessage(Component.translatable("message.gtibdcrops.harvester.no_analyzer"), true);
                } else {
                    if (!player.getInventory().add(analyzer)) player.drop(analyzer, false);
                    player.displayClientMessage(Component.translatable("message.gtibdcrops.harvester.analyzer_removed"), true);
                }
            }
            return InteractionResult.sidedSuccess(level.isClientSide);
        }
        return InteractionResult.PASS;
    }

    @SubscribeEvent(priority = EventPriority.LOW)
    public static void allowEmptyHandRemoval(PlayerInteractEvent.RightClickBlock event) {
        if (event.getHand() == InteractionHand.MAIN_HAND
                && event.getUseBlock() != Event.Result.DENY
                && event.getEntity().isShiftKeyDown()
                && event.getItemStack().isEmpty()
                && !event.getEntity().getOffhandItem().isEmpty()
                && event.getLevel().getBlockState(event.getPos()).getBlock() instanceof HarvestBlock) {
            event.setUseBlock(Event.Result.ALLOW);
        }
    }

    @Override
    public void onRemove(BlockState state, Level level, BlockPos pos, BlockState replacement, boolean moving) {
        if (!state.is(replacement.getBlock())
                && !level.isClientSide
                && level.getBlockEntity(pos) instanceof HarvesterBlockEntity harvester) {
            harvester.dropContents();
        }
        super.onRemove(state, level, pos, replacement, moving);
    }
}
