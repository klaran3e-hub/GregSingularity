package gtibd.crops;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class CropCatalog {
    public record ParentPair(String first, String second) {}

    public record Output(String id, int amount, boolean fluid, String sampleItem) {}

    public record Crop(String id, String englishName, String russianName, int tier, int growthTicks,
                       int yield, String substrate, String starterItem, List<ParentPair> crosses, Output output) {}

    // GT_CropLoader and GTNH CropsNH's CropLoader are the sources for the crop families.
    // Crosses and processing use the materials and machines available in GTIBD.
    public static final List<Crop> ALL = List.of(
            starter("wheat", "Wheat", "Пшеница", 1800, 2, "", "minecraft:wheat_seeds", "minecraft:wheat"),
            starter("carrot", "Carrot", "Морковь", 2000, 2, "", "minecraft:carrot", "minecraft:carrot"),
            starter("potato", "Potato", "Картофель", 2000, 2, "", "minecraft:potato", "minecraft:potato"),
            starter("beetroot", "Beetroot", "Свёкла", 1600, 2, "", "minecraft:beetroot_seeds", "minecraft:beetroot"),
            starter("melon", "Melon", "Арбуз", 2600, 3, "", "minecraft:melon_seeds", "minecraft:melon_slice"),
            starter("pumpkin", "Pumpkin", "Тыква", 2600, 1, "", "minecraft:pumpkin_seeds", "minecraft:pumpkin"),
            starter("sugar_cane", "Sugar Cane", "Сахарный тростник", 1800, 2, "minecraft:sand", "minecraft:sugar_cane", "minecraft:sugar_cane"),
            starter("cactus", "Cactus", "Кактус", 2200, 2, "minecraft:sand", "minecraft:cactus", "minecraft:cactus"),
            starter("bamboo", "Bamboo", "Бамбук", 1400, 2, "", "minecraft:bamboo", "minecraft:bamboo"),
            starter("nether_wart", "Nether Wart", "Нарост Незера", 2400, 2, "minecraft:soul_sand", "minecraft:nether_wart", "minecraft:nether_wart"),
            starter("cocoa", "Cocoa", "Какао", 2000, 2, "minecraft:jungle_log", "minecraft:cocoa_beans", "minecraft:cocoa_beans"),
            starter("sweet_berries", "Sweet Berries", "Сладкие ягоды", 1800, 2, "", "minecraft:sweet_berries", "minecraft:sweet_berries"),
            starter("glow_berries", "Glow Berries", "Светящиеся ягоды", 2200, 2, "", "minecraft:glow_berries", "minecraft:glow_berries"),
            starter("torchflower", "Torchflower", "Факельник", 2200, 1, "", "minecraft:torchflower_seeds", "minecraft:torchflower"),
            starter("pitcher_plant", "Pitcher Plant", "Кувшинница", 2400, 1, "", "minecraft:pitcher_pod", "minecraft:pitcher_plant"),
            starter("kelp", "Kelp", "Ламинария", 1600, 2, "minecraft:clay", "minecraft:kelp", "minecraft:kelp"),
            starter("brown_mushroom", "Brown Mushroom", "Коричневый гриб", 2000, 2, "", "minecraft:brown_mushroom", "minecraft:brown_mushroom"),
            starter("red_mushroom", "Red Mushroom", "Красный гриб", 2000, 2, "", "minecraft:red_mushroom", "minecraft:red_mushroom"),
            starter("chorus", "Chorus", "Хорус", 3000, 2, "minecraft:end_stone", "minecraft:chorus_flower", "minecraft:chorus_fruit"),
            starter("dandelion", "Dandelion", "Одуванчик", 1600, 2, "", "minecraft:dandelion", "minecraft:dandelion"),
            starter("poppy", "Poppy", "Мак", 1600, 2, "", "minecraft:poppy", "minecraft:poppy"),
            starter("blue_orchid", "Blue Orchid", "Синяя орхидея", 2200, 2, "minecraft:mud", "minecraft:blue_orchid", "minecraft:blue_orchid"),
            starter("allium", "Allium", "Лук аллиум", 1900, 2, "", "minecraft:allium", "minecraft:allium"),
            starter("azure_bluet", "Azure Bluet", "Хаустония", 1700, 2, "", "minecraft:azure_bluet", "minecraft:azure_bluet"),
            starter("red_tulip", "Red Tulip", "Красный тюльпан", 1800, 2, "", "minecraft:red_tulip", "minecraft:red_tulip"),
            starter("orange_tulip", "Orange Tulip", "Оранжевый тюльпан", 1800, 2, "", "minecraft:orange_tulip", "minecraft:orange_tulip"),
            starter("white_tulip", "White Tulip", "Белый тюльпан", 1800, 2, "", "minecraft:white_tulip", "minecraft:white_tulip"),
            starter("pink_tulip", "Pink Tulip", "Розовый тюльпан", 1800, 2, "", "minecraft:pink_tulip", "minecraft:pink_tulip"),
            starter("oxeye_daisy", "Oxeye Daisy", "Ромашка", 1700, 2, "", "minecraft:oxeye_daisy", "minecraft:oxeye_daisy"),
            starter("vine", "Vine", "Лиана", 2400, 2, "", "minecraft:vine", "minecraft:vine"),
            starter("water_lily", "Water Lily", "Кувшинка", 2200, 2, "minecraft:mud", "minecraft:lily_pad", "minecraft:lily_pad"),

            crop("flax", "Flax", "Лён", 1, 2700, 3, "", "wheat", "melon", item("minecraft:string", "minecraft:string")),
            crop("indigo", "Indigo", "Индиго", 1, 2800, 3, "", "beetroot", "torchflower", item("minecraft:blue_dye", "minecraft:blue_dye")),
            crop("stickreed", "Stickreed", "Липкий тростник", 1, 3000, 3, "minecraft:sand", "sugar_cane", "cactus", item("gtceu:sticky_resin", "gtceu:sticky_resin")),
            crop("spidernip", "Spidernip", "Паучий цвет", 1, 3400, 3, "", "wheat", "sweet_berries", item("minecraft:cobweb", "minecraft:cobweb")),
            crop("corpseplant", "Corpseplant", "Трупник", 1, 3200, 3, "", "red_mushroom", "potato", item("minecraft:bone_meal", "minecraft:bone_meal")),
            crop("zomplant", "Zomplant", "Зомби-трава", 1, 3200, 3, "", "brown_mushroom", "carrot", item("minecraft:rotten_flesh", "minecraft:rotten_flesh")),
            crop("corium", "Corium", "Кориум", 1, 3400, 3, "", "flax", "cactus", item("minecraft:leather", "minecraft:leather")),
            crop("eggplant", "Eggplant", "Яичная трава", 1, 3200, 3, "", "pumpkin", "beetroot", item("minecraft:egg", "minecraft:egg")),
            crop("fertilia", "Fertilia", "Фертилия", 1, 3200, 3, "minecraft:calcite", "wheat", "beetroot", item("gtceu:tiny_calcite_dust", "gtceu:calcite_dust")),
            crop("hemp", "Hemp", "Конопля", 1, 3600, 3, "", "flax", "bamboo", item("kubejs:plant_fibre", "kubejs:plant_fibre")),
            crop("papyrus", "Papyrus", "Папирус", 1, 3800, 3, "minecraft:mud", "sugar_cane", "water_lily", item("minecraft:paper", "minecraft:paper")),
            crop("inkbloom", "InkBloom", "Чернильный цвет", 1, 4100, 2, "minecraft:mud", "water_lily", "blue_orchid", item("minecraft:ink_sac", "minecraft:ink_sac")),
            crop("tea", "Tea", "Чай", 1, 3600, 2, "", "allium", "sweet_berries", fluid("create:tea", 75, "create:builders_tea")),

            crop("bonsai_oak", "Oak Bonsai", "Дубовый бонсай", 1, 5700, 2, "minecraft:oak_log", "wheat", "vine", item("minecraft:oak_log", "minecraft:oak_log")),
            crop("bonsai_spruce", "Spruce Bonsai", "Еловый бонсай", 1, 6300, 2, "minecraft:spruce_log", "potato", "vine", item("minecraft:spruce_log", "minecraft:spruce_log")),
            crop("bonsai_birch", "Birch Bonsai", "Берёзовый бонсай", 1, 5700, 2, "minecraft:birch_log", "carrot", "vine", item("minecraft:birch_log", "minecraft:birch_log")),
            crop("bonsai_jungle", "Jungle Bonsai", "Тропический бонсай", 1, 6300, 2, "minecraft:jungle_log", "cocoa", "vine", item("minecraft:jungle_log", "minecraft:jungle_log")),
            crop("bonsai_acacia", "Acacia Bonsai", "Акациевый бонсай", 1, 6000, 2, "minecraft:acacia_log", "cactus", "vine", item("minecraft:acacia_log", "minecraft:acacia_log")),
            crop("bonsai_dark_oak", "Dark Oak Bonsai", "Бонсай тёмного дуба", 1, 6500, 2, "minecraft:dark_oak_log", "brown_mushroom", "vine", item("minecraft:dark_oak_log", "minecraft:dark_oak_log")),
            crop("bonsai_rubber", "Rubber Bonsai", "Каучуковый бонсай", 1, 6800, 2, "gtceu:rubber_log", "stickreed", "bonsai_oak", item("gtceu:rubber_log", "gtceu:rubber_log")),

            crop("stone_lily", "Stone Lily", "Каменная лилия", 1, 3800, 2, "minecraft:stone", "dandelion", "vine", item("minecraft:cobblestone", "minecraft:cobblestone")),
            crop("sand_lily", "Sand Lily", "Песчаная лилия", 1, 4000, 2, "minecraft:sand", "cactus", "dandelion", item("minecraft:sand", "minecraft:sand")),
            crop("clay_lily", "Clay Lily", "Глиняная лилия", 1, 4200, 2, "minecraft:clay", "water_lily", "beetroot", item("minecraft:clay_ball", "minecraft:clay_ball")),
            crop("andesite_lily", "Andesite Lily", "Андезитовая лилия", 1, 4700, 2, "minecraft:andesite", "stone_lily", "flax", item("minecraft:andesite", "minecraft:andesite")),
            crop("diorite_lily", "Diorite Lily", "Диоритовая лилия", 1, 4700, 2, "minecraft:diorite", "stone_lily", "white_tulip", item("minecraft:diorite", "minecraft:diorite")),
            crop("granite_lily", "Granite Lily", "Гранитная лилия", 1, 4700, 2, "minecraft:granite", "stone_lily", "red_tulip", item("minecraft:granite", "minecraft:granite")),

            crop("coppon", "Coppon", "Коппон", 2, 4400, 3, "minecraft:copper_block", "flax", "stickreed", item("gtceu:tiny_copper_dust", "minecraft:copper_ingot")),
            crop("tine", "Tine", "Тин", 2, 4400, 3, "gtceu:tin_block", "stickreed", "wheat", item("gtceu:tiny_tin_dust", "gtceu:tin_ingot")),
            crop("ferru", "Ferru", "Ферру", 2, 4800, 3, "minecraft:iron_block", "coppon", "tine", item("gtceu:tiny_iron_dust", "minecraft:iron_ingot")),
            crop("plumbilia", "Plumbilia", "Плюмбилия", 2, 4800, 3, "gtceu:lead_block", "tine", "spidernip", item("gtceu:tiny_lead_dust", "gtceu:lead_ingot")),
            crop("nickelback", "Nickelback", "Никельбэк", 2, 5000, 3, "gtceu:nickel_block", "ferru", "cactus", item("gtceu:tiny_nickel_dust", "gtceu:nickel_ingot")),
            crop("galvania", "Galvania", "Гальвания", 2, 5000, 3, "gtceu:zinc_block", "coppon", "plumbilia", item("gtceu:tiny_zinc_dust", "gtceu:zinc_ingot")),
            crop("argentia", "Argentia", "Аргентия", 2, 5600, 2, "gtceu:silver_block", "plumbilia", "ferru", item("gtceu:tiny_silver_dust", "gtceu:silver_ingot")),
            crop("oilberries", "Oilberries", "Нефтяные ягоды", 2, 5200, 3, "minecraft:coal_block", "stickreed", "brown_mushroom", fluid("gtceu:oil", 50, "kubejs:washed_oil_sample")),
            crop("lazulia", "Lazulia", "Лазулия", 2, 5400, 3, "minecraft:lapis_block", "indigo", "galvania", item("gtceu:small_lapis_dust", "minecraft:lapis_lazuli")),
            crop("slimeplant", "Slimeplant", "Слизераст", 2, 4000, 3, "minecraft:slime_block", "stickreed", "glow_berries", item("minecraft:slime_ball", "minecraft:slime_ball")),
            crop("creeperweed", "Creeperweed", "Криперная трава", 2, 4200, 3, "minecraft:gravel", "corpseplant", "indigo", item("minecraft:gunpowder", "minecraft:gunpowder")),
            crop("olivia", "Olivia", "Оливия", 2, 5200, 3, "gtceu:olivine_block", "fertilia", "galvania", item("gtceu:tiny_olivine_dust", "gtceu:olivine_gem")),
            crop("meatrose", "Meatrose", "Мясная роза", 2, 4400, 2, "", "corium", "eggplant", item("minecraft:beef", "minecraft:beef")),
            crop("milkwart", "Milkwart", "Молочник", 2, 4200, 2, "", "corium", "sweet_berries", fluid("minecraft:milk", 125, "minecraft:milk_bucket")),
            crop("redstraw", "Redstraw", "Красный стебель", 2, 5000, 3, "minecraft:redstone_block", "wheat", "poppy", item("minecraft:redstone", "minecraft:redstone")),
            crop("saltyroot", "Salty Root", "Соляной корень", 2, 4900, 3, "gtceu:salt_block", "beetroot", "kelp", item("gtceu:tiny_salt_dust", "gtceu:salt_dust")),
            crop("micadia", "Micadia", "Микадия", 2, 5800, 3, "gtceu:raw_mica_block", "olivia", "diorite_lily", item("gtceu:tiny_mica_dust", "gtceu:mica_dust")),

            crop("deepslate_lily", "Deepslate Lily", "Сланцевая лилия", 2, 5300, 2, "minecraft:deepslate", "stone_lily", "brown_mushroom", item("minecraft:cobbled_deepslate", "minecraft:cobbled_deepslate")),
            crop("tuff_lily", "Tuff Lily", "Туфовая лилия", 2, 5100, 2, "minecraft:tuff", "deepslate_lily", "azure_bluet", item("minecraft:tuff", "minecraft:tuff")),
            crop("red_granite_lily", "Red Granite Lily", "Лилия красного гранита", 2, 5600, 2, "gtceu:red_granite", "granite_lily", "clay_lily", item("gtceu:red_granite", "gtceu:red_granite")),
            crop("marble_lily", "Marble Lily", "Мраморная лилия", 2, 5600, 2, "gtceu:marble", "stone_lily", "diorite_lily", item("gtceu:marble", "gtceu:marble")),

            crop("aurelia", "Aurelia", "Аурелия", 3, 6200, 2, "minecraft:gold_block", "argentia", "torchflower", item("gtceu:tiny_gold_dust", "minecraft:gold_ingot")),
            crop("bauxia", "Bauxia", "Боксия", 3, 6300, 3, "gtceu:aluminium_block", "galvania", "tine", item("gtceu:tiny_bauxite_dust", "gtceu:aluminium_ingot")),
            crop("steeleafranks", "Steeleafranks", "Стальнолист", 3, 6600, 2, "gtceu:steel_block", "ferru", "nickelback", item("gtceu:small_steel_dust", "gtceu:steel_ingot")),
            crop("blazereed", "Blazereed", "Огненный тростник", 3, 5600, 2, "minecraft:magma_block", "nether_wart", "stickreed", item("minecraft:blaze_powder", "minecraft:blaze_rod")),
            crop("evil_ore", "Evil Ore", "Незерная кристаллия", 3, 6000, 2, "minecraft:quartz_block", "blazereed", "lazulia", item("gtceu:tiny_nether_quartz_dust", "minecraft:quartz")),
            crop("glowheat", "Glowheat", "Светожар", 3, 5800, 2, "minecraft:glowstone", "blazereed", "glow_berries", item("minecraft:glowstone_dust", "minecraft:glowstone_dust")),
            crop("withereed", "Withereed", "Иссушающий тростник", 3, 6200, 2, "minecraft:coal_block", "blazereed", "zomplant", item("gtceu:small_coal_dust", "minecraft:coal")),
            crop("canola", "Canola", "Рапс", 3, 6400, 3, "", "flax", "oilberries", fluid("forestry:seed_oil", 75, "forestry:bucket_seed_oil")),
            crop("thiosulfine", "Thiosulfine", "Тиосульфина", 3, 6600, 3, "minecraft:netherrack", "blazereed", "saltyroot", item("gtceu:tiny_sulfur_dust", "gtceu:sulfur_dust")),
            crop("garnydinia", "Garnydinia", "Гарнидиния", 3, 6800, 2, "gtceu:red_garnet_block", "lazulia", "micadia", item("gtceu:tiny_red_garnet_dust", "gtceu:red_garnet_gem")),

            crop("nether_stone_lily", "Nether Stone Lily", "Лилия незерака", 3, 5500, 2, "minecraft:netherrack", "nether_wart", "stone_lily", item("minecraft:netherrack", "minecraft:netherrack")),
            crop("soul_sand_lily", "Soul Sand Lily", "Лилия песка душ", 3, 6100, 2, "minecraft:soul_sand", "nether_stone_lily", "nether_wart", item("minecraft:soul_sand", "minecraft:soul_sand")),
            crop("basalt_lily", "Basalt Lily", "Базальтовая лилия", 3, 6100, 2, "minecraft:basalt", "nether_stone_lily", "soul_sand_lily", item("minecraft:basalt", "minecraft:basalt")),

            crop("titania", "Titania", "Титания", 4, 7800, 2, "gtceu:titanium_block", "bauxia", "steeleafranks", item("gtceu:tiny_ilmenite_dust", "gtceu:titanium_ingot")),
            crop("pyrolusium", "Pyrolusium", "Пиролюзиум", 4, 7000, 2, "gtceu:manganese_block", "nickelback", "bauxia", item("gtceu:tiny_manganese_dust", "gtceu:manganese_ingot")),
            crop("sapphirum", "Sapphirum", "Сапфирум", 4, 7400, 2, "gtceu:sapphire_block", "lazulia", "olivia", item("gtceu:tiny_sapphire_dust", "gtceu:sapphire_gem")),
            crop("enderbloom", "Enderbloom", "Эндерцвет", 4, 7600, 2, "minecraft:end_stone", "chorus", "glowheat", item("gtceu:tiny_ender_pearl_dust", "minecraft:ender_pearl")),
            crop("tearstalks", "Tearstalks", "Слёзные стебли", 4, 7400, 2, "minecraft:soul_sand", "blazereed", "enderbloom", item("minecraft:ghast_tear", "minecraft:ghast_tear")),
            crop("rubyne", "Rubyne", "Рубина", 4, 7600, 2, "gtceu:ruby_block", "garnydinia", "bauxia", item("gtceu:tiny_ruby_dust", "gtceu:ruby_gem")),
            crop("cobalt_oreberry", "Cobalt Oreberry", "Кобальтовая рудоягода", 4, 7800, 2, "gtceu:cobalt_block", "nickelback", "pyrolusium", item("gtceu:tiny_cobalt_dust", "gtceu:cobalt_ingot")),
            crop("end_stone_lily", "End Stone Lily", "Лилия камня Края", 4, 7200, 2, "minecraft:end_stone", "chorus", "nether_stone_lily", item("minecraft:end_stone", "minecraft:end_stone")),

            crop("diareed", "Diareed", "Алмазный тростник", 5, 9600, 2, "minecraft:diamond_block", "sapphirum", "oilberries", item("gtceu:tiny_diamond_dust", "minecraft:diamond")),
            crop("bobsyeruncleranks", "Bobsyeruncleranks", "Изумрудная лоза", 5, 9200, 2, "minecraft:emerald_block", "olivia", "sapphirum", item("gtceu:tiny_emerald_dust", "minecraft:emerald")),
            crop("scheelinium", "Scheelinium", "Шеелиниум", 5, 9800, 2, "gtceu:tungsten_block", "titania", "pyrolusium", item("gtceu:tiny_scheelite_dust", "gtceu:tungsten_ingot")),
            crop("platina", "Platina", "Платина", 5, 9600, 2, "gtceu:platinum_block", "aurelia", "titania", item("gtceu:tiny_platinum_dust", "gtceu:platinum_ingot")),
            crop("reactoria", "Reactoria", "Реактория", 5, 10400, 2, "gtceu:uranium_block", "titania", "withereed", item("gtceu:tiny_pitchblende_dust", "gtceu:uranium_ingot")),
            crop("god_of_thunder", "God of Thunder", "Громовник", 5, 10400, 2, "gtceu:thorium_block", "reactoria", "glowheat", item("gtceu:tiny_thorium_dust", "gtceu:thorium_ingot")),

            crop("quantaria", "Quantaria", "Квантария", 6, 12400, 1, "gtceu:iridium_block", "platina", "diareed", item("gtceu:tiny_iridium_dust", "gtceu:iridium_ingot")),
            crop("osmianth", "Osmianth", "Осмиант", 6, 12800, 1, "gtceu:osmium_block", "quantaria", "platina", item("gtceu:tiny_osmium_dust", "gtceu:osmium_ingot")),
            crop("trollplant", "Trollplant", "Тролльник", 6, 13200, 1, "", "reactoria", "corpseplant", item("gtceu:tiny_plutonium_241_dust", "gtceu:plutonium_241_dust")),
            crop("starwart", "Starwart", "Звёздный нарост", 6, 13200, 1, "minecraft:soul_sand", "withereed", "tearstalks", item("gtceu:tiny_nether_star_dust", "minecraft:nether_star")),
            crop("stargatium", "Stargatium", "Старгатиум", 7, 16000, 1, "gtceu:naquadah_block", "quantaria", "scheelinium", item("gtceu:tiny_naquadah_dust", "gtceu:naquadah_ingot"))
    );

    public static final Map<String, Crop> BY_ID = ALL.stream()
            .collect(Collectors.toUnmodifiableMap(Crop::id, Function.identity()));

    private CropCatalog() {}

    private static Crop starter(String id, String english, String russian, int ticks, int yield, String substrate,
                                String starter, String output) {
        return new Crop(id, english, russian, 0, ticks, yield, substrate, starter, List.of(), new Output(output, 1, false, ""));
    }

    private static Crop crop(String id, String english, String russian, int tier, int ticks, int yield, String substrate,
                             String first, String second, Output output) {
        return new Crop(id, english, russian, tier, ticks, yield, substrate, "", List.of(new ParentPair(first, second)), output);
    }

    private static Output item(String id, String sample) {
        return new Output(id, 1, false, sample);
    }

    private static Output fluid(String id, int amount, String sample) {
        return new Output(id, amount, true, sample);
    }
}
