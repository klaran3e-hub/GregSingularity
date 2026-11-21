package gtibd.addon;

import earth.terrarium.botarium.common.fluid.FluidConstants;
import earth.terrarium.botarium.common.fluid.base.FluidHolder;
import earth.terrarium.botarium.common.fluid.utils.QuantifiedFluidIngredient;
import mezz.jei.api.gui.builder.IRecipeLayoutBuilder;
import mezz.jei.api.recipe.RecipeIngredientRole;

public final class JeiAdAstraFluids {
    private JeiAdAstraFluids() {}

    /** Ad Astra draws its tanks directly. Supply the same fluids to JEI's recipe and usage index. */
    public static void index(IRecipeLayoutBuilder layout, QuantifiedFluidIngredient input, FluidHolder output) {
        var sources = layout.addInvisibleIngredients(RecipeIngredientRole.INPUT);
        long inputMb = FluidConstants.toMillibuckets(input.getFluidAmount());
        for (FluidHolder option : input.getFluids()) {
            if (!option.isEmpty()) sources.addFluidStack(option.getFluid(), inputMb, option.getCompound());
        }
        if (!output.isEmpty()) {
            layout.addInvisibleIngredients(RecipeIngredientRole.OUTPUT)
                .addFluidStack(output.getFluid(), FluidConstants.toMillibuckets(output.getFluidAmount()), output.getCompound());
        }
    }
}
