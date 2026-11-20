# GregSingularity Core

## Fieldwork 0.1.0-dev.10

The development JAR packages the checked-in artwork byte for byte. To rebuild the texture sources with Python and Pillow, run `python tools/item-art/gregtech-atlas.py <mods-directory>` from the pack root with GregTech Modern 1.20.1-7.5.3 available. The per-resource source list is saved in the Fieldwork dev.10 output. The native material model layers, original GTIBD hardware drawings, and upstream credits are included in the source tree.

## Fieldwork 0.1.0-dev.1

This development build includes the field bloomery, ore washing trough and ten interactive Ponder scenes for early survival. Hover over flint, the trough or the bloomery and hold W to start the relevant scene. Use a new Fieldwork game profile and world.

## Release 0.0.1

GregSingularity Core 0.0.1 is the Forge mod edition of the GregSingularity Core for GregSingularity on Minecraft 1.20.1.

- Packages the existing KubeJS scripts, data and assets in one JAR, keeping the same item IDs.
- Fixes JEI batch transfer for recipes using reusable GregTech tools. A normal transfer places one set. Shift + places the available sets with a single tool, up to the usable slot limits.
- Updates 340 item textures, 52 fluid textures and 21 quest-map graphics. Tools and buckets retain their original artwork.

### Updating an existing GregSingularity profile

1. Close Minecraft and stop the server. Back up the profile and world.
2. Move the old GregSingularity Core's files out of `kubejs/startup_scripts`, `kubejs/server_scripts`, `kubejs/client_scripts`, `kubejs/assets` and `kubejs/data`. Keep any personal additions. Loose files with matching paths override the JAR. The source branch lists the pack-owned files under `pack/overrides/kubejs`.
3. Place `gtibd-core-0.0.1.jar` in `mods` on both the client and the server. Keep the rest of the GregSingularity pack installed, including KubeJS 2001.6.5-build.26 and JEI 15.20.0.129. If a development copy of the separate batch-transfer helper was installed, remove that helper.
4. Restart Minecraft and the server. In the Mods screen, check for **GregSingularity Core 0.0.1**. To check transfer, put one compatible knife and several logs in your inventory, open the planks recipe in JEI and Shift-click the transfer button.

### Building from source

Use Java 17 and Node.js 20 or newer. Set `JAVA_HOME` to your JDK and run this from the repository root, passing the path to the GregSingularity profile's mods folder.

```sh
node addons/gtibd-core/build.cjs "/path/to/GregSingularity/mods"
```

The build reads the pack content from `pack/overrides/kubejs` and writes the Forge JAR to `dist/GTIBD-Core-0.0.1`.
