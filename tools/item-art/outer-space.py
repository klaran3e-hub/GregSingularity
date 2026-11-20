"""Native entity atlases, inventory silhouettes and sky sprites for the three routes."""
from pathlib import Path
from math import sin, cos, sqrt
from random import Random
from PIL import Image, ImageDraw

ASSETS=Path(__file__).resolve().parents[2]/'pack/overrides/kubejs/assets'
core=ASSETS/'gtibd_core/textures'
for drv in ['item','entity']:
    (core/drv).mkdir(parents=True,exist_ok=True)
rock=ASSETS/'kubejs/textures'
palettes=[('surveyor','survey_drive',(164,177,169),(37,113,119)),('courier','courier_drive',(185,201,217),(65,87,162)),('freighter','freighter_drive',(137,131,114),(194,115,44))]
def tint(c,a):
    return tuple(min(255,max(0,int(v*a))) for v in c)
for stage,(ship,drive,metal,accent) in enumerate(palettes):
    skin=Image.new('RGB',(160,160));d=ImageDraw.Draw(skin);rng=Random(81+stage)
    for y in range(160):
        for x in range(160):
            base=metal
            if y in range(29,35) or y in range(51,54) or y>=105:base=accent
            if x>=84 and 44<=y<52:base=(33,65,76)
            if 89<=y<102 and x<56:base=(56,60,64)
            if y%16==0 or x%20==0:shift=.66
            elif y%16==1 or x%20==1:shift=1.12
            else:shift=.95+.035*cos(x*.32)
            skin.putpixel((x,y),tint(base,shift+rng.uniform(-.03,.03)))
    for x in range(3,158,10):
        for y in range(4,151,16):
            d.point((x,y),fill=tint(metal,.48));d.point((x,y-1),fill=tint(metal,1.15))
    for band in (22,42,62):
        d.rectangle((band,42,band+6,49),fill=tint(metal,.5))
        for y in (43,45,47):d.line((band+1,y,band+5,y),fill=tint(metal,.95))
    for i in range(stage+1): d.rectangle((24+i*3,55,25+i*3,60),fill=accent)
    d.line((85,46,94,46), fill=(146,201,204))
    skin.save(core/'entity'/(ship+'.png'))
    ico=Image.new('RGBA',(16,16));d=ImageDraw.Draw(ico)
    d.polygon([(6,3),(7,0),(9,1),(10,3),(11,5),(11,11),(13,13),(13,15),(9,14),(6,14),(3,15),(3,12),(5,10),(5,5)],fill=(31,39,44))
    d.polygon([(6,5),(7,3),(8,1),(9,3),(10,5),(10,11),(8,13),(6,12)],fill=metal)
    d.line((6,5,6,11),fill=tint(metal,1.25));d.line((10,5,10,11),fill=tint(metal,.62))
    d.rectangle((7,5,9,6),fill=(55,79,88));d.point((7,5),fill=(164,210,217));d.line((6,8,10,8),fill=accent)
    width=1 if stage==0 else 2
    for x in (4,11):
        d.rectangle((x,10-stage,x+width-1,13),fill=accent);d.point((x,14),fill=(61,61,60))
    ico.save(core/'item'/(ship+'.png'))
    ico=Image.new('RGBA',(16,16));d=ImageDraw.Draw(ico)
    d.polygon([(2,6),(6,2),(12,2),(14,5),(13,10),(10,14),(4,14),(1,11)],fill=tint(metal,.23))
    d.polygon([(3,6),(7,3),(11,3),(13,5),(9,8),(5,8)],fill=metal)
    d.polygon([(3,8),(8,10),(12,7),(12,10),(9,13),(4,12)],fill=tint(metal,.59))
    d.line((4,6,8,3),fill=tint(metal,1.3));d.line((5,10,9,11,12,8),fill=accent,width=2)
    for i in range(stage+1):d.point((6+i*2,6),fill=accent)
    ico.save(rock/'item'/(drive+'.png'))

for seam,item,base,edge in [('europa_rift_core','europa_phase_ceramic',(74,104,129),(136,211,224)),('titan_seam_core','titan_load_standard',(97,69,55),(224,153,64))]:
    image=Image.new('RGB',(16,16));d=ImageDraw.Draw(image);rng=Random(51)
    for y in range(16):
        for x in range(16):image.putpixel((x,y),tint(base,rng.uniform(.68,1.12)))
    for x,y in [(2,11),(6,10),(9,6),(12,5),(4,4),(11,13)]:
        d.line((x-1,y+1,x+2,y-1),fill=tint(edge,.73),width=2);d.line((x,y,x+1,y-1),fill=edge)
    image.save(rock/'block'/(seam+'.png'))
    image=Image.new('RGBA',(16,16));d=ImageDraw.Draw(image)
    d.polygon([(1,8),(9,2),(12,2),(15,5),(14,10),(6,15),(2,12)],fill=tint(base,.36))
    d.polygon([(2,8),(10,3),(13,4),(13,6),(6,11),(3,10)],fill=edge)
    d.polygon([(3,11),(7,12),(13,7),(13,9),(6,14),(3,12)],fill=base)
    d.line((3,8,10,3),fill=tint(edge,1.35));d.line((5,9,10,6),fill=tint(base,.95))
    image.save(rock/'item'/(item+'.png'))

sky=ASSETS/'zero_shift/textures/environment'
for body,planet in [('europa',(162,190,197)),('titan',(199,142,76)),('jupiter',(192,155,126)),('saturn',(196,178,128))]:
    extent=128; image=Image.new('RGBA',(extent,extent));d=ImageDraw.Draw(image)
    if body=='saturn': d.ellipse((2,43,126,84),outline=(149,139,116),width=5)
    r=40 if body=='saturn' else 59
    for y in range(extent):
        for x in range(extent):
            u=(x-63.5)/r;v=(y-63.5)/(r*.94)
            if u*u+v*v>=1:continue
            z=sqrt(1-u*u-v*v);lit=.22+max(0,.7*z-.43*u-.34*v)
            if body=='europa': lit-=.25 if abs(sin(9*u+4*sin(4*v))+.5*cos(10*v+u))<.07 else .015
            elif body=='titan':lit+=.06*sin(8*v+2*u)+.05*cos(6*u+v)
            else:lit+=.11*sin(18*v+sin(4*u))+.06*cos(43*v+u)
            image.putpixel((x,y),(*tint(planet,lit),255))
    if body=='saturn':d.arc((2,43,126,84),0,180,fill=(200,185,145),width=5)
    image.save(sky/(body+'.png'))
