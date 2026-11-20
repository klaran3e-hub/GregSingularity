"""Render GTIBD art from the exact layers shipped in the installed GregTech JAR.

Run with Python and Pillow. Pass a mod directory as the first argument when using a different local profile.
"""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile
from functools import lru_cache
import hashlib
import json
import re
import runpy
import sys
from PIL import Image, ImageOps, ImageChops

BASE = Path(__file__).resolve().parents[2]
ART = BASE/'pack/overrides/kubejs/assets'
HERE = Path(__file__).resolve().parent
TOOLS = runpy.run_path(str(HERE/'gt-texture-forms.py'))
SITES = json.loads((BASE/'tools/planetary-mills.json').read_text(encoding='utf8'))
MODS = Path(sys.argv[1]) if len(sys.argv)>1 else BASE/'.dev/titan-works-server/mods'
GT = ZipFile(next(MODS.glob('gtceu-1.20.1-7.5.3.jar')))
GT_ROOT = 'assets/gtceu/'
INDEX = set(GT.namelist())
GEOMETRY = ZipFile(HERE/'space-uv-sources.zip')
FORMS = {'grit':'dull:crushed','washed':'dull:crushed_purified','heavy':'dull:crushed_refined','crystal':'gem_vertical:gem','assay':'dull:dust_pure'}
FORCE = {'weight':'dull:ingot_double','sensor':'lv_sensor','crate':'empty_wooden_form','relay':'lv_sensor','ceramic:crucible':'tool:mortar','ingot_wooden_form':'empty_wooden_form','rubber_ring':'dull:ring'}
TIER = {'lv','mv','hv','ev','iv','luv','zpm','uv'}
COLOURS = {'reactor':'8CA1AC','coolant':'76B1CE','heat':'C38860','reserve':'B393B7','pressure':'A7BA9B','load':'AC9D7E','diagnostic':'88B8AE','end':'A08BAC','nether':'B3816E','overworld':'88AC96'}
CREDITS = {}
SPACE_PAINT = runpy.run_path(str(HERE/'space-materials.py'))['paint']
WORKSHOP = runpy.run_path(str(HERE/'workshop-sprites.py'))['workshop']
HARDWARE = runpy.run_path(str(HERE/'hardware-sprites.py'))['hardware']
LEGACY = json.loads((HERE/'legacy-dyes.json').read_text(encoding='utf8'))
DYES = {'titan_wick':'A4CECD','titan_spent_wick':'B37546','titan_radiator_core':'91B8C6','tool_handle':'D5A067','haft_blank':'C29563','coke_brick_blank':'C38D69','green_tuyere':'AB968B','fired_tuyere':'C38262','luv_venus_timing_prism':'B291D5','zpm_storage_backplane':'679C78','spent_end_filter':'847366','iv_fuel_catalyst':'ACAF84','iv_spent_fuel_catalyst':'816753','reclaim_membrane_cartridge':'9FBBC1'}
DYES.update({'turbine_rotor_blank':'958779','balanced_turbine_rotor':'AFBCC4','distribution_surface_calibration':'8CB6AA',
             'distribution_distribution_matrix':'9B94C0','heavy_fuel_sample':'724D38','refinery_gas_sample':'C7BD8F',
             'sample_ampoule':'9CBEC9','iv_arc_plate':'93A3B6','iv_stress_coupon':'9D9393','iv_bonded_billet':'B2A18F',
             'iv_layered_billet':'A0A9B5','kiln_grate':'967F71','refinery_tray':'AFBEC2',
             'reclaim_etched_collector':'B9AB7E','reclaim_recovered_collector':'8EAD9B','traction_housing':'9BA8BB',
             'vacuum_pump_core':'A8AEB1'})
DYES.update({'copper_charge':'D77D4C','iron_charge':'A7A3A2','tin_charge':'BFCCD0','gold_charge':'E5BC60','bronze_charge':'C69757','axe_head':'7B858B','pick_head':'859297','fired_tuyere':'BD856C','green_tuyere':'A39180','clay_mortar':'A99586','plant_fibre':'A99B65','washed_fibre':'C5BC95','grinding_runner':'9E9D96','lapped_edge':'8E989B','fired_crucible':'A8795D','wooden_peg':'C99763'})
def dyed(name):
    if name in DYES:return col(DYES[name])
    material=col(TOOLS['color_for'](name));old=col(LEGACY.get(name,'94A1A4'))
    identity=tuple(min(240,round(c*1.26+10)) for c in old)
    return tuple(round(.38*a+.62*b) for a,b in zip(material,identity))


def col(value):
    return tuple(bytes.fromhex(value))


def brighten(rgb,amount):
    return tuple(round(c*(1-amount)+255*amount) for c in rgb)


@lru_cache(maxsize=512)
def texture(name):
    return Image.open(BytesIO(GT.read(GT_ROOT+'textures/'+name+'.png'))).convert('RGBA')


def tint(image,rgb,component=False):
    if component:
        # Preserve the shading of colored machine parts and the original neutral-metal highlights.
        lum=ImageOps.grayscale(image)
        mapped=ImageOps.colorize(lum,black=tuple(round(c*.13) for c in rgb),mid=rgb,white=brighten(rgb,.83),midpoint=167)
        result=Image.blend(mapped,image.convert('RGB'),.10)
    else:
        result=ImageChops.multiply(image.convert('RGB'),Image.new('RGB',image.size,rgb))
    result.putalpha(image.getchannel('A'));return result


def model_paths(id):
    obj=json.loads(GT.read(GT_ROOT+'models/'+id+'.json'))
    while not obj.get('textures'):
        parent=obj['parent'].replace('gtceu:','')
        obj=json.loads(GT.read(GT_ROOT+'models/'+parent+'.json'))
    return [s.split(':')[-1] for k,s in sorted(obj['textures'].items()) if k.startswith('layer')]


def first(image):
    return image.crop((0,0,image.width,image.width))


def bitmap(form,rgb,owner=''):
    if form.startswith('shop:'):return WORKSHOP(form[5:],owner,texture,rgb)
    if form.startswith('hw:'):return HARDWARE(form[3:],texture,rgb,owner)
    form=FORCE.get(form,form)
    if form in ('coil','battery'):
        tier=owner.split('_')[0]
        if tier not in TIER:tier='lv'
        form=tier+('_voltage_coil' if form=='coil' else '_battery_hull')
    if form.startswith('head:'):
        path='item/tools/'+form.split(':')[1]
        return tint(first(texture(path)),rgb,True),[path]
    if form.startswith('tool:'):
        model='item/tools/'+form.split(':')[1]
    elif ':' not in form and GT_ROOT+'textures/item/'+form+'.png' in INDEX:
        path='item/'+form
        return tint(first(texture(path)),rgb,True),[path]
    else:
        setname,name=form.split(':') if ':' in form else ('dull',form)
        model='item/material_sets/'+setname+'/'+name
        if GT_ROOT+'models/'+model+'.json' not in INDEX:
            model='item/material_sets/dull/'+name
    paths=model_paths(model)
    out=Image.new('RGBA',(16,16))
    for path in paths:
        layer=first(texture(path))
        if layer.size!=(16,16):raise ValueError((path,layer.size))
        if 'overlay' in path or '/handle' in path or '_handle' in path or path.endswith('_base') and model.startswith('item/tools/'):
            out.alpha_composite(layer)
        else:
            out.alpha_composite(tint(layer,brighten(rgb,.22) if path.endswith('_secondary') else rgb))
    return out,paths


def dest(rel,img,refs):
    path=ART/rel
    img.save(path,optimize=True)
    CREDITS[rel]=list(refs)


def remove_animation(path):
    meta=Path(str(path)+'.mcmeta')
    if meta.exists():meta.unlink()


def ores_and_items():
    for s in SITES:
        for form,prototype in FORMS.items():
            img,refs=bitmap(prototype,col(s['color']))
            dest('kubejs/textures/item/mill_'+s['id']+'_'+form+'.png',img,refs)
        stone='block/stones/'+{'moon':'marble','mercury':'black_granite','mars':'red_granite','venus':'basalt','glacio':'marble','ceres':'black_granite','europa':'marble','titan':'red_granite'}[s['id']]+'/stone'
        out=tint(first(texture(stone)),brighten(col(s['stone']),.36),True)
        family={'moon':'dull','mercury':'rough','mars':'dull','venus':'fine','glacio':'quartz','ceres':'quartz','europa':'diamond','titan':'rough'}[s['id']]
        # Keep the two native mineral layers separate from their planetary host.
        ore='block/material_sets/'+family+'/ore'
        layers=[ore,ore+'_layer2']
        for i,layer in enumerate(layers):out.alpha_composite(tint(texture(layer),brighten(col(s['color']),.27*i)))
        dest('kubejs/textures/block/'+s['ore']+'.png',out,[stone]+layers)
    for p in sorted((ART/'kubejs/textures/item').glob('*.png')):
        if p.stem.startswith('mill_'):continue
        name=p.stem;form=TOOLS['form_for'](name);rgb=dyed(name)
        if any(t in name for t in ('record','report','manifest','receipt','permit','diagnostic','certificate')):
            for word,c in COLOURS.items():
                if word in name:
                    rgb=tuple(round(.52*a+.48*b) for a,b in zip(rgb,col(c)));break
        if form=='mask':
            orig=Image.open(BytesIO(GEOMETRY.read('kubejs/textures/item/'+p.name))).convert('RGBA')
            source='block/fluids/fluid.distilled_water'
            if GT_ROOT+'textures/'+source+'.png' not in INDEX:source='block/fluids/fluid.sulfuric_acid'
            img=tint(first(texture(source)),(90,164,217),True);img.putalpha(orig.getchannel('A'));refs=[source]
        else:img,refs=bitmap(form,rgb,name)
        dest(p.relative_to(ART).as_posix(),img,refs)
        remove_animation(p)


def liquids():
    for path in sorted((ART/'kubejs/textures/block').glob('*_still.png')):
        name=path.stem[:-6]
        if name.startswith('mill_'):
            site=next(s for s in SITES if name=='mill_'+s['id']+'_liquor')
            rgb=col(site['color']);ref='fluid.sulfuric_acid'
        elif any(s in name for s in ('plasma','gas','atmosphere','helium')):
            rgb=(140,181,199) if 'plasma' not in name else (167,133,208)
            ref='fluid.steam'
        elif any(s in name for s in ('fuel','oil','matrix','propellant','crude','condensate','flight','diesel')):
            rgb=(184,135,83) if 'crude' not in name else (124,105,86)
            ref='fluid.light_fuel'
        elif any(s in name for s in ('spent','depleted','warm','return','brine')):
            rgb=(145,144,94) if any(s in name for s in ('spent','return','depleted')) else (149,166,173)
            ref='fluid.sulfuric_acid'
        elif any(s in name for s in ('coolant','clean','rinse','permeate','water')):
            rgb=(114,190,207) if 'orbital' not in name else (111,206,214)
            ref='fluid.sulfuric_acid'
        else:
            ref='fluid.sulfuric_acid';rgb=col(TOOLS['color_for'](name))
        if not name.startswith('mill_'):
            identity=col(LEGACY[name+'_still']);rgb=tuple(min(245,round(.35*a+.65*(b*1.33+9))) for a,b in zip(rgb,identity))
        if not name.startswith('mill_'):
            varieties={
                'calorite_flight_gel':'glue','europa_transfer_medium':'lubricant','survey_propellant':'naphtha',
                'stabilized_flight_blend':'diesel','titan_flight_matrix':'cetane_boosted_diesel',
                'mv_dielectric_oil':'lubricant','washed_crude':'oil_medium','desalted_crude':'oil_light',
                'iv_bonding_slurry':'glue','iv_ceramic_suspension':'glue','ev_rutile_slurry':'glue',
                'titan_raw_condensate':'light_fuel','titan_return_liquor':'hydrochloric_acid',
                'reclaim_recovered_acid':'hydrochloric_acid','zpm_europium_plasma':'natural_gas',
                'spent_fusion_helium':'refinery_gas','end_atmosphere':'natural_gas','vacuum_shield_gas':'steam',
                'tungsten_leach_solution':'fluoroantimonic_acid','niobium_leach_solution':'hydrochloric_acid',
                'spent_tungsten_leach':'sulfuric_acid','spent_niobium_leach':'sulfuric_acid',
                'final_quench_mix':'lubricant','final_return_coolant':'hydrochloric_acid',
                'iv_photoresist':'glue','spent_iv_photoresist':'glue'}
            if name in varieties:ref='fluid.'+varieties[name]
        native='block/fluids/'+ref
        orig=texture(native)
        meta=GT_ROOT+'textures/'+native+'.png.mcmeta'
        anim=json.loads(GT.read(meta)) if meta in INDEX else {'animation':{'frametime':4}}
        for size,kind in ((16,'still'),(32,'flow')):
            # Scale whole native frames by an integer, keeping the original animation phase and frame order.
            im=tint(orig,rgb,True)
            im=im.resize((size,size*(orig.height//orig.width)),Image.Resampling.NEAREST)
            rel='kubejs/textures/block/'+name+'_'+kind+'.png';dest(rel,im,[native])
            if im.height>size:
                cfg=dict(anim['animation'])
                if 'width' in cfg:cfg['width']=size
                if 'height' in cfg:cfg['height']=size
                Path(str(ART/rel)+'.mcmeta').write_text(json.dumps({'animation':cfg},separators=(',',':'))+'\n',encoding='utf8')
            else:remove_animation(ART/rel)


def equipment():
    blocks={'cold_coals':('block/misc/brittle_charcoal','7B8585'),'live_coals':('block/misc/brittle_charcoal','E58440'),
     'fireclay':('block/casings/solid/machine_primitive_bricks','CF9B7C'),'masonry':('block/casings/solid/machine_coke_bricks','C39476'),
     'hearthstone':('block/stones/basalt/cobble','9E9A94'),'leather':('block/rubber_log','B79B83'),
     'scorched':('block/stones/black_granite/bricks_cracked','A49D99'),'timber':('block/treated_wood_planks','CBAB87')}
    for name,(ref,colour) in blocks.items():
        rgb=col(colour);src=first(texture(ref));result=tint(src,rgb,True)
        if name=='live_coals':
            result=Image.new('RGBA',(16,128))
            for i,v in enumerate([.60,.70,.80,.94,1,.90,.78,.65]):
                heat=ImageOps.colorize(ImageOps.grayscale(src),black=(45,22,17),mid=(round(166*v),round(69*v),26),white=(255,round(202*v),99)).convert('RGBA')
                result.paste(heat,(0,16*i))
        dest('kubejs/textures/block/bloomery_'+name+'.png',result,[ref])
    for rel in GEOMETRY.namelist():
        if not (rel.startswith('gtibd_core/') or rel.startswith('zero_shift/textures/environment/')):continue
        src=Image.open(BytesIO(GEOMETRY.read(rel))).convert('RGBA');name=Path(rel).stem
        tier={'surveyor':'luv','courier':'zpm','freighter':'uv'}.get(name)
        ref='block/casings/voltage/'+(tier or 'ev')+'/side'
        if tier:
            colored=SPACE_PAINT(name,rel,src,texture,ref)
            dest(rel,colored,[ref,'GTIBD faceted airframe, hand-painted surface materials and Roman numeral markings'])
            continue
        palette=col({'ceres':'A8A4A0','europa':'AECBD1','titan':'CB9655','jupiter':'C59F81','saturn':'DFBE87'}[name])
        grey=ImageOps.grayscale(src)
        colored=ImageOps.colorize(grey,black=(15,20,24),mid=palette,white=(233,237,228),midpoint=148).convert('RGBA')
        colored.putalpha(src.getchannel('A'))
        dest(rel,colored,['GregTech material palette; original planetary geometry'])


def interface():
    bronze='block/casings/steam/bricked_bronze/side'
    steel='block/casings/voltage/hv/side'
    def shade(ref,pos):
        tones=sorted({p[:3] for p in texture(ref).get_flattened_data() if p[3]},key=sum)
        return tones[round((len(tones)-1)*pos)]
    mid=shade(bronze,.74);shine=shade(steel,.93)
    with ZipFile(HERE/'interface-geometry.zip') as z:
        for rel in z.namelist():
            src=Image.open(BytesIO(z.read(rel)));frames=[];times=[]
            art=Path(rel).name in ('foundry.png','transfer.png','logo.png')
            button='menu-button' in rel
            if button and 'primary' not in rel:accent=shade(steel,.27)
            elif 'hover' in rel:accent=shade(bronze,.94)
            else:accent=mid
            for i in range(src.n_frames):
                src.seek(i);im=src.convert('RGBA')
                mapped=ImageOps.colorize(ImageOps.grayscale(im),black=(12,19,24),mid=accent,white=shine,midpoint=146)
                colored=Image.blend(im.convert('RGB'),mapped,.20 if art else (.36 if button else .28))
                colored.putalpha(im.getchannel('A'));frames.append(colored)
                times.append(round(src.info.get('duration',80)))
            opt={'optimize':True}
            if len(frames)>1:opt.update(save_all=True,append_images=frames[1:],duration=times,loop=src.info.get('loop',0),blend=0,disposal=0)
            frames[0].save(BASE/rel,format='PNG',**opt)
            CREDITS[rel]=[bronze,steel,'Original GTIBD artwork and animation timings']


def run():
    ores_and_items();liquids();equipment();interface()
    for web in sorted((ART/'kubejs/textures/quests/web').glob('*.png')):
        CREDITS[web.relative_to(ART).as_posix()]=['block/casings/steam/bricked_bronze/side','block/casings/voltage/hv/side','FTB quest dependency geometry (tools/quest-layout.mjs)']
    mask='minecraft/textures/gui/title/background/panorama_overlay.png'
    if Image.open(ART/mask).convert('RGBA').getchannel('A').getbbox() is not None:raise ValueError('Expected a transparent technical mask')
    CREDITS[mask]=['Transparent technical mask']
    expected={p.relative_to(ART).as_posix() for p in ART.rglob('*.png')}
    if not expected.issubset(CREDITS):raise ValueError('Unmapped textures: '+str(expected-CREDITS.keys()))
    out=BASE/'dist/GTIBD-Fieldwork-dev.10/texture-sources.json'
    out.parent.mkdir(exist_ok=True,parents=True)
    out.write_text(json.dumps({'gregtech':'1.20.1-7.5.3','assets':CREDITS},indent=2,sort_keys=True)+'\n',encoding='utf8')
    return CREDITS


if __name__=='__main__':
    refs=run()
    print(len(refs),'sprite files rendered using the installed GregTech material models and textures')
