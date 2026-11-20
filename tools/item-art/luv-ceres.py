"""Draw the LuV parts, salt seam and the orbital sprite on their native pixel grids."""
from math import cos, sin, sqrt
from pathlib import Path
from random import Random
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2] / 'pack/overrides/kubejs/assets'
ITEM = ROOT / 'kubejs/textures/item'
STEEL = ['#17232a', '#34464d', '#637780', '#97adb0', '#dbe1ce']
COPPER = ['#2e2424', '#503736', '#966851', '#c5946b', '#ead3a1']
GLASS = ['#252634', '#4d4269', '#796895', '#afa9d8', '#dce7ec']
SALT = ['#253038', '#4d5c65', '#859695', '#bccdc0', '#ece9d5']


def part(name, shapes, colors):
    image = Image.new('RGBA', (16, 16))
    draw = ImageDraw.Draw(image)
    for shade, points in shapes:
        if len(points) == 1:
            draw.point(points, fill=colors[shade])
        elif len(points) == 2:
            draw.line(points, fill=colors[shade])
        else:
            draw.polygon(points, fill=colors[shade])
    image.save(ITEM / ('luv_' + name + '.png'))


def frame(name, palette, insert=False):
    p = [(0, [(1,7),(8,2),(12,2),(15,5),(15,9),(8,14),(4,14),(1,11)]),
         (2, [(2,7),(9,3),(12,3),(14,5),(7,10),(4,10)]),
         (4, [(2,7),(9,3)]),(3, [(4,8),(10,4),(12,4),(6,9)]),
         (1, [(2,9),(5,11),(8,11),(14,7),(14,9),(7,13),(5,13),(2,11)]),
         (0, [(5,7),(9,4),(11,5),(7,8)])]
    if insert:
        p.extend([(2, [(4,7),(9,3),(10,1),(12,2),(13,6),(8,10)]),
                  (3, [(5,7),(10,2),(10,6),(8,9)]),(4, [(6,6),(10,2)]),
                  (1, [(10,7),(12,3),(12,6),(9,9)])])
    part(name,p,palette)


frame('prism_blank',STEEL)
frame('annealed_mount',COPPER)
frame('venus_timing_prism',GLASS,True)
part('cryo_cartridge',[
    (0,[(3,3),(6,1),(11,1),(13,3),(13,12),(10,15),(5,15),(2,12),(2,5)]),
    (2,[(3,4),(6,2),(10,2),(12,4),(10,5),(5,5)]),(4,[(4,3),(8,2)]),
    (1,[(3,6),(12,5),(12,12),(10,14),(5,14),(3,12)]),
    (2,[(4,6),(5,12)]),(3,[(6,6),(6,12)]),(2,[(8,6),(8,12)]),
    (2,[(10,6),(10,11)]),(3,[(3,12),(5,13),(10,13),(12,11),(10,12),(5,12)])],COPPER)
part('rotor_spindle',[
    (0,[(1,11),(4,8),(6,8),(6,6),(9,3),(10,3),(12,1),(14,2),(15,4),(12,7),(12,8),(9,11),(7,11),(4,14),(2,14),(1,13)]),
    (2,[(2,11),(11,3),(13,2),(14,4),(4,13),(2,13)]),(4,[(2,11),(12,2)]),
    (1,[(5,7),(7,6),(10,8),(9,10),(7,11),(5,9)]),(3,[(5,7),(7,5),(10,7),(8,9)]),
    (4,[(5,7),(7,5)]),(1,[(10,3),(12,5)]),(4,[(11,2),(13,4)])],STEEL)
part('witness_blank',[
    (0,[(1,8),(9,2),(12,2),(15,5),(15,8),(7,14),(4,14),(1,11)]),
    (1,[(2,9),(10,3),(14,5),(14,8),(6,13),(4,13),(2,11)]),
    (3,[(2,8),(10,3),(12,3),(14,5),(6,11),(4,11)]),
    (4,[(2,8),(10,3)]),(2,[(5,9),(8,6),(10,7),(7,10)]),
    (1,[(6,9),(9,7)]),(4,[(11,4)]),(1,[(4,11),(6,12),(13,7)])],STEEL)
part('glacio_seed',[
    (0,[(2,10),(4,8),(5,3),(8,1),(10,3),(10,7),(13,5),(15,7),(13,12),(8,15),(4,14)]),
    (1,[(3,10),(6,8),(6,4),(8,2),(9,4),(9,10),(7,13),(4,13)]),
    (3,[(6,4),(8,2),(8,8),(6,11)]),(4,[(6,4),(8,2)]),
    (2,[(8,12),(10,8),(13,6),(14,7),(12,11),(9,13)]),(4,[(10,9),(13,6)])],
    ['#182b3b','#355268','#51849a','#92c3ca','#d6efdd'])
grain=[]
for x,y in [(3,9),(8,4),(11,8),(7,11),(12,12),(2,5)]:
    grain.extend([(0,[(x-2,y),(x,y-2),(x+2,y-1),(x+2,y+1),(x,y+2),(x-2,y+1)]),
                  (2,[(x-1,y),(x,y-1),(x+1,y-1),(x+1,y+1),(x,y+1)]),
                  (4,[(x-1,y),(x,y-1)])])
part('ceres_salt_concentrate',grain,SALT)

rng=Random(600871)
rock=Image.new('RGB',(16,16))
draw=ImageDraw.Draw(rock)
for y in range(16):
    for x in range(16):
        tone=rng.randrange(44,65)+(y%4==0)*5
        draw.point((x,y), fill=(tone,tone+4,tone+7))
for x,y in [(1,12),(4,11),(7,8),(10,7),(13,4),(3,5),(6,4),(10,12)]:
    draw.line([(x-1,y+1),(x+2,y-1)],fill='#758789')
    draw.line([(x,y),(x+1,y-1)],fill='#c4cec2')
    draw.point((x+1,y-1),fill='#e4e4ce')
rock.save(ROOT/'kubejs/textures/block/ceres_salt_lens.png')

globe=Image.new('RGBA',(96,96))
craters=[(-.55,-.34,.21),(.22,.29,.18),(-.12,.58,.14),(.45,-.3,.135),(-.28,.02,.09),(.09,-.65,.12)]
for y in range(96):
    for x in range(96):
        u=(x-47.5)/46
        v=(y-47.5)/43
        if u*u+v*v>=1:
            continue
        z=sqrt(1-u*u-v*v)
        light=max(.10,.59*z-.58*u-.49*v)
        terrain=16*sin(u*23+3*sin(v*11))+7*cos(v*31-u*9)
        for cx,cy,r in craters:
            q=((u-cx)**2+(v-cy)**2)**.5/r
            if .83<q<1.06: terrain+=27
            elif q<.83: terrain-=19
        if ((u+.15)/.034)**2+((v-.05)/.022)**2<1 or ((u+.08)/.019)**2+((v-.08)/.017)**2<1: terrain+=100
        value=int(min(235,max(15,(135+terrain+rng.randrange(-5,6))*light)))
        globe.putpixel((x,y),(value,min(253,value+5),min(255,value+9),255))
target=ROOT/'zero_shift/textures/environment/ceres.png'
target.parent.mkdir(parents=True,exist_ok=True)
globe.save(target)
