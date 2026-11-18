package gtibd.crops;

import net.minecraft.nbt.CompoundTag;
import net.minecraft.util.RandomSource;

record SeedGenes(int growth, int gain, int resistance) {
    static final SeedGenes DEFAULT = new SeedGenes(1, 1, 1);
    private static final int MAX = 31;

    SeedGenes {
        growth = clamp(growth);
        gain = clamp(gain);
        resistance = clamp(resistance);
    }

    void save(CompoundTag tag) {
        tag.putInt("Growth", growth);
        tag.putInt("Gain", gain);
        tag.putInt("Resistance", resistance);
    }

    static SeedGenes fromTag(CompoundTag tag) {
        return new SeedGenes(tag.getInt("Growth"), tag.getInt("Gain"), tag.getInt("Resistance"));
    }

    static SeedGenes inherit(SeedGenes a, SeedGenes b, RandomSource random) {
        return new SeedGenes(roll(a.growth, b.growth, random), roll(a.gain, b.gain, random),
                roll(a.resistance, b.resistance, random));
    }

    private static int roll(int a, int b, RandomSource random) {
        return (a + b + 1) / 2 + random.nextInt(4) - 1;
    }

    private static int clamp(int value) {
        return Math.max(1, Math.min(MAX, value));
    }
}
