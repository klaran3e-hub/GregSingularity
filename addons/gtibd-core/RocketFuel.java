package gtibd.addon;

import earth.terrarium.adastra.common.items.vehicles.VehicleItem;
import earth.terrarium.adastra.common.tags.ModFluidTags;
import earth.terrarium.botarium.common.fluid.base.FluidHolder;
import earth.terrarium.botarium.common.fluid.impl.SimpleFluidContainer;
import java.util.Map;
import java.util.function.BiPredicate;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.tags.TagKey;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.context.UseOnContext;
import net.minecraft.world.level.material.Fluid;
import net.minecraftforge.registries.ForgeRegistries;

public final class RocketFuel {
    private static final Map<ResourceLocation, TagKey<Fluid>> FUELS = Map.of(
        new ResourceLocation("ad_astra", "tier_1_rocket"), ModFluidTags.TIER_1_ROCKET_FUEL,
        new ResourceLocation("ad_astra", "tier_2_rocket"), ModFluidTags.TIER_2_ROCKET_FUEL,
        new ResourceLocation("ad_astra", "tier_3_rocket"), ModFluidTags.TIER_3_ROCKET_FUEL,
        new ResourceLocation("ad_astra", "tier_4_rocket"), ModFluidTags.TIER_4_ROCKET_FUEL,
        FieldworkSpace.id("surveyor"), FieldworkSpace.Ship.SURVEYOR.fuel,
        FieldworkSpace.id("courier"), FieldworkSpace.Ship.COURIER.fuel,
        FieldworkSpace.id("freighter"), FieldworkSpace.Ship.FREIGHTER.fuel
    );

    private RocketFuel() {}

    private static TagKey<Fluid> fuelTag(ItemStack stack) {
        var key = ForgeRegistries.ITEMS.getKey(stack.m_41720_());
        return key == null ? null : FUELS.get(key);
    }

    public static SimpleFluidContainer itemTank(long capacity, int slots, BiPredicate<Integer, FluidHolder> originalFilter, ItemStack stack) {
        var tag = fuelTag(stack);
        return tag == null ? new SimpleFluidContainer(capacity, slots, originalFilter) : tierTank(capacity, tag);
    }

    static SimpleFluidContainer tierTank(long capacity, TagKey<Fluid> fuel) {
        return new RocketTank(capacity, fuel);
    }

    public static Fluid emptyTankFluid(Fluid original, ItemStack stack) {
        var tag = fuelTag(stack);
        if (tag == null) return original;
        var fuels = ForgeRegistries.FLUIDS.tags().getTag(tag).iterator();
        return fuels.hasNext() ? fuels.next() : original;
    }

    public static boolean canPlaceOnPad(boolean launchPad, UseOnContext context) {
        if (!launchPad) return false;
        ItemStack stack = context.m_43722_();
        var tag = fuelTag(stack);
        if (tag == null) return true;
        var fuel = ((VehicleItem) stack.m_41720_()).getFluidContainer(stack).getFirstFluid();
        if (fuel.isEmpty() || fuel.is(tag)) return true;
        var player = context.m_43723_();
        if (player != null) player.m_5661_(Component.m_237115_("message.gregsingularity.drain_rocket_fuel"), true);
        return false;
    }

    private static final class RocketTank extends SimpleFluidContainer {
        private final TagKey<Fluid> fuel;

        RocketTank(long capacity, TagKey<Fluid> fuel) {
            // Botarium uses this predicate for extraction as well. A saved pre-hotfix tank must remain drainable.
            super(capacity, 1, (slot, fluid) -> true);
            this.fuel = fuel;
        }

        @Override public boolean isFluidValid(int slot, FluidHolder fluid) {
            return slot == 0 && fluid.is(fuel);
        }

        @Override public long insertFluid(FluidHolder fluid, boolean simulate) {
            return isFluidValid(0, fluid) ? super.insertFluid(fluid, simulate) : 0;
        }

        @Override public SimpleFluidContainer copy() {
            return new RocketTank(getTankCapacity(0), fuel);
        }
    }
}
