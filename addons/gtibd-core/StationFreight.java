package gtibd.addon;

import earth.terrarium.adastra.common.recipes.SpaceStationRecipe;
import earth.terrarium.adastra.common.recipes.base.IngredientHolder;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.List;

/** Payment used by the native server-side Ad Astra station construction screen. */
public final class StationFreight {
    private StationFreight() {}

    public static boolean pay(Player player, Level level, SpaceStationRecipe recipe) {
        if (player.m_7500_() || player.m_5833_()) return true;
        Inventory inventory = player.m_150109_();
        List<IngredientHolder> ingredients = recipe.ingredients();
        int slots = inventory.m_6643_();
        int firstIngredient = 1 + slots;
        int sink = firstIngredient + ingredients.size();
        int[][] capacity = new int[sink + 1][sink + 1];
        for (int i = 0; i < ingredients.size(); i++) {
            capacity[firstIngredient + i][sink] = ingredients.get(i).count();
        }
        for (int i = 0; i < slots; i++) {
            ItemStack stack = inventory.m_8020_(i);
            if (stack.m_41619_()) continue;
            int available = stack.m_41613_();
            capacity[0][i + 1] = available;
            for (int j = 0; j < ingredients.size(); j++) {
                if (ingredients.get(j).ingredient().test(stack)) {
                    capacity[i + 1][firstIngredient + j] = available;
                }
            }
        }

        // A shared tag can match several costs. Residual paths can reassign a
        // matched slot to another cost without taking any inventory prematurely.
        while (reserveBatch(capacity, sink)) {}
        for (int i = firstIngredient; i < sink; i++) {
            if (capacity[i][sink] != 0) return false;
        }
        for (int i = 0; i < slots; i++) {
            int used = capacity[i + 1][0];
            if (used > 0) inventory.m_7407_(i, used);
        }
        inventory.m_6596_();
        return true;
    }

    private static boolean reserveBatch(int[][] capacity, int sink) {
        int[] previous = new int[capacity.length];
        Arrays.fill(previous, -1);
        previous[0] = 0;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(0);
        while (!queue.isEmpty() && previous[sink] < 0) {
            int from = queue.removeFirst();
            for (int to = 1; to <= sink; to++) {
                if (capacity[from][to] <= 0 || previous[to] >= 0) continue;
                previous[to] = from;
                queue.addLast(to);
            }
        }
        if (previous[sink] < 0) return false;
        int count = Integer.MAX_VALUE;
        for (int at = sink; at != 0; at = previous[at]) {
            count = Math.min(count, capacity[previous[at]][at]);
        }
        for (int at = sink; at != 0; at = previous[at]) {
            int from = previous[at];
            capacity[from][at] -= count;
            capacity[at][from] += count;
        }
        return true;
    }
}
