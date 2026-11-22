package gtibd.addon;

import com.mojang.blaze3d.vertex.PoseStack;
import earth.terrarium.adastra.common.registry.ModEntityTypes;
import earth.terrarium.adastra.common.entities.vehicles.Rocket;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.WeakHashMap;
import net.minecraft.client.CameraType;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.components.EditBox;
import net.minecraft.client.renderer.LightTexture;
import net.minecraft.client.renderer.MultiBufferSource;
import net.minecraft.client.renderer.entity.EntityRenderer;
import net.minecraft.client.renderer.entity.EntityRendererProvider;
import net.minecraft.client.renderer.entity.ItemRenderer;
import net.minecraft.client.renderer.texture.OverlayTexture;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.util.Mth;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.ItemDisplayContext;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.entity.EntityType;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.client.event.EntityRenderersEvent;
import net.minecraftforge.client.event.ModelEvent;
import net.minecraftforge.client.event.RenderPlayerEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.registries.ForgeRegistries;
import org.joml.Quaternionf;

@Mod.EventBusSubscriber(modid = FieldworkSpace.MOD, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public final class FieldworkSpaceClient {
    @SubscribeEvent
    public static void models(ModelEvent.RegisterAdditional event) {
        for (int tier = 1; tier <= 4; tier++) registerParts(event, astraName(tier));
        for (var ship : FieldworkSpace.Ship.values()) registerParts(event, ship.name);
    }

    private static void registerParts(ModelEvent.RegisterAdditional event, String name) {
        event.register(partId(name, "body"));
        event.register(partId(name, "hatch"));
        event.register(partId(name, "engine"));
    }

    private static ResourceLocation partId(String name, String part) {
        return FieldworkSpace.id("vehicle/" + name + "_" + part);
    }

    private static String astraName(int tier) {
        return "tier_" + tier + "_rocket";
    }

    @SubscribeEvent
    public static void renderers(EntityRenderersEvent.RegisterRenderers event) {
        for (var ship : FieldworkSpace.Ship.values()) {
            event.registerEntityRenderer(ship.entity.get(),
                context -> new AirframeRenderer(context, ship.name, new ItemStack(ship.item.get())));
        }
    }

    public static Map<EntityType<?>, EntityRenderer<?>> replaceNativeRocketRenderers(
            Map<EntityType<?>, EntityRenderer<?>> defaults, EntityRendererProvider.Context context) {
        var renderers = new HashMap<>(defaults);
        var rockets = List.of(ModEntityTypes.TIER_1_ROCKET, ModEntityTypes.TIER_2_ROCKET,
            ModEntityTypes.TIER_3_ROCKET, ModEntityTypes.TIER_4_ROCKET);
        for (int tier = 1; tier <= rockets.size(); tier++) {
            String name = astraName(tier);
            var item = ForgeRegistries.ITEMS.getValue(new ResourceLocation("ad_astra", name));
            renderers.put(rockets.get(tier - 1).get(), new AirframeRenderer(context, name, new ItemStack(item)));
        }
        return Map.copyOf(renderers);
    }

    public static void appendCreativeRockets(CreativeModeTab tab, EditBox input, List<ItemStack> results) {
        if (tab.m_257962_() != CreativeModeTab.Type.SEARCH) return;
        String query = input.m_94155_().strip().toLowerCase(Locale.ROOT);
        if (query.isEmpty() || query.startsWith("#")) return;

        String[] numerals = {"i", "ii", "iii", "iv", "v", "vi", "vii"};
        var ships = FieldworkSpace.Ship.values();
        for (int i = 0; i < numerals.length; i++) {
            int tier = i + 1;
            var id = tier <= 4 ? new ResourceLocation("ad_astra", astraName(tier)) : FieldworkSpace.rocketItemId(ships[i - 4].name);
            String roman = numerals[i];
            boolean matches = query.contains(":") ? id.toString().contains(query)
                : id.m_135815_().contains(query)
                    || ("ракета tier " + roman).contains(query)
                    || ("tier " + roman + " rocket").contains(query)
                    || FieldworkSpace.rocketSearchAliases(tier).stream().anyMatch(alias -> alias.contains(query));
            if (!matches) continue;
            var item = ForgeRegistries.ITEMS.getValue(id);
            if (item != null && results.stream().noneMatch(stack -> stack.m_41720_() == item)) {
                results.add(new ItemStack(item));
            }
        }
    }

    @Mod.EventBusSubscriber(modid = FieldworkSpace.MOD, value = Dist.CLIENT)
    public static final class ClientEvents {
        @SubscribeEvent
        public static void hideEnclosedPilot(RenderPlayerEvent.Pre event) {
            if (!(event.getEntity().m_20202_() instanceof Rocket rocket)) return;
            var id = ForgeRegistries.ENTITY_TYPES.getKey(rocket.m_6095_());
            if (id != null && FieldworkSpace.MOD.equals(id.m_135827_())) event.setCanceled(true);
        }
    }

    /** The item uses the closed airframe. The entity moves the same hatch as a separate baked part. */
    private static final class AirframeRenderer extends EntityRenderer<Rocket> {
        private final ItemRenderer items;
        private final ItemStack hull;
        private final ResourceLocation texture;
        private final ResourceLocation bodyModel;
        private final ResourceLocation hatchModel;
        private final ResourceLocation engineModel;
        private final WeakHashMap<Rocket, HatchMotion> hatches = new WeakHashMap<>();

        private AirframeRenderer(EntityRendererProvider.Context context, String name, ItemStack hull) {
            super(context);
            this.items = context.m_174025_();
            this.hull = hull;
            this.texture = FieldworkSpace.id("textures/entity/" + name + ".png");
            this.bodyModel = partId(name, "body");
            this.hatchModel = partId(name, "hatch");
            this.engineModel = partId(name, "engine");
            this.f_114477_ = 0.65f;
        }

        @Override
        public void m_7392_(Rocket rocket, float yaw, float partialTick, PoseStack pose,
                            MultiBufferSource buffers, int light) {
            var client = Minecraft.m_91087_();
            var cameraEntity = client.m_91288_();
            float age = rocket.f_19797_ + partialTick;
            boolean flight = rocket.isLaunching() || rocket.hasLaunched();
            float hatch = hatches.computeIfAbsent(rocket, key -> new HatchMotion(key.m_20160_(), age))
                .update(rocket.m_20160_(), flight, age);
            if (cameraEntity != null && cameraEntity.m_20202_() == rocket
                    && client.f_91066_.m_92176_() == CameraType.FIRST_PERSON) return;

            super.m_7392_(rocket, yaw, partialTick, pose, buffers, light);
            pose.m_85836_();
            try {
                float bank = 0;
                if (!client.m_91104_() && flight) {
                    bank = (float) Math.sin(age * 2.4f) * 0.18f;
                }
                float pitch = Mth.m_14179_(partialTick, rocket.f_19860_, rocket.m_146909_());
                pose.m_252781_(new Quaternionf().rotationY((float) Math.toRadians(-yaw))
                    .rotateX((float) Math.toRadians(-pitch))
                    .rotateZ((float) Math.toRadians(bank)));
                // ItemRenderer centers its input. The authored OBJ places the feet at y=0.
                pose.m_252880_(0f, 0.5f, 0f);
                drawPart(bodyModel, pose, buffers, light);
                drawEngine(rocket, age, pose, buffers, light);
                pose.m_252880_(0f, hatch * 0.72f, hatch * 0.15f);
                drawPart(hatchModel, pose, buffers, light);
            } finally {
                pose.m_85849_();
            }
        }

        private void drawEngine(Rocket rocket, float age, PoseStack pose, MultiBufferSource buffers, int light) {
            float throttle = rocket.hasLaunched() ? 1f : rocket.isLaunching()
                ? 1f - Math.max(0f, Math.min(1f, (float) rocket.launchTicks() / Rocket.COUNTDOWN_LENGTH))
                : 0f;
            float pulse = throttle * (0.8f + 0.2f * (float) Math.sin(age * 1.7f));
            int brightness = Math.max(LightTexture.m_109883_(light), Math.round(15 * pulse));
            int engineLight = LightTexture.m_109885_(brightness, LightTexture.m_109894_(light));
            pose.m_85836_();
            try {
                pose.m_252880_(0f, -0.08f * pulse, 0f);
                drawPart(engineModel, pose, buffers, engineLight);
            } finally {
                pose.m_85849_();
            }
        }

        private void drawPart(ResourceLocation id, PoseStack pose, MultiBufferSource buffers, int light) {
            var model = Minecraft.m_91087_().m_91304_().getModel(id);
            items.m_115143_(hull, ItemDisplayContext.NONE, false, pose, buffers, light, OverlayTexture.f_118083_, model);
        }

        @Override
        public ResourceLocation m_5478_(Rocket rocket) {
            return texture;
        }
    }

    private static final class HatchMotion {
        private boolean occupied;
        private float lastAge;
        private float closeAt;
        private float progress;

        private HatchMotion(boolean occupied, float age) {
            this.occupied = occupied;
            this.lastAge = age;
        }

        private float update(boolean nowOccupied, boolean flight, float age) {
            if (occupied != nowOccupied) closeAt = age + 6f;
            occupied = nowOccupied;
            float elapsed = Math.max(0f, age - lastAge);
            lastAge = age;
            float velocity = !flight && age < closeAt ? 0.25f : -0.125f;
            progress = Math.max(0f, Math.min(1f, progress + elapsed * velocity));
            return progress * progress * (3f - 2f * progress);
        }
    }
}
