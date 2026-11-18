package gtibd.addon;

import dev.latvian.mods.kubejs.KubeJSPlugin;
import dev.latvian.mods.kubejs.script.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.HashSet;

public final class AddonScripts extends KubeJSPlugin {
    private static List<String> read(String path) throws IOException {
        var stream = AddonScripts.class.getResourceAsStream("/gtibd_scripts/" + path);
        if (stream == null) throw new FileNotFoundException(path);
        try (var reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            return reader.lines().toList();
        }
    }

    @Override
    public void registerBindings(BindingsEvent event) {
        var folder = event.getType().path.getFileName().toString();
        var pack = event.manager.packs.get(folder);
        if (pack == null) throw new IllegalStateException("Missing KubeJS script pack: " + folder);
        // Loose scripts with the same name remain available as local overrides.
        var local = new HashSet<String>();
        for (var file : pack.info.scripts) local.add(file.file);
        try {
            for (var filename : read(folder + ".txt")) {
                if (local.contains(filename)) continue;
                var info = new ScriptFileInfo(pack.info, filename);
                ScriptSource source = ignored -> read(folder + "/" + filename);
                info.preload(source);
                if (info.skipLoading().isEmpty()) {
                    pack.info.scripts.add(info);
                    pack.scripts.add(new ScriptFile(pack, info, source));
                }
            }
            pack.scripts.sort(null);
        } catch (Throwable e) {
            throw new IllegalStateException("Failed to load GTIBD " + folder, e);
        }
    }
}
