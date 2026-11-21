"""Index every recipe shipped by the pinned Ad Astra jar for the pack-wide overhaul."""
from collections import Counter
from pathlib import Path
import argparse
import json
from zipfile import ZipFile

ROOT=Path(__file__).resolve().parents[1]
TARGET=ROOT/'pack/overrides/kubejs/server_scripts/astra_catalog.js'
OWNED=set('coal_generator compressor etrionic_blast_furnace water_pump energizer solar_panel engine_frame rocket_fin rocket_nose_cone gas_tank large_gas_tank oxygen_gear oxygen_loader oxygen_distributor launch_pad nasa_workbench fuel_refinery cryo_freezer space_helmet space_suit space_pants space_boots netherite_space_helmet netherite_space_suit netherite_space_pants netherite_space_boots'.split())
OWNED.update(m+'_'+p for m in ['steel','desh','ostrum','calorite'] for p in ['engine','tank'])
OBSOLETE=set('steel_rod steel_ingot steel_block steel_nugget steel_plate iron_rod iron_plate'.split())
ALIAS={'ad_astra:steel_block':'gtceu:steel_block','ad_astra:steel_ingot':'gtceu:steel_ingot','ad_astra:steel_rod':'gtceu:steel_rod','ad_astra:iron_rod':'gtceu:iron_rod','ad_astra:iron_plate':'gtceu:iron_plate','ad_astra:steel_plate':'gtceu:steel_plate','ad_astra:steel_nugget':'gtceu:steel_nugget'}
MACHINE=set('etrionic_capacitor fan photovoltaic_etrium_cell gravity_normalizer oxygen_sensor tier_1_rover radio ti_69 airlock reinforced_door cable_duct fluid_pipe_duct vent wheel zip_gun'.split())
ASSAY={'lapis_lazuli':'minecraft:lapis_lazuli','coal':'minecraft:coal','ice_shard':'ad_astra:ice_shard','cheese':'ad_astra:cheese','iron_ingot':'minecraft:raw_iron','copper_ingot':'minecraft:raw_copper','gold_ingot':'minecraft:raw_gold','diamond':'minecraft:diamond','desh_ingot':'ad_astra:raw_desh','calorite_ingot':'ad_astra:raw_calorite','ostrum_ingot':'ad_astra:raw_ostrum'}

# A native cutter has one visible item input. Different working fluids let JEI
# and AE2 distinguish shapes even when a full stack of the same stone is fed in.
CUT_FLUID_BY_SUFFIX = {
    '_slab': 'gtceu:lubricant',
    '_stairs': 'gtceu:drilling_fluid',
    '_wall': 'gtceu:distilled_water',
    '_pillar': 'gtceu:distilled_water',
    '_bricks': 'minecraft:water',
    '_tiles': 'minecraft:water',
    '_ladder': 'gtceu:creosote',
}

ASSEMBLER_CIRCUIT_BY_SUFFIX = {
    '_button': 1, '_pressure_plate': 2, '_sliding_door': 17, '_door': 3, '_trapdoor': 4,
    '_fence': 5, '_fence_gate': 6, '_panel': 7, '_factory_block': 8,
    '_plateblock': 12, '_cable': 20, '_duct': 21,
}
ASSEMBLER_CIRCUIT_BY_ITEM = {
    'wrench': 13, 'fan': 14, 'radio': 15, 'vent': 16,
    'airlock': 18, 'reinforced_door': 19, 'zip_gun': 22,
}


def workshop_settings(kind, path, count):
    if kind == 'packing':
        return {'circuit': 1 if count > 1 else 9}
    if kind == 'cut':
        for suffix, fluid in CUT_FLUID_BY_SUFFIX.items():
            if path.endswith(suffix):
                return {'fluid': fluid}
        if path.startswith('polished_'):
            return {'fluid': 'gtceu:seed_oil'}
    if kind in ('fixture', 'equipment'):
        if path.endswith('_industrial_lamp'):
            return {'circuit': 11 if path.startswith('small_') else 10}
        if path.startswith('encased_'):
            return {'circuit': 9}
        if path in ASSEMBLER_CIRCUIT_BY_ITEM:
            return {'circuit': ASSEMBLER_CIRCUIT_BY_ITEM[path]}
        for suffix, circuit in ASSEMBLER_CIRCUIT_BY_SUFFIX.items():
            if path.endswith(suffix):
                return {'circuit': circuit}
    return {}


def audit_native_lookup(rows, directory):
    """Check planned selectors against actual tag members from a Forge recipe dump."""
    machines = {'equipment': 'assembler', 'fixture': 'assembler', 'cut': 'cutter',
                'saw': 'cutter', 'packing': 'packer', 'ore': 'macerator', 'fire': 'alloy_smelter'}
    prefix = 'zero_shift:{}/astral_workshop/{}'
    planned = {prefix.format(machines[r[1]], r[0]): r for r in rows}
    actual = {}
    for batch in directory.glob('batch_*.json'):
        for recipe in json.loads(batch.read_text(encoding='utf8'))['rows']:
            if recipe['id'] in planned:
                actual[recipe['id']] = recipe
    missing = sorted(planned.keys() - actual.keys())
    if missing:
        raise ValueError('Routes missing from the native recipe manager: ' + ', '.join(missing))

    def fits(required, supplied):
        return all(any(options & stock for stock in supplied) for options in required)

    # The GT lookup tree cannot select an operation by ingredient counts. Also check
    # a smaller recipe that would consume just part of a larger order's ingredients.
    signatures = {}
    for key, row in planned.items():
        kind = row[1]
        settings = row[5] if len(row) > 5 else {}
        native = actual[key]
        items = [frozenset(choices) for choices, _, _ in native['i']
                 if choices != ['gtceu:programmed_circuit']]
        fluids = [frozenset(choices) for choices, _, _ in native.get('fi', [])]
        if kind in ('cut', 'saw'):
            fluids = [frozenset([settings.get('fluid', 'gtceu:lubricant')])]
        if not items or not all(items) or not all(fluids):
            raise ValueError('Empty ingredient in native route ' + key)
        signatures[key] = (machines[kind], settings.get('circuit', 0), items, fluids)

    conflicts = []
    for key, (machine, mode, items, fluids) in signatures.items():
        for other, (other_machine, other_mode, stock, tanks) in signatures.items():
            if key == other or machine != other_machine or (mode and mode != other_mode):
                continue
            if fits(items, stock) and fits(fluids, tanks):
                conflicts.append(key + ' can consume ingredients for ' + other)
    if conflicts:
        raise ValueError('Ambiguous native machine routes:\n' + '\n'.join(conflicts))
    return len(signatures)

def ingredient(g):
    if 'item' in g:
        return ALIAS.get(g['item'],g['item'])
    if 'tag' in g:
        return '#'+g['tag']
    raise ValueError(g)

def index(jar):
    with ZipFile(jar) as z:
        return {n.removeprefix('data/ad_astra/recipes/')[:-5]:json.loads(z.read(n)) for n in sorted(z.namelist()) if n.startswith('data/ad_astra/recipes/') and n.endswith('.json')}

def generate(jar, audit_directory=None):
    recipes=index(jar)
    rows=[]
    produced=set()
    # A shaped or shapeless original has priority over duplicate stonecutter variants.
    for key,j in sorted(recipes.items(),key=lambda kv:kv[1]['type']=='minecraft:stonecutting'):
        typ=j['type']; result=j.get('result')
        if typ in ['minecraft:crafting_shaped','minecraft:crafting_shapeless','minecraft:stonecutting']:
            out=result if isinstance(result,str) else result['item']
            count=j.get('count',1) if isinstance(result,str) else result.get('count',1)
            path=out.split(':')[-1]
            if path in OWNED|OBSOLETE or (typ=='minecraft:stonecutting' and out in produced):continue
            if typ=='minecraft:crafting_shaped':
                stacks=[ingredient(j['key'][c]) for row in j['pattern'] for c in row if c!=' ']
            elif typ=='minecraft:stonecutting':stacks=[ingredient(j['ingredient'])]
            else:stacks=[ingredient(g) for g in j['ingredients']]
            inputs=[[s,n] for s,n in Counter(stacks).items()]
            if path in MACHINE or path.startswith('jet_suit') or path.endswith(('_fluid_pipe','_cable')):kind='equipment'
            elif path.endswith('planks'):kind='saw'
            elif path in ['cheese','cheese_block'] or path.startswith('raw_') or path.endswith(('ingot','nugget')) or path in ['calorite_block','desh_block','ostrum_block']:kind='packing'
            elif len(inputs)==1 and not path.endswith(('industrial_lamp','door','trapdoor','flag','button','pressure_plate')):kind='cut'
            else:kind='fixture'
            row = [key, kind, inputs, out, count]
            settings = workshop_settings(kind, path, count)
            if settings:
                row.append(settings)
            rows.append(row)
            produced.add(out)
        elif typ=='minecraft:smelting':
            src=j['ingredient']
            if 'item' not in src:continue
            tail=result.split(':')[-1]
            if '_ore' in src['item']:
                if tail not in ASSAY:raise ValueError((key,tail))
                rows.append([key,'ore',[[src['item'],1]],ASSAY[tail],1])
            elif result.startswith('ad_astra:'):
                rows.append([key,'fire',[[src['item'],1]],result,1])
    # Keep the source IDs for full registry coverage. Anything without a generated row is
    # unified, represented by an existing orbital recipe, or superseded by a canonical route.
    ids=list(recipes)
    if audit_directory is not None:
        print(audit_native_lookup(rows, audit_directory), 'planned routes checked against native ingredient sets')
    blob='// Generated by tools/build-astra-catalog.py from Ad Astra 1.15.21.\n'
    blob+='const gtibdAstraOriginalIds = '+json.dumps(ids,separators=(',',':'))+'\n'
    blob+='const gtibdAstraRoutes = [\n'+',\n'.join('  '+json.dumps(row,separators=(',',':')) for row in rows)+'\n]\n'
    # KubeJS evaluates files in separate scopes. Place the data and its consumer in the same script.
    TARGET.write_text(blob+(ROOT/'tools/astra-catalog-runtime.js').read_text(encoding='utf8'),encoding='utf8')
    print(len(ids),'original recipes;',len(rows),'generated GT routes')

if __name__=='__main__':
    arg=argparse.ArgumentParser()
    arg.add_argument('jar',type=Path)
    arg.add_argument('--audit-registry', type=Path, help='Check routes against batch_*.json from a Forge recipe dump')
    args = arg.parse_args()
    generate(args.jar, args.audit_registry)
