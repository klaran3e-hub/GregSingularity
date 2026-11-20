"""Build the importable development profile from the local Core and pinned mods."""
from hashlib import sha256
import json
from pathlib import Path
import re
from tempfile import TemporaryDirectory
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / 'pack'
SCRIPTS = ('assets', 'data', 'server_scripts', 'startup_scripts', 'client_scripts')


def package():
    manifest = json.loads((PACK / 'manifest.json').read_text(encoding='utf-8'))
    revision = manifest['version'].removeprefix('fieldwork-')
    core_meta = (ROOT / 'addons/gtibd-core/resources/META-INF/mods.toml').read_text(encoding='utf-8')
    version = re.search(r'^version="([^"]+)"', core_meta, re.MULTILINE).group(1)
    core = ROOT / 'dist' / ('GregSingularity-Core-' + version) / ('GregSingularity-Core-' + version + '.jar')
    output = ROOT / 'dist' / ('GregSingularity-' + revision)
    output.mkdir(parents=True, exist_ok=True)
    target = output / ('GregSingularity-' + revision + '.zip')
    overrides = PACK / manifest['overrides']
    if any(p.name.lower().startswith(('gtibd-core-', 'gregsingularity-core-')) for p in (overrides / 'mods').glob('*.jar')):
        raise ValueError('Duplicate Core in overrides/mods')
    with ZipFile(core) as jar:
        if jar.testzip() is not None:
            raise ValueError('Damaged Core JAR')
        for folder in ('client_scripts', 'server_scripts', 'startup_scripts'):
            for name in jar.read('gtibd_scripts/' + folder + '.txt').decode().splitlines():
                jar.getinfo('gtibd_scripts/' + folder + '/' + name)
    with TemporaryDirectory(dir=output) as temp:
        archive = Path(temp) / target.name
        with ZipFile(archive, 'w', compression=ZIP_DEFLATED, compresslevel=6) as out:
            out.write(PACK / 'manifest.json', 'manifest.json')
            for entry in sorted(overrides.rglob('*')):
                if not entry.is_file():
                    continue
                parts = entry.relative_to(overrides).parts
                if any(part.startswith('.') for part in parts):
                    continue
                if len(parts) > 1 and parts[0] == 'kubejs' and parts[1] in SCRIPTS:
                    continue
                out.write(entry, entry.relative_to(PACK).as_posix())
            out.write(core, 'overrides/mods/' + core.name)
        with ZipFile(archive) as result:
            if result.testzip() is not None:
                raise ValueError('Damaged profile ZIP')
            result.getinfo('overrides/config/ftbquests/quests/chapters/steam.snbt')
            for local in [core, *(overrides / 'mods').glob('*.jar')]:
                if sha256(result.read('overrides/mods/' + local.name)).digest() != sha256(local.read_bytes()).digest():
                    raise ValueError('Embedded file differs from ' + local.name)
        archive.replace(target)
    print(target.name, target.stat().st_size, sha256(target.read_bytes()).hexdigest())


if __name__ == '__main__':
    package()
