package gtibd.addon;

import net.minecraft.client.Minecraft;
import net.minecraft.world.level.material.FogType;
import net.minecraftforge.client.event.ViewportEvent;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.EventPriority;

final class ClientFog {
    // Both planes must be distinct so that vanilla's fog interpolation remains finite.
    private static final float NEAR = 1_000_000.0F;
    private static final float FAR = NEAR + 1_024.0F;

    private ClientFog() {}

    static void register() {
        MinecraftForge.EVENT_BUS.addListener(EventPriority.LOWEST, true, ViewportEvent.RenderFog.class, ClientFog::clear);
        MinecraftForge.EVENT_BUS.addListener(EventPriority.LOWEST, false, ViewportEvent.ComputeFogColor.class, ClientFog::planetHorizon);
    }

    // When terrain fog is off, the clear color is visible below Ad Astra's sky mesh.
    private static void planetHorizon(ViewportEvent.ComputeFogColor event) {
        var level = Minecraft.m_91087_().f_91073_;
        if (level == null || event.getCamera().m_167685_() != FogType.NONE) return;
        var id = level.m_46472_().m_135782_();
        if (!id.m_135827_().equals("zero_shift")) return;
        switch (id.m_135815_()) {
            case "ceres", "europa", "titan" -> {
                var color = level.m_171660_(event.getCamera().m_90583_(), (float) event.getPartialTick());
                event.setRed((float) color.f_82479_);
                event.setGreen((float) color.f_82480_);
                event.setBlue((float) color.f_82481_);
            }
        }
    }

    private static void clear(ViewportEvent.RenderFog event) {
        event.setNearPlaneDistance(NEAR);
        event.setFarPlaneDistance(FAR);
        event.setCanceled(true);
    }
}
