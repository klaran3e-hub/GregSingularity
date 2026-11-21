package gtibd.addon;

import net.minecraft.core.BlockPos;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.chunk.ImposterProtoChunk;
import net.minecraft.world.level.chunk.ProtoChunk;
import net.minecraftforge.registries.ForgeRegistries;

import java.util.IdentityHashMap;
import java.util.Map;

public final class GeneratedWorkstations {
    private static final Map<Block, BlockState> DECOR = replacements();

    private GeneratedWorkstations() {}

    private static Map<Block, BlockState> replacements() {
        var result = new IdentityHashMap<Block, BlockState>();
        register(result, "crafting_table", "oak_wood");
        register(result, "furnace", "chiseled_stone_bricks");
        register(result, "blast_furnace", "polished_andesite");
        register(result, "smoker", "brown_terracotta");
        register(result, "stonecutter", "smooth_stone");
        register(result, "smithing_table", "polished_deepslate");
        register(result, "grindstone", "polished_diorite");
        register(result, "cartography_table", "stripped_oak_wood");
        register(result, "fletching_table", "stripped_birch_wood");
        register(result, "loom", "white_terracotta");
        register(result, "barrel", "stripped_spruce_wood");
        register(result, "composter", "spruce_wood");
        register(result, "cauldron", "gray_terracotta");
        register(result, "water_cauldron", "gray_terracotta");
        register(result, "lava_cauldron", "gray_terracotta");
        register(result, "powder_snow_cauldron", "gray_terracotta");
        register(result, "brewing_stand", "yellow_terracotta");
        register(result, "anvil", "polished_blackstone");
        register(result, "chipped_anvil", "polished_blackstone");
        register(result, "damaged_anvil", "polished_blackstone");
        register(result, "campfire", "cobblestone_wall");
        register(result, "soul_campfire", "blackstone_wall");
        register(result, "gold_block", "raw_gold_block");
        register(result, "forestry:escritoire", "stripped_birch_wood");
        return result;
    }

    private static void register(Map<Block, BlockState> result, String source, String decor) {
        var registry = ForgeRegistries.BLOCKS;
        var key = new ResourceLocation(source);
        if (registry.containsKey(key)) {
            result.put(registry.getValue(key), registry.getValue(new ResourceLocation(decor)).m_49966_());
        }
    }

    /** Runs before newly generated sections and block entities are handed to the live level. */
    public static void replace(ServerLevel level, ProtoChunk chunk) {
        if (chunk instanceof ImposterProtoChunk) return;
        // A partially generated chunk can resume from disk after the lighting stage.
        chunk.m_63209_(level.m_7726_().m_7827_());
        chunk.m_284478_(state -> DECOR.containsKey(state.m_60734_()), (cursor, state) -> {
            BlockPos position = cursor.m_7949_();
            BlockState replacement = DECOR.get(state.m_60734_());
            chunk.m_6978_(position, replacement, false);
            chunk.m_8114_(position); // Clear both pending NBT and instantiated block entities.
            level.m_6559_(position, state, replacement); // Update villager points of interest.
        });
    }
}
