package gtibd.crops;

import java.util.List;
import net.minecraft.network.chat.Component;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.TooltipFlag;
import net.minecraft.world.level.Level;
import org.jetbrains.annotations.Nullable;

final class CropSeedItem extends Item {
    static final int FULL_ANALYSIS = 3;

    CropSeedItem() {
        super(new Item.Properties().stacksTo(16));
    }

    static ItemStack stack(CropCatalog.Crop crop, SeedGenes genes) {
        ItemStack stack = new ItemStack(GregCrops.SEED_PACKET.get());
        var tag = stack.getOrCreateTag();
        tag.putString("Crop", crop.id());
        genes.save(tag);
        return stack;
    }

    @Override
    public Component getName(ItemStack stack) {
        String id = stack.getTag() == null ? "" : stack.getTag().getString("Crop");
        return analysis(stack) > 0 && CropCatalog.BY_ID.containsKey(id)
                ? Component.translatable("item.gtibdcrops.seed_named", Component.translatable("block.gtibdcrops." + id + "_plot"))
                : super.getName(stack);
    }

    @Override
    public void appendHoverText(ItemStack stack, @Nullable Level level, List<Component> tooltip, TooltipFlag flag) {
        var tag = stack.getTag();
        if (tag == null) return;
        int scan = analysis(stack);
        if (scan >= 2) {
            var crop = CropCatalog.BY_ID.get(tag.getString("Crop"));
            if (crop != null) tooltip.add(Component.translatable("message.gtibdcrops.tier", crop.tier()));
        }
        if (scan >= FULL_ANALYSIS) {
            SeedGenes genes = SeedGenes.fromTag(tag);
            tooltip.add(Component.translatable("message.gtibdcrops.genes", genes.growth(), genes.gain(), genes.resistance()));
        } else {
            tooltip.add(Component.translatable("message.gtibdcrops.seed_scan", scan, FULL_ANALYSIS));
        }
    }

    static int analysis(ItemStack stack) {
        return stack.getTag() == null ? 0 : Math.max(0, Math.min(FULL_ANALYSIS, stack.getTag().getInt("Analysis")));
    }
}
