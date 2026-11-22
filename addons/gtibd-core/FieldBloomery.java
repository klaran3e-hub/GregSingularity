package gtibd.addon;

import com.gregtechceu.gtceu.api.capability.recipe.IO;
import com.gregtechceu.gtceu.api.gui.GuiTextures;
import com.gregtechceu.gtceu.api.gui.UITemplate;
import com.gregtechceu.gtceu.api.gui.widget.SlotWidget;
import com.gregtechceu.gtceu.api.machine.IMachineBlockEntity;
import com.gregtechceu.gtceu.api.machine.property.GTMachineModelProperties;
import com.gregtechceu.gtceu.api.registry.registrate.MultiblockMachineBuilder;
import com.gregtechceu.gtceu.api.machine.trait.NotifiableItemStackHandler;
import com.gregtechceu.gtceu.api.transfer.item.CustomItemStackHandler;
import com.gregtechceu.gtceu.common.machine.multiblock.primitive.PrimitiveFancyUIWorkableMachine;
import com.lowdragmc.lowdraglib.gui.modular.ModularUI;
import com.lowdragmc.lowdraglib.gui.texture.ResourceTexture;
import com.lowdragmc.lowdraglib.gui.widget.LabelWidget;
import com.lowdragmc.lowdraglib.gui.widget.ProgressWidget;
import net.minecraft.network.chat.Component;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraftforge.registries.ForgeRegistries;

import java.util.Set;

public final class FieldBloomery extends PrimitiveFancyUIWorkableMachine {
    private static final Set<String> LOADED = Set.of(
            "kubejs:copper_charge", "kubejs:tin_charge", "kubejs:iron_charge",
            "kubejs:gold_charge", "kubejs:bronze_charge", "kubejs:roasted_alloy_feed");
    private static final Set<String> CASTINGS = Set.of(
            "minecraft:copper_ingot", "minecraft:gold_ingot", "kubejs:iron_bloom",
            "gtceu:tin_ingot", "gtceu:bronze_ingot");
    private static final String[] INPUT = {"charge", "fuel", "mould"};
    private static final String[] OUTPUT = {"casting", "crucible", "roasted"};

    public FieldBloomery(IMachineBlockEntity holder) {
        super(holder);
    }

    public static MultiblockMachineBuilder configureModel(MultiblockMachineBuilder builder) {
        builder.modelProperty(GTMachineModelProperties.IS_FORMED, Boolean.FALSE);
        return builder;
    }

    @Override
    protected NotifiableItemStackHandler createImportItemHandler(Object... args) {
        return createSlots(IO.IN);
    }

    @Override
    protected NotifiableItemStackHandler createExportItemHandler(Object... args) {
        return createSlots(IO.OUT);
    }

    private NotifiableItemStackHandler createSlots(IO direction) {
        return new NotifiableItemStackHandler(this, 3, direction, direction, size ->
                new CustomItemStackHandler(size) {
                    @Override
                    public boolean isItemValid(int slot, ItemStack stack) {
                        if (!super.isItemValid(slot, stack)) return false;
                        String id = String.valueOf(ForgeRegistries.ITEMS.getKey(stack.m_41720_()));
                        return direction == IO.IN ? switch (slot) {
                            case 0 -> LOADED.contains(id);
                            case 1 -> id.equals("minecraft:coal") || id.equals("minecraft:charcoal");
                            case 2 -> id.equals("kubejs:ingot_mould") || id.equals("kubejs:bronze_mould_frame");
                            default -> false;
                        } : switch (slot) {
                            case 0 -> CASTINGS.contains(id);
                            case 1 -> id.equals("kubejs:fired_crucible");
                            case 2 -> id.equals("kubejs:roasted_alloy_feed");
                            default -> false;
                        };
                    }
                });
    }

    @Override
    public ModularUI createUI(Player player) {
        var slotTexture = new ResourceTexture("kubejs:textures/gui/field_bloomery_slot.png");
        var ui = new ModularUI(176, 166, this, player)
                .background(new ResourceTexture("kubejs:textures/gui/field_bloomery.png"))
                .widget(new LabelWidget(9, 8, getBlockState().m_60734_().m_7705_()).setTextColor(0xFFE9C7A3))
                .widget(new ProgressWidget(getRecipeLogic()::getProgressPercent, 72, 33, 32, 23,
                        GuiTextures.PRIMITIVE_BLAST_FURNACE_PROGRESS_BAR))
                .widget(UITemplate.bindPlayerInventory(player.m_150109_(), slotTexture, 7, 84, true));

        for (int i = 0; i < 3; i++) {
            ui.widget(slot(importItems, i, 10 + i * 19, true, INPUT[i], slotTexture));
            ui.widget(slot(exportItems, i, 110 + i * 19, false, OUTPUT[i], slotTexture));
        }
        return ui;
    }

    private SlotWidget slot(NotifiableItemStackHandler items, int index, int x, boolean input,
                            String label, ResourceTexture texture) {
        return new SlotWidget(items.storage, index, x, 35, true, input)
                .setBackgroundTexture(texture)
                .setOnAddedTooltips((widget, lines) ->
                        lines.add(Component.m_237115_("gui.gregsingularity.bloomery." + label)));
    }
}
