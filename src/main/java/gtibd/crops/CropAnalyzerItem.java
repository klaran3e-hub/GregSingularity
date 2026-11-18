package gtibd.crops;

import net.minecraft.network.chat.Component;
import net.minecraft.world.InteractionHand;
import net.minecraft.world.InteractionResultHolder;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;

final class CropAnalyzerItem extends Item {
    CropAnalyzerItem() {
        super(new Item.Properties().stacksTo(1));
    }

    @Override
    public InteractionResultHolder<ItemStack> use(Level level, Player player, InteractionHand hand) {
        ItemStack analyzer = player.getItemInHand(hand);
        ItemStack seeds = player.getItemInHand(hand == InteractionHand.MAIN_HAND ? InteractionHand.OFF_HAND : InteractionHand.MAIN_HAND);
        if (!seeds.is(GregCrops.SEED_PACKET.get()) || !seeds.hasTag()
                || !CropCatalog.BY_ID.containsKey(seeds.getTag().getString("Crop"))) {
            return InteractionResultHolder.pass(analyzer);
        }
        if (!level.isClientSide) {
            int scan = Math.min(CropSeedItem.FULL_ANALYSIS, CropSeedItem.analysis(seeds) + 1);
            seeds.getOrCreateTag().putInt("Analysis", scan);
            player.displayClientMessage(Component.translatable("message.gtibdcrops.seed_scan", scan, CropSeedItem.FULL_ANALYSIS), true);
        }
        return InteractionResultHolder.sidedSuccess(analyzer, level.isClientSide);
    }
}
