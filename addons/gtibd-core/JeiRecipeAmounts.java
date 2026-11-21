package gtibd.addon;

import java.util.Arrays;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.crafting.Ingredient;

public final class JeiRecipeAmounts {
    private JeiRecipeAmounts() {}

    /** A display ingredient for ExtendedAE's cutter. Its machine stores the required count separately. */
    public static Ingredient countedPreview(Ingredient ingredient, int count) {
        if (count == 1) return ingredient;
        ItemStack[] displayStacks = Arrays.stream(ingredient.m_43908_())
            .map(stack -> stack.m_255036_(count))
            .toArray(ItemStack[]::new);
        return Ingredient.m_43927_(displayStacks);
    }
}
