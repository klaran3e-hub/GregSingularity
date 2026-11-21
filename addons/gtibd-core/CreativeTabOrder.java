package gtibd.addon;

import java.util.ArrayList;
import java.util.List;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraftforge.common.CreativeModeTabRegistry;

public final class CreativeTabOrder {
    private static final List<ResourceLocation> SECTIONS = List.of(
        new ResourceLocation("kubejs", "tab"),
        new ResourceLocation("gtibd_core", "tools"),
        new ResourceLocation("gtibd_core", "industry"),
        new ResourceLocation("gtibd_core", "electronics"),
        new ResourceLocation("gtibd_core", "chemistry"),
        new ResourceLocation("gtibd_core", "space"),
        new ResourceLocation("gtibd_core", "logistics"),
        new ResourceLocation("gtibd_core", "factory")
    );

    private CreativeTabOrder() {}

    /** Keep Forge's order for other mods, grouping the Core sections at their first position. */
    public static List<CreativeModeTab> groupSections(List<CreativeModeTab> tabs) {
        var present = new ArrayList<CreativeModeTab>(SECTIONS.size());
        for (var key : SECTIONS) {
            var tab = CreativeModeTabRegistry.getTab(key);
            if (tab != null && tabs.contains(tab)) present.add(tab);
        }
        if (present.size() < 2) return tabs;

        var ordered = new ArrayList<CreativeModeTab>(tabs.size());
        boolean inserted = false;
        for (var tab : tabs) {
            if (!present.contains(tab)) {
                ordered.add(tab);
            } else if (!inserted) {
                ordered.addAll(present);
                inserted = true;
            }
        }
        return ordered;
    }
}
