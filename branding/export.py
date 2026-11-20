"""Size original GregSingularity artwork for the game, project pages and Discord."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

root = Path(__file__).resolve().parents[1]
source = Path(__file__).resolve().parent / 'source'
out = root / 'branding' / 'public'
menu = root / 'pack/overrides/config/gtibd-interface'
out.mkdir(parents=True, exist_ok=True)
font_path = Path('C:/Windows/Fonts/bahnschrift.ttf')
if not font_path.exists():
    font_path = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')

def font(size):
    return ImageFont.truetype(str(font_path), size)

def artwork(key):
    return Image.open(source / (key + '.png')).convert('RGB')

def cover(key, size, center=(.5, .5)):
    return ImageOps.fit(artwork(key), size, method=Image.Resampling.LANCZOS, centering=center)

def banner(key, title, filename):
    im = cover(key, (1400, 380))
    shade = Image.new('RGBA', im.size)
    pen = ImageDraw.Draw(shade)
    for x in range(990):
        pen.line((x,0,x,380), fill=(5,13,17,round(190*(1-x/990))))
    im = Image.alpha_composite(im.convert('RGBA'), shade)
    draw = ImageDraw.Draw(im)
    draw.rectangle((61,109,125,114),fill='#F2A057')
    draw.text((57,136),title,font=font(77),fill='#FFF4E0',stroke_width=1,stroke_fill='#1D2120')
    im.convert('RGB').save(out / filename, quality=91, optimize=True, subsampling=0)

for key, title, name in [
    ('hero','GregSingularity','cover'),('workshop','The first bronze','workshop'),
    ('automation','Factory automation','automation'),('space','Off-world industry','space'),
    ('community','Community & support','community'),('automation','GregSingularity Core','core-cover'),
    ('workshop','Materials & tooling','core-tools'),('space','Spaceflight systems','core-space'),
    ('community','Installation & support','core-install')]:
    banner(key, title, name+'.jpg')
cover('mark',(512,512)).save(out/'gregsingularity.png',optimize=True)
cover('core',(512,512)).save(out/'gregsingularity-core.png',optimize=True)
cover('core',(256,256)).save(root/'addons/gtibd-core/resources/logo.png',optimize=True)
cover('hero',(1672,941)).save(menu/'foundry.png',optimize=True)
cover('space',(1672,941)).save(menu/'transfer.png',optimize=True)
cover('mark',(128,128)).save(root/'pack/overrides/icon.png',optimize=True)
w,h=708,248
word=Image.new('RGBA',(w,h))
pen=ImageDraw.Draw(word)
ty=font(99)
name='GregSingularity'
while pen.textlength(name, font=ty)>w-18:
    ty=font(ty.size-1)
pen.text((6,69),'Greg',font=ty,fill='#F3A45D',stroke_width=1,stroke_fill='#281B18')
pen.text((6+pen.textlength('Greg',font=ty),69),'Singularity',font=ty,fill='#FFF2DE',stroke_width=1,stroke_fill='#16191B')
pen.rectangle((9,194,225,198),fill='#DF8C43')
word.save(menu/'menu-wordmark.png',optimize=True)
