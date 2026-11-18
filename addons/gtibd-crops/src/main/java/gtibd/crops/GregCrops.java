package gtibd.crops;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Supplier;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.ComposterBlock;
import net.minecraft.world.level.block.entity.BlockEntityType;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;
import net.minecraft.network.chat.Component;
import net.minecraft.core.registries.Registries;
import net.minecraft.world.item.ItemStack;

@Mod(GregCrops.ID)
public final class GregCrops {
    public static final String ID = "gtibdcrops";
    private static final DeferredRegister<Block> BLOCKS = DeferredRegister.create(ForgeRegistries.BLOCKS, ID);
    private static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, ID);
    private static final DeferredRegister<BlockEntityType<?>> ENTITIES = DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, ID);
    private static final DeferredRegister<CreativeModeTab> TABS = DeferredRegister.create(Registries.CREATIVE_MODE_TAB, ID);

    public static final RegistryObject<CropPlotBlock> STICKS = BLOCKS.register("crop_sticks", () -> new CropPlotBlock(null));
    public static final RegistryObject<HarvestBlock> HARVESTER = BLOCKS.register("lv_crop_harvester", HarvestBlock::new);
    public static final RegistryObject<Item> STICK_ITEM = blockItem("crop_sticks", STICKS);
    public static final RegistryObject<Item> HARVESTER_ITEM = blockItem("lv_crop_harvester", HARVESTER);
    public static final RegistryObject<Item> SEED_PACKET = ITEMS.register("seed_packet", CropSeedItem::new);
    public static final RegistryObject<Item> ANALYZER = ITEMS.register("crop_analyzer", CropAnalyzerItem::new);
    public static final RegistryObject<Item> KNIFE = ITEMS.register("pruning_knife", () -> new Item(new Item.Properties().durability(128)));
    public static final RegistryObject<Item> PLANT_CUTTINGS = ITEMS.register("plant_cuttings", () -> new Item(new Item.Properties()));
    static final Map<String, RegistryObject<CropPlotBlock>> PLOTS = new LinkedHashMap<>();
    static final Map<String, RegistryObject<Item>> HARVESTS = new LinkedHashMap<>();

    static {
        for (var crop : CropCatalog.ALL) {
            PLOTS.put(crop.id(), BLOCKS.register(crop.id() + "_plot", () -> new CropPlotBlock(crop)));
            if (crop.tier() > 0) {
                HARVESTS.put(crop.id(), ITEMS.register(crop.id() + "_harvest", () -> new Item(new Item.Properties())));
            }
        }
    }

    public static final RegistryObject<BlockEntityType<CropPlotEntity>> PLOT_ENTITY = ENTITIES.register(
            "crop_plot", () -> BlockEntityType.Builder.of(CropPlotEntity::new,
                    java.util.stream.Stream.concat(java.util.stream.Stream.of(STICKS), PLOTS.values().stream())
                            .map(RegistryObject::get).toArray(Block[]::new)).build(null));
    public static final RegistryObject<BlockEntityType<HarvesterBlockEntity>> HARVESTER_ENTITY = ENTITIES.register(
            "lv_crop_harvester", () -> BlockEntityType.Builder.of(HarvesterBlockEntity::new, HARVESTER.get()).build(null));
    private static final RegistryObject<CreativeModeTab> TAB = TABS.register("crops", () -> CreativeModeTab.builder()
            .title(Component.literal("GregCrops addon"))
            .icon(() -> new ItemStack(STICK_ITEM.get()))
            .displayItems((parameters, out) -> {
                out.accept(STICK_ITEM.get());
                out.accept(ANALYZER.get());
                out.accept(KNIFE.get());
                out.accept(HARVESTER_ITEM.get());
                out.accept(PLANT_CUTTINGS.get());
                for (var crop : CropCatalog.ALL) {
                    var seed = CropSeedItem.stack(crop, SeedGenes.DEFAULT);
                    seed.getOrCreateTag().putInt("Analysis", CropSeedItem.FULL_ANALYSIS);
                    out.accept(seed);
                }
                HARVESTS.values().forEach(item -> out.accept(item.get()));
            }).build());

    public GregCrops() {
        IEventBus bus = FMLJavaModLoadingContext.get().getModEventBus();
        BLOCKS.register(bus);
        ITEMS.register(bus);
        ENTITIES.register(bus);
        TABS.register(bus);
        bus.addListener(this::registerCompostables);
    }

    private void registerCompostables(FMLCommonSetupEvent event) {
        event.enqueueWork(() -> ComposterBlock.COMPOSTABLES.put(PLANT_CUTTINGS.get(), 0.3F));
    }

    private static RegistryObject<Item> blockItem(String name, Supplier<? extends Block> block) {
        return ITEMS.register(name, () -> new BlockItem(block.get(), new Item.Properties()));
    }
}
