package gtibd.crops;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.StringJoiner;

public final class GenerateRecipes {
    private static final Path RECIPE_DIRECTORY = Path.of("data", "gtibdcrops", "recipes", "standalone");
    private static final int[] EU_PER_TICK = {0, 28, 112, 448, 1792, 7168, 28672, 114688};

    private GenerateRecipes() {}

    public static void main(String[] args) throws IOException {
        if (args.length != 1) throw new IllegalArgumentException("Expected output resource directory");
        Path directory = Path.of(args[0]).resolve(RECIPE_DIRECTORY);
        generateMachines(directory);
        for (CropCatalog.Crop crop : CropCatalog.ALL) {
            if (crop.tier() > 0) generateCentrifugeRecipe(directory.resolve("extract"), crop);
        }
    }

    private static void generateMachines(Path directory) throws IOException {
        writeRecipe(directory.resolve("crop_analyzer.json"), "assembler", 840, EU_PER_TICK[1],
                contents(List.of(
                        item("gtceu:lv_sensor", 1),
                        item("gtceu:basic_electronic_circuit", 1),
                        item("minecraft:glass_pane", 2),
                        item("gtceu:tin_plate", 2),
                        item("gtceu:rubber_plate", 2)
                ), List.of(fluid("gtceu:soldering_alloy", 144, true))),
                contents(List.of(item("gtibdcrops:crop_analyzer", 1)), List.of()));
        writeRecipe(directory.resolve("lv_crop_harvester.json"), "assembler", 1800, EU_PER_TICK[1],
                contents(List.of(
                        item("gtceu:lv_machine_hull", 1),
                        item("gtceu:lv_electric_motor", 2),
                        item("gtceu:lv_sensor", 1),
                        item("gtceu:lv_conveyor_module", 2),
                        item("gtceu:lv_robot_arm", 1),
                        item("gtceu:basic_electronic_circuit", 2),
                        item("gtceu:steel_plate", 4),
                        item("gtibdcrops:crop_sticks", 4)
                ), List.of(fluid("gtceu:lubricant", 500, true))),
                contents(List.of(item("gtibdcrops:lv_crop_harvester", 1)), List.of()));
    }

    private static void generateCentrifugeRecipe(Path directory, CropCatalog.Crop crop) throws IOException {
        CropCatalog.Output output = standaloneOutput(crop);
        List<String> inputs = List.of(item("gtibdcrops:" + crop.id() + "_harvest", 3),
                item(output.sampleItem(), 1, false));
        List<String> fluidSamples = output.fluid() ? List.of(fluid(output.id(), 1000, false)) : List.of();
        String outputs = output.fluid()
                ? contents(List.of(), List.of(fluid(output.id(), output.amount(), true)))
                : contents(List.of(item(output.id(), output.amount())), List.of());
        writeRecipe(directory.resolve(crop.id() + ".json"), "centrifuge",
                240 + crop.tier() * 100, EU_PER_TICK[crop.tier()], contents(inputs, fluidSamples), outputs);
    }

    private static CropCatalog.Output standaloneOutput(CropCatalog.Crop crop) {
        return switch (crop.id()) {
            case "hemp" -> new CropCatalog.Output("minecraft:string", 1, false, "minecraft:string");
            case "tea" -> new CropCatalog.Output("minecraft:sugar", 1, false, "minecraft:sugar");
            case "oilberries" -> new CropCatalog.Output("gtceu:oil", 50, true, "minecraft:coal");
            case "canola" -> new CropCatalog.Output("gtceu:seed_oil", 75, true, "minecraft:wheat_seeds");
            default -> crop.output();
        };
    }

    private static String contents(List<String> items, List<String> fluids) {
        var fields = new StringJoiner(", ", "{ ", " }");
        if (!items.isEmpty()) fields.add("\"item\": [" + String.join(", ", items) + "]");
        if (!fluids.isEmpty()) fields.add("\"fluid\": [" + String.join(", ", fluids) + "]");
        return fields.toString();
    }

    private static String item(String id, int count) {
        return item(id, count, true);
    }

    private static String item(String id, int count, boolean consumed) {
        String ingredient = "{ \"item\": \"%s\" }".formatted(id);
        if (count > 1) {
            ingredient = "{ \"type\": \"gtceu:sized\", \"count\": %d, \"ingredient\": %s }"
                    .formatted(count, ingredient);
        }
        return content(ingredient, consumed);
    }

    private static String fluid(String id, int amount, boolean consumed) {
        return content("{ \"value\": \"%s\", \"amount\": %d }".formatted(id, amount), consumed);
    }

    private static String content(String ingredient, boolean consumed) {
        return "{ \"content\": %s%s }".formatted(ingredient, consumed ? "" : ", \"chance\": 0");
    }

    private static void writeRecipe(Path path, String machine, int duration, int euPerTick,
                                    String inputs, String outputs) throws IOException {
        Files.createDirectories(path.getParent());
        Files.writeString(path, """
                {
                  "type": "gtceu:%s",
                  "duration": %d,
                  "inputs": %s,
                  "outputs": %s,
                  "tickInputs": { "eu": [{ "content": %d }] }
                }
                """.formatted(machine, duration, inputs, outputs, euPerTick));
    }
}
