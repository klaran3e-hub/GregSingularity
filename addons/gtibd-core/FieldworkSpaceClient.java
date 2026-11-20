package gtibd.addon;

import com.mojang.blaze3d.vertex.PoseStack;
import earth.terrarium.adastra.common.entities.vehicles.Rocket;
import net.minecraft.client.Minecraft;
import net.minecraft.client.renderer.MultiBufferSource;
import net.minecraft.client.renderer.entity.EntityRenderer;
import net.minecraft.client.renderer.entity.EntityRendererProvider;
import net.minecraft.client.renderer.entity.ItemRenderer;
import net.minecraft.client.renderer.texture.OverlayTexture;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.item.ItemDisplayContext;
import net.minecraft.world.item.ItemStack;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.client.event.EntityRenderersEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import org.joml.Quaternionf;

@Mod.EventBusSubscriber(modid = FieldworkSpace.MOD, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public final class FieldworkSpaceClient {
    @SubscribeEvent
    public static void renderers(EntityRenderersEvent.RegisterRenderers event) {
        for (var ship : FieldworkSpace.Ship.values()) {
            event.registerEntityRenderer(ship.entity.get(), context -> new AirframeRenderer(context, ship));
        }
    }

    /** The world and held item share the baked Forge mesh. JEI uses the 16px GUI perspective. */
    private static final class AirframeRenderer extends EntityRenderer<Rocket> {
        private final ItemRenderer items;
        private final ItemStack hull;
        private final ResourceLocation texture;

        private AirframeRenderer(EntityRendererProvider.Context context, FieldworkSpace.Ship ship) {
            super(context);
            this.items = context.m_174025_();
            this.hull = new ItemStack(ship.item.get());
            this.texture = FieldworkSpace.id("textures/entity/" + ship.name + ".png");
            this.f_114477_ = 0.65f;
        }

        @Override
        public void m_7392_(Rocket rocket, float yaw, float partialTick, PoseStack pose,
                            MultiBufferSource buffers, int light) {
            super.m_7392_(rocket, yaw, partialTick, pose, buffers, light);
            pose.m_85836_();
            try {
                float bank = 0;
                if (!Minecraft.m_91087_().m_91104_() && (rocket.isLaunching() || rocket.hasLaunched())) {
                    bank = (float) Math.sin((rocket.f_19797_ + partialTick) * 2.4f) * 0.18f;
                }
                pose.m_252781_(new Quaternionf().rotationY((float) Math.toRadians(-yaw))
                    .rotateZ((float) Math.toRadians(bank)));
                // ItemRenderer centers its input. The authored OBJ places the feet at y=0.
                pose.m_252880_(0f, 0.5f, 0f);
                items.m_269128_(hull, ItemDisplayContext.NONE, light, OverlayTexture.f_118083_,
                    pose, buffers, rocket.m_9236_(), rocket.m_19879_());
            } finally {
                pose.m_85849_();
            }
        }

        @Override
        public ResourceLocation m_5478_(Rocket rocket) {
            return texture;
        }
    }
}
