package gtibd.addon;

import dev.latvian.mods.kubejs.KubeJSPlugin;
import dev.latvian.mods.kubejs.script.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public final class AddonScripts extends KubeJSPlugin {
    private static final Map<String, Set<String>> LEGACY = legacyHashes();

    private static Map<String, Set<String>> legacyHashes() {
        var resources = new HashMap<String, Set<String>>();
        try (var stream = AddonScripts.class.getResourceAsStream("/gtibd-legacy-scripts.sha256")) {
            if (stream == null) throw new FileNotFoundException("gtibd-legacy-scripts.sha256");
            try (var reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.US_ASCII))) {
                for (String line : reader.lines().toList()) {
                    var parts = line.split(" ", 2);
                    resources.computeIfAbsent(parts[0], key -> new HashSet<>()).add(parts[1]);
                }
            }
        } catch (IOException e) {
            throw new ExceptionInInitializerError(e);
        }
        return resources;
    }

    private static boolean fromOlderRelease(Path directory, String folder, String filename) throws IOException {
        var hashes = LEGACY.get(folder + "/" + filename);
        if (hashes == null) return false;
        var path = directory.resolve(filename);
        if (!Files.isRegularFile(path)) return false;
        var text = Files.readString(path, StandardCharsets.UTF_8).replace("\r\n", "\n");
        try {
            var digest = MessageDigest.getInstance("SHA-256").digest(text.getBytes(StandardCharsets.UTF_8));
            return hashes.contains(HexFormat.of().formatHex(digest));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public void clientInit() {
        ClientFog.register();
    }

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
        try {
            var local = new HashSet<String>();
            var obsolete = new HashSet<ScriptFileInfo>();
            for (var file : pack.info.scripts) {
                if (fromOlderRelease(event.getType().path, folder, file.file)) obsolete.add(file);
                else local.add(file.file);
            }
            // In-place updates can leave original pack files beside the new JAR. Keep user edits.
            pack.info.scripts.removeIf(obsolete::contains);
            pack.scripts.removeIf(script -> obsolete.contains(script.info));
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
