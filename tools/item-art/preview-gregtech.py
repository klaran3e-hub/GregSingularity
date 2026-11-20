"""Build pixel-perfect comparison sheets from real pack sprites and an earlier asset ZIP."""
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
import sys
import textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / 'pack/overrides/kubejs/assets'
DEST = ROOT / 'dist/GTIBD-Fieldwork-dev.10'
FONTDIR = Path('C:/Windows/Fonts')
SITES = json.loads((ROOT/'tools/planetary-mills.json').read_text(encoding='utf8'))
LANG = json.loads((ART/'kubejs/lang/ru_ru.json').read_text(encoding='utf8'))
OLD = ZipFile(sys.argv[1] if len(sys.argv)>1 else ROOT/'.dev/titan-works-client/art-before.zip')
UI = ZipFile(ROOT/'tools/item-art/interface-geometry.zip')
ROOT_BG, CARD, LINE = '#182126','#202b31','#34444c'
BONE, MUTE, GOLD = '#f0eee4','#b5c1c3','#e6bb7e'
def font(n,bold=False):
    for name in (('segoeuib.ttf','arialbd.ttf') if bold else ('segoeui.ttf','arial.ttf')):
        if (FONTDIR/name).exists():return ImageFont.truetype(str(FONTDIR/name),n)
    return ImageFont.truetype('DejaVuSans.ttf',n)
def canvas(w,h,title,note):
    img=Image.new('RGB',(w,h),ROOT_BG);d=ImageDraw.Draw(img)
    d.text((26,15),title,fill=BONE,font=font(27,True));d.text((27,56),note,fill=MUTE,font=font(16))
    return img,d
def sprite(sheet,src,x,y,w,h):
    src=src.convert('RGBA')
    if src.height>src.width and src.height%src.width==0:src=src.crop((0,0,src.width,src.width))
    fac=min(w/src.width,h/src.height)
    dest=src.resize((max(1,round(src.width*fac)),max(1,round(src.height*fac))),Image.Resampling.NEAREST)
    sheet.paste(dest,(x+(w-dest.width)//2,y+(h-dest.height)//2),dest)
def old(rel):
    return Image.open(BytesIO((UI if rel in UI.namelist() else OLD).read(rel))).convert('RGBA')
def current(rel):
    return (ROOT if rel in UI.namelist() else ART)/rel
def title(rel):
    name=Path(rel).stem;ns=rel.split('/')[0]
    vehicles={'surveyor':'Ракета Tier V • LuV','courier':'Ракета Tier VI • ZPM','freighter':'Ракета Tier VII • UV','ceres':'Церера','europa':'Европа','titan':'Титан','jupiter':'Юпитер','saturn':'Сатурн'}
    if ns=='gtibd_core' and name in vehicles:return vehicles[name]+(' / обшивка' if '/entity/' in rel else '')
    if ns=='zero_shift' and name in vehicles:return vehicles[name]
    if '/quests/web/' in rel:return 'Карта квестов / '+name.replace('_',' ')
    if rel in UI.namelist():return 'Интерфейс / '+name.replace('-',' ')
    if name=='panorama_overlay':return 'Прозрачная маска панорамы'
    for pref in ('item','block','fluid_type','fluid'):
        key=pref+'.'+ns+'.'+name.removesuffix('_still').removesuffix('_flow')
        if key in LANG:return LANG[key]
    return name.replace('_',' ')
def ore_sheet():
    headings=['Руда в породе','Дроблёная','Промытая','Тяжёлая фракция','Кристаллизат','Прокалённая']
    img,d=canvas(1090,915,'Планетарные руды','Восемь месторождений GTIBD   /   игровые текстуры 16 × 16, увеличенные целым числом')
    x0,step=190,147
    for c,h in enumerate(headings):d.text((x0+c*step+49,103),h,fill=GOLD,font=font(15,True),anchor='mm')
    for row,s in enumerate(SITES):
        y=128+row*95;d.rounded_rectangle((20,y,1069,y+88),5,fill=CARD)
        d.text((36,y+22),s['title'],font=font(21,True),fill=BONE);d.text((37,y+53),s['tier'],font=font(14),fill=MUTE)
        paths=['kubejs/textures/block/'+s['ore']+'.png']+['kubejs/textures/item/mill_'+s['id']+'_'+form+'.png' for form in ('grit','washed','heavy','crystal','assay')]
        for col,rel in enumerate(paths):sprite(img,Image.open(ART/rel),x0+col*step+17,y+12,64,64)
    img.save(DEST/'planetary-ores.png')
def comparisons(paths,page=0):
    cols=3 if len(paths)<=15 else 4
    cellw=320 if cols==3 else 290
    rows=(len(paths)+cols-1)//cols;cellh=137
    img,d=canvas(40+cols*cellw,109+rows*cellh,'GTIBD   /   До и после' if page==0 else 'GTIBD   /   Каталог текстур  •  '+str(page),'Слева прежняя текстура, справа текстура текущей сборки')
    for i,rel in enumerate(paths):
        x=20+i%cols*cellw;y=92+i//cols*cellh
        d.rounded_rectangle((x,y,x+cellw-8,y+cellh-8),5,fill=CARD,outline=LINE)
        name=title(rel)
        lines=textwrap.wrap(name,width=31 if cols==3 else 28)
        for k,line in enumerate(lines[:2]):d.text((x+12,y+7+19*k),line,fill=BONE,font=font(15,True))
        pane=(cellw-8)//2
        sprite(img,old(rel),x+pane//2-32,y+50,64,64);sprite(img,Image.open(current(rel)),x+pane+pane//2-32,y+50,64,64)
        d.line((x+pane,y+54,x+pane,y+109),fill=LINE)
    return img
def main():
    DEST.mkdir(parents=True,exist_ok=True);ore_sheet()
    parts=['mill_mars_grit','mill_mars_washed','mill_mars_heavy','mill_europa_crystal','mill_europa_assay','coke_brick_blank','titan_wick','titan_spent_wick','titan_radiator_core','tool_handle','luv_venus_timing_prism','zpm_storage_backplane']
    comparisons(['kubejs/textures/item/'+p+'.png' for p in parts]).save(DEST/'gregtech-before-after.png')
    early=['fired_crucible','copper_charge','bronze_charge','green_tuyere','fired_tuyere','grinding_runner','saw_teeth','saw_blade','iron_hinge','kiln_grate','refinery_tray','bench_soldering_iron']
    comparisons(['kubejs/textures/item/'+p+'.png' for p in early]).save(DEST/'workshop-before-after.png')
    sub=['kubejs/textures/item/'+x+'.png' for x in ('titan_wick','titan_spent_wick','titan_radiator_core')]+['kubejs/textures/block/'+x+'_still.png' for x in ('titan_raw_condensate','titan_orbital_coolant','titan_return_liquor')]
    if all((ART/r).is_file() for r in sub):comparisons(sub).save(DEST/'titan-textures.png')
    space=['gtibd_core/textures/item/'+n+'.png' for n in ('surveyor','courier','freighter')]+['zero_shift/textures/environment/'+n+'.png' for n in ('ceres','europa','titan','jupiter','saturn')]
    comparisons(space).save(DEST/'space-before-after.png')
    eligible=sorted(p for p in OLD.namelist() if p.endswith('.png'))+sorted(UI.namelist())
    with ZipFile(DEST/'GTIBD-textures-before-after.zip','w',compression=ZIP_DEFLATED) as z:
        for i in range(0,len(eligible),24):
            buf=BytesIO();comparisons(eligible[i:i+24],1+i//24).save(buf,format='PNG');z.writestr('catalogue-%02d.png'%(1+i//24),buf.getvalue())
        for name in ('planetary-ores.png','gregtech-before-after.png','quantum-storage-board.png','titan-textures.png','workshop-before-after.png','space-before-after.png'):
            if (DEST/name).exists():z.write(DEST/name,name)
        info=DEST/'texture-sources.json'
        if info.exists():z.write(info,info.name)
    print('Rendered',len(eligible),'before/after entries')
if __name__=='__main__':main()
