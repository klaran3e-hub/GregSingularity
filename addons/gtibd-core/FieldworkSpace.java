package gtibd.addon;

import earth.terrarium.adastra.common.entities.vehicles.Rocket;
import earth.terrarium.adastra.common.items.vehicles.RocketItem;
import earth.terrarium.botarium.common.fluid.FluidConstants;
import earth.terrarium.botarium.common.fluid.impl.WrappedItemFluidContainer;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.tags.TagKey;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.MobCategory;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.material.Fluid;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

@Mod(FieldworkSpace.MOD)
public final class FieldworkSpace {
    static final String MOD = "gtibd_core";
    private static final DeferredRegister<EntityType<?>> ENTITIES = DeferredRegister.create(ForgeRegistries.ENTITY_TYPES, MOD);
    private static final DeferredRegister<Item> ITEMS = DeferredRegister.create(ForgeRegistries.ITEMS, MOD);

    enum Ship {
        SURVEYOR("surveyor", 5, 6.0f), COURIER("courier", 6, 6.7f), FREIGHTER("freighter", 7, 7.4f);
        final String name;
        final int tier;
        final TagKey<Fluid> fuel;
        final RegistryObject<EntityType<Rocket>> entity;
        final RegistryObject<Item> item;
        Ship(String name, int tier, float height) {
            this.name = name;
            this.tier = tier;
            this.fuel = TagKey.m_203882_(Registries.f_256808_, id(name + "_fuel"));
            this.entity = ENTITIES.register(name, () -> EntityType.Builder.<Rocket>m_20704_(
                (type, level) -> new Rocket(type, level, new Rocket.RocketProperties(tier, rocketItem(), 1.7f, fuel)),
                MobCategory.MISC).m_20719_().m_20702_(10).m_20699_(1.35f, height).m_20712_(id(name).toString()));
            this.item = ITEMS.register(name, () -> new RocketItem(entity::get, new Item.Properties().m_41487_(1)) {
                @Override public WrappedItemFluidContainer getFluidContainer(ItemStack stack) {
                    var tank = RocketFuel.tierTank(FluidConstants.fromMillibuckets(3000), fuel);
                    return new WrappedItemFluidContainer(stack, tank);
                }
            });
        }
        private Item rocketItem() { return item.get(); }
    }

    static ResourceLocation id(String path) { return new ResourceLocation(MOD, path); }
    public FieldworkSpace() {
        Ship.values();
        IEventBus bus = FMLJavaModLoadingContext.get().getModEventBus();
        ENTITIES.register(bus);
        ITEMS.register(bus);
    }
}
