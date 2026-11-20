"""Verify packaged sprite bytes, localized resource IDs and animations in the importable profile."""
from collections import Counter
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[2]
DIST=ROOT/'dist/GTIBD-Fieldwork-dev.10'
ART=ROOT/'pack/overrides/kubejs/assets'
SOURCES=json.loads((DIST/'texture-sources.json').read_text(encoding='utf8'))['assets']
def verify():
    with ZipFile(DIST/'GT-IBD-Fieldwork-dev.10.zip') as pack:
        assert pack.testzip() is None
        jarpath,=[p for p in pack.namelist() if p.startswith('overrides/mods/gtibd-core-') and p.endswith('.jar')]
        data=pack.read(jarpath)
        assert data==(ROOT/'dist/GTIBD-Core-0.1.0-dev.10'/Path(jarpath).name).read_bytes()
        with ZipFile(BytesIO(data)) as core,ZipFile(ROOT/'.dev/titan-works-server/mods/gtceu-1.20.1-7.5.3.jar') as gt:
            assert core.testzip() is None
            assert core.getinfo('META-INF/licenses/GregTech-Modern/NOTICE.txt')
            original=ZipFile(ROOT/'tools/item-art/interface-geometry.zip')
            counts=Counter();graphics=set();water=set()
            for name,origins in SOURCES.items():
                for ref in origins:
                    if ref.startswith(('item/','block/','gui/')):assert 'assets/gtceu/textures/'+ref+'.png' in gt.namelist(),(name,ref)
                if name.startswith('pack/overrides/'):
                    source=(ROOT/name).read_bytes();packed=pack.read(name.removeprefix('pack/'));group='interface'
                elif name.startswith('addons/'):
                    source=(ROOT/name).read_bytes();packed=core.read('logo.png');group='mod logo'
                else:
                    source=(ART/name).read_bytes();packed=core.read('assets/'+name)
                    group='/'.join(name.split('/')[:3])
                assert source==packed,name
                counts[group]+=1;im=Image.open(BytesIO(packed))
                if group=='kubejs/textures/item':
                    assert im.size==(16,16) and im.convert('RGBA').getchannel('A').getbbox(),name
                    graphics.add(sha256(im.convert('RGBA').tobytes()).digest())
                if name.endswith('_still.png'):water.add(sha256(packed).digest())
                if name in original.namelist():
                    src=Image.open(BytesIO(original.read(name)));assert (src.size,src.n_frames)==(im.size,im.n_frames),name
                    for i in range(im.n_frames):
                        src.seek(i);im.seek(i)
                        assert src.info.get('duration')==im.info.get('duration'),name
                        assert src.convert('RGBA').getchannel('A').tobytes()==im.convert('RGBA').getchannel('A').tobytes(),(name,i)
                if name.startswith('kubejs/textures/block/'):
                    meta=ART/(name+'.mcmeta')
                    if im.height>im.width:
                        assert meta.exists(),name
                        assert core.read('assets/'+name+'.mcmeta')==meta.read_bytes(),name
                        config=json.loads(meta.read_bytes())['animation'];w=config.get('width',im.width);h=config.get('height',w)
                        assert im.width%w==0 and im.height%h==0,(name,im.size,w,h)
                        assert config.get('frametime',1)>0
                        for frame in config.get('frames',[]):
                            idx=frame['index'] if isinstance(frame,dict) else frame;assert 0<=idx<(im.width//w)*(im.height//h),(name,idx)
            assert sum(counts.values())==644 and len(graphics)==475 and len(water)==54,(counts,len(graphics),len(water))
            assert len([p for p in core.namelist() if p.startswith('assets/') and p.endswith('.png')])==633
            tiers=('I','II','III','IV','V','VI','VII')
            vehicles=('surveyor','courier','freighter')
            atlas=json.loads(core.read('assets/minecraft/atlases/blocks.json'))['sources']
            for ship in vehicles:
                entity_tex='gtibd_core:entity/'+ship
                assert {'type':'minecraft:single','resource':entity_tex} in atlas
                model=json.loads(core.read('assets/gtibd_core/models/item/'+ship+'.json'))
                assert model['base']['loader']=='forge:obj'
                path='assets/'+model['base']['model'].replace(':','/')
                mesh=core.read(path).decode('ascii')
                assert mesh.count('\nf ')>400 and f'mtllib {ship}.mtl' in mesh
                assert 'map_Kd '+entity_tex in core.read(path[:-3]+'mtl').decode('ascii')
                assert model['perspectives']['gui']['textures']['layer0']=='gtibd_core:item/'+ship
            for lang in ('ru_ru','en_us'):
                strings=json.loads(core.read('assets/kubejs/lang/'+lang+'.json'))
                stock=json.loads(core.read('assets/ad_astra/lang/'+lang+'.json'))
                for i,tier in enumerate(tiers):
                    local=stock if i<4 else strings
                    key=f'ad_astra.tier_{i+1}_rocket' if i<4 else 'gtibd_core.'+vehicles[i-4]
                    expected='Ракета Tier '+tier if lang=='ru_ru' else 'Tier '+tier+' Rocket'
                    assert all(local[kind+'.'+key]==expected for kind in ('entity','item')),key
                for site in json.loads((ROOT/'tools/planetary-mills.json').read_text(encoding='utf8')):
                    assert 'block.kubejs.'+site['ore'] in strings
                    for step in ('grit','washed','heavy','crystal','assay'):assert 'item.kubejs.mill_'+site['id']+'_'+step in strings
    return counts,len(graphics),len(water)
if __name__=='__main__':
    counts,icons,liquids=verify()
    print('Verified packaged graphics',sum(counts.values()),'distinct inventory sprites',icons,'distinct fluids',liquids)
