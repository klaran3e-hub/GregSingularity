package gtibd.addon;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import net.minecraft.resources.ResourceKey;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.core.Registry;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.IForgeRegistry;
import net.minecraftforge.registries.MissingMappingsEvent;

@Mod.EventBusSubscriber(modid = FieldworkSpace.MOD)
public final class RegistryMigration {
    private record Move(boolean block, String id, String tab) {}

    private static final Map<String, Move> MOVES = load();
    private static final Map<String, String> LEGACY = legacyIds();

    private RegistryMigration() {}

    private static Map<String, Move> load() {
        var result = new LinkedHashMap<String, Move>();
        var data = Objects.requireNonNull(RegistryMigration.class.getResourceAsStream(
                "/gregsingularity-registry.tsv"), "Missing GregSingularity registry migration");
        try (var reader = new BufferedReader(new InputStreamReader(data, StandardCharsets.UTF_8))) {
            for (String line; (line = reader.readLine()) != null; ) {
                String[] fields = line.split("\t", -1);
                if (fields.length != 4 || (!fields[0].equals("item") && !fields[0].equals("block"))) {
                    throw new IOException("Invalid GregSingularity registry migration entry: " + line);
                }
                if (result.putIfAbsent(fields[1], new Move(fields[0].equals("block"), fields[2], fields[3])) != null) {
                    throw new IOException("Duplicate GregSingularity registry migration entry: " + fields[1]);
                }
            }
        } catch (IOException e) {
            throw new ExceptionInInitializerError(e);
        }
        return result;
    }

    public static String destination(String id) {
        var move = MOVES.get(id);
        return move == null ? id : move.id();
    }

    private static Map<String, String> legacyIds() {
        var result = new LinkedHashMap<String, String>();
        MOVES.forEach((oldId, move) -> {
            if (result.putIfAbsent(move.id(), oldId) != null) {
                throw new IllegalStateException("Duplicate destination: " + move.id());
            }
        });
        return result;
    }

    public static String legacyId(String id) {
        return LEGACY.getOrDefault(id, id);
    }

    public static List<String> itemsInTab(String tab) {
        return MOVES.values().stream().filter(move -> tab.equals(move.tab())).map(Move::id).toList();
    }

    @SubscribeEvent
    public static void remapMissing(MissingMappingsEvent event) {
        remap(event, ForgeRegistries.Keys.ITEMS, ForgeRegistries.ITEMS, false);
        remap(event, ForgeRegistries.Keys.BLOCKS, ForgeRegistries.BLOCKS, true);
    }

    private static <T> void remap(MissingMappingsEvent event, ResourceKey<Registry<T>> key,
                                  IForgeRegistry<T> registry, boolean blocksOnly) {
        for (var mapping : event.getAllMappings(key)) {
            var move = MOVES.get(mapping.getKey().toString());
            if (move == null || (blocksOnly && !move.block())) continue;
            var target = new ResourceLocation(move.id());
            if (registry.containsKey(target)) mapping.remap(registry.getValue(target));
        }
    }
}
