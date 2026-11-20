"""Build native 1.20.1 jigsaw structures from the pack's GregTech Overworld ore registry."""
import gzip
import hashlib
import io
import json
import math
from pathlib import Path
import random
import struct

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'pack/overrides/kubejs/data/zero_shift'
PLANETARY_VEINS = {'sapphire_vein', 'olivine_vein', 'garnet_tin_vein'}
VEINS = [vein for vein in json.loads((ROOT / 'tools/orbital-veins.json').read_text(encoding='utf-8'))
         if vein['id'] not in PLANETARY_VEINS]
AIRSPACE = 'ore_asteroid'


def write_json(name, value):
    target = DATA / (name + '.json')
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')


def string(value):
    encoded = value.encode('ascii')
    return struct.pack('>H', len(encoded)) + encoded


def named(tag, name, payload):
    return bytes([tag]) + string(name) + payload


def integers(values):
    return b'\x03' + struct.pack('>i', len(values)) + struct.pack('>' + 'i' * len(values), *values)


def compounds(values):
    return b'\x0a' + struct.pack('>i', len(values)) + b''.join(values)


def template(size, palette, blocks):
    buffer = io.BytesIO()
    with gzip.GzipFile(fileobj=buffer, mode='wb', mtime=0, compresslevel=9) as out:
        out.write(b'\x0a\x00\x00')
        out.write(named(3, 'DataVersion', struct.pack('>i', 3465)))
        out.write(named(9, 'size', integers(size)))
        out.write(named(9, 'palette', compounds([named(8, 'Name', string(name)) + b'\x00' for name in palette])))
        out.write(named(9, 'blocks', compounds([
            named(3, 'state', struct.pack('>i', state)) + named(9, 'pos', integers(pos)) + b'\x00'
            for pos, state in blocks])))
        out.write(named(9, 'entities', compounds([])))
        out.write(b'\x00')
    return buffer.getvalue()


def asteroid(vein, variant):
    name = vein['id'] + '_' + str(variant)
    seed = int.from_bytes(hashlib.sha256(name.encode('ascii')).digest()[:8], 'big')
    rng = random.Random(seed)
    rx, ry, rz = rng.uniform(9, 13), rng.uniform(6, 9), rng.uniform(8, 12)
    size = tuple(2 * math.ceil(r * 1.24) + 1 for r in (rx, ry, rz))
    cx, cy, cz = (s // 2 for s in size)
    deep = vein['layer'] == 'DEEPSLATE'
    rocks = ['minecraft:deepslate' if deep else 'minecraft:stone', 'minecraft:tuff', 'minecraft:andesite']
    ore_block = 'gtceu:deepslate_' if deep else 'gtceu:'
    ores = [ore_block + ore + '_ore' for ore, _ in vein['ore']]
    weights = [weight for _, weight in vein['ore']]
    palette = list(dict.fromkeys(rocks + ores))
    blocks = []
    exposed = set()
    phase = rng.random() * math.tau
    for x in range(size[0]):
        for z in range(size[2]):
            nx, nz = (x-cx)/rx, (z-cz)/rz
            stripe = (0.48*nx + 0.32*nz + 0.22*math.sin(3*nz+phase)) * ry
            for y in range(size[1]):
                ny = (y-cy)/ry
                cutoff = 1 + .15*math.sin(3*nx+phase)*math.cos(3*nz-2*ny) + .08*math.sin(5*ny+nx)
                if nx*nx + ny*ny + nz*nz > cutoff:
                    continue
                thickness = (y-cy-stripe)/ry
                if abs(thickness)<.34 and rng.random()<(.17+.27*(1-abs(thickness)/.34)):
                    ore = rng.choices(ores, weights)[0]
                    block = ore
                    exposed.add(ore)
                else:
                    shale = math.sin(x*.33+phase)+math.cos(y*.47-z*.22)
                    block = rocks[1 if shale>1.2 else 2 if shale< -1.1 else 0]
                blocks.append(((x,y,z),palette.index(block)))
    if exposed != set(ores):
        raise ValueError('Missing vein component in '+name)
    return name,template(size,palette,blocks)


def build():
    if len({v['id'] for v in VEINS}) != len(VEINS) or not VEINS:
        raise ValueError('Duplicate or missing Overworld vein families')
    path = DATA / 'structures/asteroids'
    path.mkdir(parents=True, exist_ok=True)
    pool = []
    for vein in VEINS:
        for variant in (1,2):
            name, data = asteroid(vein, variant)
            (path / (name + '.nbt')).write_bytes(data)
            pool.append(dict(weight=vein['weight'], element={
                'element_type':'minecraft:single_pool_element','location':'zero_shift:asteroids/'+name,
                'processors':'minecraft:empty','projection':'rigid'}))
    write_json('worldgen/template_pool/ore_asteroids',{'name':'zero_shift:ore_asteroids','fallback':'minecraft:empty','elements':pool})
    write_json('worldgen/structure/'+AIRSPACE,{
        'type':'minecraft:jigsaw','biomes':'ad_astra:orbit','step':'underground_structures','spawn_overrides':{},
        'start_pool':'zero_shift:ore_asteroids','size':1,'use_expansion_hack':False,'max_distance_from_center':48,
        'start_height':{'type':'minecraft:uniform','min_inclusive':{'absolute':64},'max_inclusive':{'absolute':108}}})
    write_json('worldgen/structure_set/ore_asteroids',{
        'structures':[{'structure':'zero_shift:'+AIRSPACE,'weight':1}],
        'placement':{'type':'minecraft:random_spread','spacing':6,'separation':3,'salt':71822419}})
    print(f'{len(VEINS)} vein families, {len(pool)} asteroid templates')


if __name__ == '__main__':
    build()
