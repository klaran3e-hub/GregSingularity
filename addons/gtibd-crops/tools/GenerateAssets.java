package gtibd.crops;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;

public final class GenerateAssets {
    private static final String MOD = "gtibdcrops";
    private static final int SIZE = 16;

    private enum Family { LEAF, FIBRE, METAL, MINERAL, CHEMICAL, FUNGUS }

    private record Palette(int stem, int shade, int leaf, int tip, int fruit) {}

    private final Path assets;
    private final Map<String, String> english = new LinkedHashMap<>();
    private final Map<String, String> russian = new LinkedHashMap<>();

    private GenerateAssets(Path output) {
        assets = output.resolve("assets").resolve(MOD);
    }

    public static void main(String[] args) throws IOException {
        if (args.length != 1) throw new IllegalArgumentException("Expected output resource directory");
        new GenerateAssets(Path.of(args[0])).generate();
    }

    private void generate() throws IOException {
        generateSticks();
        generateTools();
        generateHarvester();
        generateCuttings();
        for (CropCatalog.Crop crop : CropCatalog.ALL) generateCrop(crop);
        addLabel("item.gtibdcrops.seed_named", "%s Seeds", "Семена «%s»");
        addLabel("message.gtibdcrops.genes",
            "Growth %s · Yield %s · Resistance %s", "Рост %s · Урожай %s · Стойкость %s");
        addLabel("message.gtibdcrops.substrate", "Required substrate %s", "Нужный грунт %s");
        addLabel("message.gtibdcrops.empty", "No crop planted", "Здесь ничего не посажено");
        addLabel("message.gtibdcrops.inspect",
            "%s · Stage %s/%s · Growth %s · Yield %s · Resistance %s",
            "%s · Стадия %s/%s · Рост %s · Урожай %s · Стойкость %s");
        addLabel("message.gtibdcrops.produce_regrowing", " · Produce growing", " · Урожай созревает");
        addLabel("message.gtibdcrops.tier", "Tier %s", "Уровень %s");
        addLabel("message.gtibdcrops.seed_scan", "Seed analysis %s/%s", "Анализ семян %s/%s");
        addLabel("message.gtibdcrops.harvester.analyzer_installed",
            "Analyzer installed. Only produce is collected. The plant stays mature.",
            "Анализатор установлен. Сборщик снимает только урожай. Растение остаётся взрослым.");
        addLabel("message.gtibdcrops.harvester.analyzer_already_installed",
            "The harvester already has an analyzer.", "В сборщике уже установлен анализатор.");
        addLabel("message.gtibdcrops.harvester.analyzer_removed",
            "Analyzer removed. The harvester takes cuttings with a chance of produce.",
            "Анализатор снят. Сборщик срезает побеги с шансом получить урожай.");
        addLabel("message.gtibdcrops.harvester.no_analyzer",
            "No analyzer installed. The harvester takes cuttings with a chance of produce.",
            "Анализатора нет. Сборщик срезает побеги с шансом получить урожай.");
        language("en_us", english);
        language("ru_ru", russian);
    }

    private void generateCrop(CropCatalog.Crop crop) throws IOException {
        String id = crop.id();
        String plot = id + "_plot";
        Family family = family(crop);
        Palette palette = palette(crop, family);
        List<String> parts = new ArrayList<>(List.of(stickPart(false), stickPart(true)));
        for (int age = 0; age <= 3; age++) {
            String phase = plot + "_age" + age;
            png("block/" + phase, plant(family, palette, age, id.hashCode()));
            json("models/block/" + phase, """
                {
                  "parent": "minecraft:block/cross",
                  "render_type": "minecraft:cutout",
                  "textures": { "cross": "%s:block/%s" }
                }
                """.formatted(MOD, phase));
            parts.add("""
                { "when": { "age": "%d" }, "apply": { "model": "%s:block/%s" } }
                """.formatted(age, MOD, phase).strip());
        }
        multipart(plot, parts);
        blockLabel(plot, crop.englishName(), crop.russianName());

        if (crop.tier() > 0) {
            String harvest = id + "_harvest";
            boolean stickreed = id.equals("stickreed");
            png("item/" + harvest, stickreed ? latex() : harvest(family, palette, id.hashCode()));
            generatedItem(harvest);
            itemLabel(harvest, stickreed ? "Raw Latex" : crop.englishName() + " Harvest",
                stickreed ? "Сырой латекс" : "Урожай «" + crop.russianName() + "»");
        }
    }

    private void generateCuttings() throws IOException {
        var image = new Pixels();
        var colors = new Palette(0x746342, 0x403c28, 0x788650, 0xa0a76e, 0xad956a);
        image.line(3, 12, 11, 5, colors.shade());
        image.line(3, 11, 11, 4, colors.stem());
        image.line(6, 13, 13, 9, colors.stem());
        blade(image, 7, 8, 5, 4, colors, true);
        blade(image, 9, 8, 13, 5, colors, true);
        blade(image, 9, 11, 12, 8, colors, false);
        image.line(4, 10, 6, 12, 0xba9a63);
        image.dot(5, 11, 0xd0af78);
        png("item/plant_cuttings", image);
        generatedItem("plant_cuttings");
        itemLabel("plant_cuttings", "Plant Cuttings", "Растительные обрезки");
    }

    private static Pixels latex() {
        var image = new Pixels();
        image.dot(8, 2, 0x716044);
        image.line(7, 3, 8, 3, 0x95815c);
        image.line(6, 4, 9, 4, 0xb59968);
        image.line(5, 5, 10, 5, 0xc7ab76);
        image.line(5, 6, 10, 6, 0xd1b882);
        image.line(4, 7, 11, 7, 0xc6a971);
        image.line(4, 8, 11, 8, 0xba9c67);
        image.line(5, 9, 10, 9, 0x9b8051);
        image.line(6, 10, 9, 10, 0x6e5a3c);
        image.line(6, 6, 6, 8, 0xebd4a0);
        image.dot(7, 5, 0xe7cfa0);
        image.line(10, 11, 12, 11, 0xc5ac7b);
        image.line(10, 12, 13, 12, 0xa88b5f);
        image.line(11, 13, 12, 13, 0x786142);
        return image;
    }

    private static Family family(CropCatalog.Crop crop) {
        String product = crop.output().id();
        String root = crop.id();
        if (contains(product, "mushroom", "fungus")) return Family.FUNGUS;
        if (contains(product, "ingot", "nugget", "plate", "metal")
                || contains(root, "ferr", "copp", "cupr", "aur", "tin", "stann", "steel", "bronze", "alum",
                    "nickel", "titan", "tungsten", "iridium", "osmium", "platin", "neutron", "naquad", "chrom",
                    "cobalt", "silver", "bismuth", "antimony", "solder", "lead", "zinc", "vanadium")) {
            return Family.METAL;
        }
        if (crop.output().fluid()
                || contains(product, "poly", "epoxy", "rubber", "resin", "oil", "acid", "plastic", "sulfur")) {
            return Family.CHEMICAL;
        }
        if (contains(product, "gem", "crystal", "quartz", "glowstone", "redstone", "coal", "lapis", "diamond",
                "mica", "apatite", "salt", "graphite", "obsidian", "amethyst", "flint")) {
            return Family.MINERAL;
        }
        if (contains(product, "fiber", "fibre", "cotton", "wool", "string", "reed", "paper", "silk", "sugar", "bamboo", "kelp")
                || contains(root, "fiber", "fibre", "flax", "linen", "hemp", "wheat", "cotton")) {
            return Family.FIBRE;
        }
        return Family.LEAF;
    }

    private static boolean contains(String value, String... fragments) {
        for (String fragment : fragments) if (value.contains(fragment)) return true;
        return false;
    }

    private static Palette palette(CropCatalog.Crop crop, Family family) {
        String product = crop.output().id() + "_" + crop.id();
        int hint = Math.floorMod(product.hashCode(), 13) - 6;
        int fruit;
        if (contains(product, "copper", "cupr", "bronze", "orange", "cinnabar", "carrot")) fruit = 0xc9834d;
        else if (contains(product, "gold", "aurum", "sulfur", "honey", "yellow", "potato")) fruit = 0xd2ab54;
        else if (contains(product, "redstone", "ruby", "rhodium", "red_dye", "nether_wart", "dragon")) fruit = 0xb54c45;
        else if (contains(product, "lapis", "cobalt", "blue_dye", "sapphire", "blueberry")) fruit = 0x627cad;
        else if (contains(product, "naquad", "emerald", "malachite", "uranium", "green_dye")) fruit = 0x78a85d;
        else if (contains(product, "quartz", "tin", "platinum", "neutronium", "white", "silver")) fruit = 0xc9cdc2;
        else if (contains(product, "osmium", "iridium", "amethyst", "purple", "palladium")) fruit = 0xa394b6;
        else if (contains(product, "coal", "oil", "graphite", "rubber", "carbon", "black")) fruit = 0x535655;
        else if (product.contains("red_mushroom")) fruit = 0x9b4739;
        else fruit = switch (family) {
            case LEAF -> 0x9e7557;
            case FIBRE -> 0xc7b58a;
            case METAL -> 0xa1a895;
            case MINERAL -> 0x8799a5;
            case CHEMICAL -> 0xa28b66;
            case FUNGUS -> 0x8b6653;
        };

        fruit = tint(fruit, product.hashCode());
        return switch (family) {
            case LEAF -> new Palette(shade(0x536137, hint), shade(0x314c2b, hint),
                shade(0x5b773c, hint), shade(0x89a156, hint), shade(fruit, hint));
            case FIBRE -> new Palette(shade(0x746437, hint), shade(0x555b33, hint),
                shade(0x82845a, hint), shade(0xc0b279, hint), shade(fruit, hint));
            case METAL -> new Palette(shade(0x525d47, hint), shade(0x354939, hint),
                shade(0x648265, hint), shade(0xa6b78a, hint), shade(fruit, hint));
            case MINERAL -> new Palette(shade(0x5c6455, hint), shade(0x414e48, hint),
                shade(0x678477, hint), shade(0x9cad9a, hint), shade(fruit, hint));
            case CHEMICAL -> new Palette(shade(0x596240, hint), shade(0x354a36, hint),
                shade(0x667054, hint), shade(0xa1a269, hint), shade(fruit, hint));
            case FUNGUS -> new Palette(shade(0x9c8671, hint), shade(0x79604a, hint),
                shade(0x88735e, hint), shade(0xb5a28a, hint), shade(fruit, hint));
        };
    }

    private static Pixels plant(Family family, Palette p, int age, int seed) {
        Pixels image = new Pixels();
        int length = switch (family) {
            case LEAF -> 10;
            case FIBRE -> 13;
            case METAL -> 12;
            case MINERAL -> 11;
            case CHEMICAL -> 10;
            case FUNGUS -> 9;
        };
        int top = 15 - (age == 0 ? 3 : (age == 1 ? length / 2 : (age == 2 ? length - 3 : length)));
        int bend = Math.floorMod(seed, 2) == 0 ? -1 : 1;
        image.line(8, 15, 8 + bend, top, p.stem());
        image.line(7, 15, 7 + bend, top + 2, p.shade());
        image.line(7, 14, 8, 12, p.leaf());
        if (family == Family.FUNGUS) {
            mushroom(image, 8 + bend, top, p.fruit(), age);
            if (age == 3) {
                image.line(7, 15, 4, 11, p.stem());
                mushroom(image, 4, 10, shade(p.fruit(), -13), 1);
            }
            return image;
        }
        if (age == 0) {
            blade(image, 8, 14, 5, 12, p, false);
            blade(image, 8, 13, 10, 11, p, false);
            return image;
        }

        blade(image, 8, 13, 4, 10, p, family == Family.LEAF || family == Family.CHEMICAL);
        blade(image, 8, 12, 12, 9, p, family != Family.FIBRE);
        if (age >= 2) {
            blade(image, 8 + bend, top + 3, 4, top + 1, p, family == Family.LEAF);
            blade(image, 8 + bend, top + 2, 12, top, p, family == Family.CHEMICAL);
        }

        switch (family) {
            case LEAF -> {
                if (age >= 2) {
                    orb(image, 8 + bend, top + 1, p.fruit());
                    if (age == 3) {
                        orb(image, 4, 10, p.fruit());
                        image.dot(11, 7, shade(p.fruit(), 14));
                        image.dot(12, 8, shade(p.fruit(), -24));
                    }
                }
            }
            case FIBRE -> {
                image.line(6, 15, 5, top + 3, p.stem());
                image.line(10, 15, 11, top + 4, p.stem());
                tuft(image, 8 + bend, top, p.fruit(), age);
                if (age == 3) {
                    tuft(image, 5, top + 3, p.fruit(), age);
                    tuft(image, 11, top + 4, p.fruit(), age);
                }
            }
            case METAL -> {
                if (age >= 2) {
                    seedSpine(image, 8 + bend, top, p.fruit());
                    if (age == 3) {
                        seedSpine(image, 4, top + 4, shade(p.fruit(), -8));
                        image.line(8, 11, 5, top + 7, p.stem());
                        image.line(8, 13, 11, top + 8, p.stem());
                    }
                }
            }
            case MINERAL -> {
                if (age >= 2) {
                    facet(image, 8 + bend, top + 1, p.fruit());
                    if (age == 3) facet(image, 5, top + 5, shade(p.fruit(), -12));
                }
            }
            case CHEMICAL -> {
                if (age >= 2) {
                    orb(image, 9 + bend, top + 2, p.fruit());
                    if (age == 3) orb(image, 5, top + 4, shade(p.fruit(), -13));
                }
            }
        }
        return image;
    }

    private static void blade(Pixels image, int x, int y, int tx, int ty, Palette p, boolean broad) {
        int side = Integer.signum(tx - x);
        image.line(x, y, tx, ty, p.shade());
        image.line(x, y - 1, tx, ty - 1, p.leaf());
        image.dot(tx, ty - 1, p.tip());
        if (broad) {
            image.line(x + side, y, tx - side, ty + 1, shade(p.leaf(), -10));
            image.line(x + side * 2, y - 2, tx - side, ty - 1, p.tip());
        }
    }

    private static void orb(Pixels image, int x, int y, int color) {
        image.dot(x, y - 1, shade(color, 13));
        image.dot(x - 1, y, shade(color, 20));
        image.dot(x, y, color);
        image.dot(x + 1, y, shade(color, -24));
        image.dot(x, y + 1, shade(color, -30));
    }

    private static void tuft(Pixels image, int x, int y, int color, int age) {
        image.line(x, y, x, y + 3, shade(color, -15));
        image.dot(x, y, shade(color, 36));
        image.dot(x - 1, y + 1, shade(color, 17));
        if (age >= 2) image.dot(x + 1, y + 2, shade(color, 11));
        if (age == 3) image.dot(x - 1, y + 3, color);
    }

    private static void seedSpine(Pixels image, int x, int y, int color) {
        image.line(x, y, x, y + 4, shade(color, -23));
        image.dot(x, y, shade(color, 28));
        image.dot(x - 1, y + 1, shade(color, 9));
        image.dot(x + 1, y + 2, color);
        image.dot(x - 1, y + 3, shade(color, -9));
    }

    private static void facet(Pixels image, int x, int y, int color) {
        image.dot(x, y - 2, shade(color, 28));
        image.line(x - 1, y - 1, x - 1, y + 2, shade(color, 11));
        image.line(x, y - 1, x, y + 3, color);
        image.line(x + 1, y, x + 1, y + 2, shade(color, -25));
        image.dot(x, y + 3, shade(color, -34));
    }

    private static void mushroom(Pixels image, int x, int y, int color, int age) {
        int width = age >= 2 ? 3 : 1;
        image.line(x - width, y + 1, x + width, y + 1, shade(color, -26));
        image.line(x - width + 1, y, x + width - 1, y, color);
        image.dot(x - 1, y, shade(color, 28));
        if (age >= 2) {
            image.line(x - 1, y - 1, x + 1, y - 1, shade(color, 18));
            image.dot(x, y + 1, shade(color, 12));
            image.dot(x + 1, y, shade(color, -8));
        }
    }

    private static Pixels harvest(Family family, Palette p, int seed) {
        Pixels image = new Pixels();
        image.line(4, 13, 9, 5, p.stem());
        image.line(5, 13, 10, 6, p.shade());
        blade(image, 6, 10, 3, 7, p, true);
        blade(image, 6, 11, 11, 8, p, true);
        switch (family) {
            case LEAF -> {
                orb(image, 10, 5, p.fruit());
                orb(image, 7, 6, shade(p.fruit(), 10));
                orb(image, 12, 8, shade(p.fruit(), -17));
                orb(image, 9, 9, p.fruit());
            }
            case FIBRE -> {
                for (int i = 0; i < 3; i++) {
                    image.line(5 + i, 12, 7 + 2 * i, 4 + i, p.stem());
                    tuft(image, 7 + 2 * i, 3 + i, shade(p.fruit(), 6 * i), 3);
                }
                image.line(5, 11, 8, 11, shade(p.fruit(), -27));
            }
            case METAL -> {
                seedSpine(image, 7, 5, p.fruit());
                seedSpine(image, 10, 3, shade(p.fruit(), 9));
                seedSpine(image, 12, 6, shade(p.fruit(), -16));
            }
            case MINERAL -> {
                facet(image, 7, 6, shade(p.fruit(), -11));
                facet(image, 10, 4, p.fruit());
                facet(image, 12, 7, shade(p.fruit(), -19));
            }
            case CHEMICAL -> {
                int position = 8 + Math.floorMod(seed, 2);
                orb(image, position, 5, p.fruit());
                orb(image, position + 1, 6, p.fruit());
                orb(image, position + 2, 7, shade(p.fruit(), -12));
                image.line(position, 5, position + 2, 6, shade(p.fruit(), 21));
                image.dot(position + 3, 7, shade(p.fruit(), -35));
            }
            case FUNGUS -> {
                mushroom(image, 9, 6, p.fruit(), 3);
                mushroom(image, 6, 9, shade(p.fruit(), -18), 1);
            }
        }
        return image;
    }

    private void generateSticks() throws IOException {
        Pixels wood = new Pixels();
        for (int y = 0; y < SIZE; y++) {
            for (int x = 0; x < SIZE; x++) {
                int variation = Math.floorMod(x * 11 + y * 3 + x * y, 13) - 6;
                wood.dot(x, y, shade(0x7e5b37, variation + (x % 4 == 1 ? 7 : -3)));
            }
        }
        wood.line(3, 1, 3, 14, 0x694a2e);
        wood.line(10, 0, 10, 11, 0x9d7850);
        wood.dot(11, 6, 0x64472b);
        png("block/crop_sticks", wood);

        String left = stick(3, 0, 7, 5, 9, 9, "z", 22.5);
        String right = stick(11, 0, 7, 13, 9, 9, "z", -22.5);
        stickModel("crop_sticks", List.of(left, right));
        stickModel("crop_sticks_cross", List.of(left, right,
            stick(7, 0, 3, 9, 9, 5, "x", -22.5),
            stick(7, 0, 11, 9, 9, 13, "x", 22.5),
            stick(4, 4, 7, 12, 5, 9, "z", -22.5)));
        multipart("crop_sticks", List.of(stickPart(false), stickPart(true)));

        Pixels icon = new Pixels();
        icon.line(3, 13, 12, 3, 0x563b27);
        icon.line(4, 13, 13, 3, 0x896541);
        icon.line(5, 12, 12, 4, 0xb28b5d);
        icon.line(5, 14, 11, 3, 0x6f502d);
        icon.line(4, 3, 11, 13, 0x5b4129);
        icon.line(5, 3, 12, 13, 0xaa8151);
        icon.line(6, 4, 12, 12, 0xc09a63);
        icon.line(5, 5, 10, 13, 0x785632);
        icon.dot(8, 8, 0x614733);
        icon.dot(9, 9, 0x806045);
        png("item/crop_sticks", icon);
        generatedItem("crop_sticks");
        blockLabel("crop_sticks", "Crop Sticks", "Рейки для рассады");
    }

    private static String stickPart(boolean crossed) {
        return """
            { "when": { "crossed": "%s" }, "apply": { "model": "%s:block/crop_sticks%s" } }
            """.formatted(crossed, MOD, crossed ? "_cross" : "").strip();
    }

    private static String stick(int x0, int y0, int z0, int x1, int y1, int z1, String axis, double angle) {
        List<String> faces = new ArrayList<>();
        for (String side : List.of("down", "up", "north", "south", "west", "east")) {
            faces.add("\"" + side + "\": { \"texture\": \"#wood\" }");
        }
        return """
            {
              "from": [%d, %d, %d], "to": [%d, %d, %d],
              "rotation": { "origin": [%d, %d, %d], "axis": "%s", "angle": %s, "rescale": false },
              "faces": { %s }
            }
            """.formatted(x0, y0, z0, x1, y1, z1,
                (x0 + x1) / 2, y0, (z0 + z1) / 2, axis, Double.toString(angle), String.join(", ", faces)).strip();
    }

    private void stickModel(String id, List<String> elements) throws IOException {
        json("models/block/" + id, """
            {
              "parent": "minecraft:block/block",
              "textures": { "wood": "%s:block/crop_sticks", "particle": "#wood" },
              "elements": [%s]
            }
            """.formatted(MOD, String.join(", ", elements)));
    }

    private void generateTools() throws IOException {
        Pixels packet = new Pixels();
        packet.mask(3, 2, Map.of(
            's', 0x5e4837, 'c', 0x937456, 'p', 0xba9c73, 'b', 0xd5bb8d,
            'l', 0xdfc89d, 'g', 0x5e7548, 'v', 0x899962, 'n', 0x775736
        ), "  sssss  ", " scpppcs ", "scbbbbpcs", "sbllllbcs", "sblgglbcs", "sblvggbcs",
           "sblvgnbcs", "sblgvnbcs", "sblnnlbcs", "sbbbbppcs", " scccccs ", "  sssss  ");
        simpleItem("seed_packet", packet, "Seed Packet", "Пакет семян");

        Pixels analyzer = new Pixels();
        analyzer.mask(4, 1, Map.of(
            'd', 0x303d3e, 'm', 0x596569, 'h', 0x8d9999, 's', 0xb6c4bc,
            'r', 0x34575a, 'g', 0x477e6a, 'l', 0x7ba477, 'c', 0xa56743
        ), "  h s   ", "  h s   ", " dddddd ", "dhmmmmmd", "dhrrrrmd", "dhglgrmd",
           "dhgllrmd", "dhrrgrmd", "dmmmmhmd", "dmccgmdd", "dmhhmmdd", " dmmdmd ", "  dddd  ");
        simpleItem("crop_analyzer", analyzer, "Crop Analyzer", "Анализатор растений");

        Pixels knife = new Pixels();
        knife.mask(2, 1, Map.of(
            'd', 0x3f4849, 'm', 0x7a8788, 's', 0xa3b0ab, 'h', 0xc4cdc3,
            'c', 0x84603e, 'p', 0xa67a4d, 'w', 0x543c29, 'g', 0xb5a076
        ), "        ds  ", "       dshs ", "      dmhmsd", "     dmhmsd ", "    dmhmsd  ",
           "   dmhmsd   ", "   dmsmd    ", "  gdmd      ", " wpgd       ", " wpw        ",
           "wcpw        ", "wppw        ", " wcw        ", "  w         ");
        simpleItem("pruning_knife", knife, "Pruning Knife", "Нож для обрезки");
    }

    private void generateHarvester() throws IOException {
        Pixels side = chassis(0x657170);
        side.mask(3, 5, Map.of('d', 0x303d3e, 'm', 0x4a5858, 'h', 0x788481),
            "dddddddddd", "hmmmmmmmmd", "hddddddddd", "hmmmmmmmmd", "hddddddddd",
            "hmmmmmmmmd", "dddddddddd");
        png("block/lv_crop_harvester_side", side);

        Pixels front = chassis(0x68716e);
        front.mask(3, 3, Map.of(
            'd', 0x333d3b, 'h', 0x818b83, 'm', 0x51605b, 'r', 0x243e38,
            'g', 0x668d65, 'l', 0xa0b97b, 'c', 0xa2774c, 'p', 0xc29b63
        ), "hhhhhhhhhd", "hrrrrrrrmd", "hrrlgrggmd", "hrrgglgrmd", "hrrrrrrrmd",
           "hmmmmmmmmd", "hhmccccmmd", "hmdpppdmmd", "hmdcccdmmd", "dddddddddd");
        png("block/lv_crop_harvester_front", front);

        Pixels top = chassis(0x757d75);
        top.mask(4, 4, Map.of('d', 0x3d4947, 'm', 0x697871, 'h', 0x909a86),
            "dddddddd", "hmmmmhhd", "hmdmdmhd", "hmdmdmhd", "hmdmdmhd", "hmdmdmhd", "hmmmmmhd", "dddddddd");
        png("block/lv_crop_harvester_top", top);

        json("models/block/lv_crop_harvester", """
            {
              "parent": "minecraft:block/cube",
              "textures": {
                "north": "%1$s:block/lv_crop_harvester_front",
                "south": "%1$s:block/lv_crop_harvester_side",
                "east": "%1$s:block/lv_crop_harvester_side",
                "west": "%1$s:block/lv_crop_harvester_side",
                "up": "%1$s:block/lv_crop_harvester_top",
                "down": "%1$s:block/lv_crop_harvester_side",
                "particle": "%1$s:block/lv_crop_harvester_side"
              }
            }
            """.formatted(MOD));
        json("blockstates/lv_crop_harvester",
            "{\"variants\":{\"\":{\"model\":\"" + MOD + ":block/lv_crop_harvester\"}}}\n");
        json("models/item/lv_crop_harvester",
            "{\"parent\":\"" + MOD + ":block/lv_crop_harvester\"}\n");
        blockLabel("lv_crop_harvester", "LV Crop Harvester", "Сборщик урожая LV");
    }

    private static Pixels chassis(int color) {
        Pixels image = new Pixels();
        for (int y = 0; y < SIZE; y++) {
            for (int x = 0; x < SIZE; x++) {
                int grain = Math.floorMod(x * 5 + y * 3 + x * y, 11) - 5;
                int edge = y == 0 || x == 0 ? 27 : y >= 14 || x >= 14 ? -25 : 0;
                image.dot(x, y, shade(color, grain + edge));
            }
        }
        for (int y : new int[]{2, 13}) {
            for (int x : new int[]{2, 13}) {
                image.dot(x, y, 0x343e3d);
                image.dot(x, y - 1, 0x8a948b);
            }
        }
        return image;
    }

    private void simpleItem(String id, Pixels icon, String name, String localName) throws IOException {
        png("item/" + id, icon);
        generatedItem(id);
        itemLabel(id, name, localName);
    }

    private void generatedItem(String id) throws IOException {
        json("models/item/" + id, """
            { "parent": "minecraft:item/generated", "textures": { "layer0": "%s:item/%s" } }
            """.formatted(MOD, id));
    }

    private void multipart(String id, List<String> parts) throws IOException {
        json("blockstates/" + id, "{ \"multipart\": [\n  " + String.join(",\n  ", parts) + "\n] }\n");
    }

    private void blockLabel(String id, String name, String localName) {
        addLabel("block." + MOD + "." + id, name, localName);
    }

    private void itemLabel(String id, String name, String localName) {
        addLabel("item." + MOD + "." + id, name, localName);
    }

    private void addLabel(String key, String name, String localName) {
        english.put(key, name);
        russian.put(key, localName);
    }

    private void language(String locale, Map<String, String> entries) throws IOException {
        List<String> fields = new ArrayList<>();
        entries.forEach((key, value) -> fields.add(quote(key) + ": " + quote(value)));
        json("lang/" + locale, "{\n  " + String.join(",\n  ", fields) + "\n}\n");
    }

    private static String quote(String value) {
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"")
            .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t") + "\"";
    }

    private void json(String relative, String data) throws IOException {
        Path file = assets.resolve(relative + ".json");
        Files.createDirectories(file.getParent());
        Files.writeString(file, data, StandardCharsets.UTF_8);
    }

    private void png(String relative, Pixels data) throws IOException {
        Path file = assets.resolve("textures").resolve(relative + ".png");
        Files.createDirectories(file.getParent());
        if (!ImageIO.write(data.image, "PNG", file.toFile())) throw new IOException("PNG encoder unavailable");
    }

    private static int tint(int color, int seed) {
        return channel((color >> 16 & 255) + ((seed >> 9) & 15) - 7) << 16
            | channel((color >> 8 & 255) + ((seed >> 14) & 15) - 7) << 8
            | channel((color & 255) + ((seed >> 20) & 15) - 7);
    }

    private static int shade(int color, int delta) {
        return channel((color >> 16 & 255) + delta) << 16
            | channel((color >> 8 & 255) + delta) << 8
            | channel((color & 255) + delta);
    }

    private static int channel(int value) {
        return Math.max(0, Math.min(255, value));
    }

    private static final class Pixels {
        private final BufferedImage image = new BufferedImage(SIZE, SIZE, BufferedImage.TYPE_INT_ARGB);

        private void dot(int x, int y, int color) {
            if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) image.setRGB(x, y, 0xff000000 | color);
        }

        private void line(int x0, int y0, int x1, int y1, int color) {
            int stepX = Integer.signum(x1 - x0);
            int stepY = Integer.signum(y1 - y0);
            int dx = Math.abs(x1 - x0);
            int dy = -Math.abs(y1 - y0);
            int error = dx + dy;
            while (true) {
                dot(x0, y0, color);
                if (x0 == x1 && y0 == y1) break;
                int doubled = error * 2;
                if (doubled >= dy) { error += dy; x0 += stepX; }
                if (doubled <= dx) { error += dx; y0 += stepY; }
            }
        }

        private void mask(int x0, int y0, Map<Character, Integer> colors, String... rows) {
            for (int y = 0; y < rows.length; y++) {
                for (int x = 0; x < rows[y].length(); x++) {
                    Integer color = colors.get(rows[y].charAt(x));
                    if (color != null) dot(x0 + x, y0 + y, color);
                }
            }
        }
    }
}
