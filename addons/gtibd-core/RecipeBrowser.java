package gtibd.addon;

import com.gregtechceu.gtceu.api.recipe.GTRecipe;
import com.gregtechceu.gtceu.api.registry.GTRegistries;
import com.gregtechceu.gtceu.common.data.GTRecipeTypes;
import com.gregtechceu.gtceu.integration.jei.recipe.GTRecipeJEICategory;
import earth.terrarium.adastra.common.recipes.SpaceStationRecipe;
import earth.terrarium.adastra.common.registry.ModRecipeTypes;
import java.util.Arrays;
import mezz.jei.api.IModPlugin;
import mezz.jei.api.JeiPlugin;
import mezz.jei.api.constants.VanillaTypes;
import mezz.jei.api.gui.builder.IRecipeLayoutBuilder;
import mezz.jei.api.gui.drawable.IDrawable;
import mezz.jei.api.gui.ingredient.IRecipeSlotsView;
import mezz.jei.api.helpers.IGuiHelper;
import mezz.jei.api.recipe.IFocusGroup;
import mezz.jei.api.recipe.RecipeIngredientRole;
import mezz.jei.api.recipe.RecipeType;
import mezz.jei.api.recipe.category.IRecipeCategory;
import mezz.jei.api.registration.IIngredientAliasRegistration;
import mezz.jei.api.registration.IRecipeCatalystRegistration;
import mezz.jei.api.registration.IRecipeCategoryRegistration;
import mezz.jei.api.registration.IRecipeRegistration;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.ItemStack;
import net.minecraftforge.registries.ForgeRegistries;

@JeiPlugin
public final class RecipeBrowser implements IModPlugin {
    private static final RecipeType<SpaceStationRecipe> STATIONS =
        new RecipeType<>(FieldworkSpace.id("station_construction"), SpaceStationRecipe.class);
    private RecipeType<GTRecipe> furnaces;

    @Override public ResourceLocation getPluginUid() { return FieldworkSpace.id("production"); }

    @Override public void registerCategories(IRecipeCategoryRegistration registration) {
        // GT normally routes its furnaces to vanilla smelting. Machine-only recipes need their own display.
        var furnace = new GTRecipeJEICategory(registration.getJeiHelpers(), GTRecipeTypes.FURNACE_RECIPES.getCategory()) {
            @Override public Component getTitle() { return Component.m_237115_("jei.gtibd_core.machine_smelting"); }
        };
        furnaces = furnace.getRecipeType();
        registration.addRecipeCategories(furnace, new Stations(registration.getJeiHelpers().getGuiHelper()));
    }

    @Override public void registerRecipes(IRecipeRegistration registration) {
        var level = Minecraft.m_91087_().f_91073_;
        if (level == null) return;
        var recipes = level.m_7465_();
        registration.addRecipes(furnaces, recipes.m_44013_(GTRecipeTypes.FURNACE_RECIPES).stream()
            .filter(recipe -> recipe.m_6423_().m_135827_().equals("zero_shift")).toList());
        registration.addRecipes(STATIONS, recipes.m_44013_(ModRecipeTypes.SPACE_STATION_RECIPE.get()));
    }

    @Override public void registerIngredientAliases(IIngredientAliasRegistration registration) {
        for (int tier = 1; tier <= 4; tier++) {
            var id = new ResourceLocation("ad_astra", "tier_" + tier + "_rocket");
            addRocketAliases(registration, new ItemStack(ForgeRegistries.ITEMS.getValue(id)), tier);
        }
        for (var ship : FieldworkSpace.Ship.values()) {
            addRocketAliases(registration, new ItemStack(ship.item.get()), ship.tier);
        }
    }

    private static void addRocketAliases(IIngredientAliasRegistration registration, ItemStack stack, int tier) {
        registration.addAliases(VanillaTypes.ITEM_STACK, stack, FieldworkSpace.rocketSearchAliases(tier));
    }

    @Override public void registerRecipeCatalysts(IRecipeCatalystRegistration registration) {
        for (var machine : GTRegistries.MACHINES) {
            if (Arrays.asList(machine.getRecipeTypes()).contains(GTRecipeTypes.FURNACE_RECIPES)) {
                registration.addRecipeCatalyst(machine.asStack(), furnaces);
            }
        }
        registration.addRecipeCatalyst(stationMap(), STATIONS);
    }

    private static ItemStack stationMap() {
        return new ItemStack(ForgeRegistries.ITEMS.getValue(new ResourceLocation("ad_astra", "ti_69")));
    }

    private static final class Stations implements IRecipeCategory<SpaceStationRecipe> {
        private final IDrawable icon;
        Stations(IGuiHelper gui) { icon = gui.createDrawableItemStack(stationMap()); }
        @Override public RecipeType<SpaceStationRecipe> getRecipeType() { return STATIONS; }
        @Override public Component getTitle() { return Component.m_237115_("jei.gtibd_core.station_construction"); }
        @Override public IDrawable getIcon() { return icon; }
        @Override public int getWidth() { return 154; }
        @Override public int getHeight() { return 82; }
        @Override public ResourceLocation getRegistryName(SpaceStationRecipe recipe) { return recipe.id(); }

        @Override public void setRecipe(IRecipeLayoutBuilder builder, SpaceStationRecipe recipe, IFocusGroup focuses) {
            for (int i = 0; i < recipe.ingredients().size(); i++) {
                var cost = recipe.ingredients().get(i);
                var stacks = Arrays.stream(cost.ingredient().m_43908_())
                    .map(stack -> stack.m_255036_(cost.count())).toList();
                builder.addSlot(RecipeIngredientRole.INPUT, 2 + (i % 7) * 21, 19 + (i / 7) * 20)
                    .addItemStacks(stacks).setStandardSlotBackground();
            }
        }

        @Override public void draw(SpaceStationRecipe recipe, IRecipeSlotsView slots, GuiGraphics gui, double x, double y) {
            var dimension = recipe.dimension().m_135782_();
            var label = Component.m_237115_(dimension.m_214296_("dimension"));
            gui.m_280614_(Minecraft.m_91087_().f_91062_, label, 1, 2, 0x404040, false);
        }
    }
}
