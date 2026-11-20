"""Draw the ZPM optical parts and animated Ceres brines at native sprite sizes."""
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2] / 'pack/overrides/kubejs/assets/kubejs/textures'
STEEL = ('#172128', '#334450', '#657d87', '#94abb1', '#dde8e4')
ICE = ('#192f42', '#315569', '#53899b', '#89c1c8', '#d6eff1')
BRONZE = ('#292328', '#59413d', '#946744', '#c49664', '#f0cd96')
BLUE = ('#252837', '#414258', '#646a83', '#97a7b7', '#dbe7e3')


def blank():
    im = Image.new('RGBA', (16, 16))
    return im, ImageDraw.Draw(im)


def save(im, name):
    im.save(ROOT / 'item' / ('zpm_' + name + '.png'))


def block(d, x, y, color):
    d.point((x, y), fill=color)


def plate(d, y, palette):
    poly = [(1, 7+y), (9, 2+y), (14, 4+y), (15, 6+y),
            (7, 12+y), (5, 12+y), (1, 10+y)]
    d.polygon(poly, fill=palette[0])
    d.polygon([(2,7+y),(9,3+y),(13,4+y),(14,6+y),(6,11+y),(2,9+y)], fill=palette[2])
    d.line([(2,7+y),(9,3+y),(12,4+y)], fill=palette[4])
    d.line([(3,9+y),(6,10+y),(13,6+y)], fill=palette[3])


def optics():
    im, d = blank()
    plate(d, 2, STEEL)
    plate(d, 0, ICE)
    d.line([(5,7),(9,5),(11,5)], fill=ICE[3])
    save(im, 'glacio_lamella')
    im, d = blank()
    d.polygon([(2,3),(6,2),(11,3),(14,5),(13,11),(10,14),(5,13),(1,11)], fill=ICE[0])
    d.polygon([(3,4),(6,3),(10,4),(13,5),(12,10),(9,13),(5,12),(2,10)], fill=ICE[2])
    for y, start, end in [(5,3,9),(7,3,11),(9,3,11),(11,5,10)]:
        d.line([(start,y),(start+2,y-1),(end,y+1)], fill=ICE[3])
        block(d,start+1,y-1,ICE[4])
    d.line([(10,4),(9,6),(10,8),(8,10),(9,12)], fill=ICE[1])
    save(im, 'europa_membrane')
    im, d = blank()
    d.ellipse((1,1,14,14), fill=STEEL[0])
    d.ellipse((2,2,13,13), fill=STEEL[3])
    d.ellipse((3,3,12,12), fill=ICE[0])
    d.ellipse((4,4,11,11), fill=ICE[2])
    d.line([(4,7),(11,7)], fill=ICE[0]); d.line([(8,4),(8,11)], fill=ICE[0])
    for x,y in [(5,5),(10,5),(5,10),(10,10)]: block(d,x,y,ICE[4])
    d.line([(3,3),(5,2)], fill=STEEL[4]);block(d,8,7,BRONZE[4])
    save(im, 'europa_reticle')


def frame(tested, assembly=False):
    im, d = blank()
    rim = BLUE if tested else STEEL
    d.polygon([(1,5),(4,2),(12,2),(15,5),(15,11),(12,14),(4,14),(1,11)],fill=rim[0])
    d.polygon([(2,5),(5,3),(11,3),(14,5),(14,10),(11,12),(5,12),(2,10)],fill=rim[2])
    d.line([(2,5),(5,3),(11,3),(13,4)],fill=rim[4])
    d.line([(3,11),(5,13),(11,13),(14,11)],fill=rim[1])
    d.polygon([(4,6),(6,4),(10,4),(12,6),(12,9),(10,11),(6,11),(4,9)],fill=rim[0])
    d.polygon([(5,7),(7,5),(10,5),(11,6),(11,8),(9,10),(7,10),(5,9)],fill=(0,0,0,0))
    for x,y in [(3,5),(12,5),(4,10),(12,10)]:
        block(d,x,y,BRONZE[3] if tested else rim[3])
    if tested:
        d.line([(5,3),(8,3)],fill=BRONZE[3]);d.line([(8,12),(11,12)],fill=BRONZE[2])
    if assembly:
        d.rectangle((5,5,10,9),fill=BRONZE[1])
        d.rectangle((5,4,10,8),fill=ICE[0])
        d.rectangle((6,5,9,7),fill=ICE[2])
        d.line([(6,5),(8,5)],fill=ICE[4])
        for x in (6,8,10):d.line([(x,10),(x,11)],fill=BRONZE[4])
    return im


def cartridge():
    im, d = blank()
    d.polygon([(1,7),(9,2),(14,4),(15,7),(14,11),(7,15),(2,13)],fill=STEEL[0])
    d.polygon([(2,8),(10,3),(13,5),(13,7),(6,12),(2,11)],fill=STEEL[2])
    d.line([(2,8),(9,4)],fill=STEEL[4])
    d.polygon([(3,10),(10,5),(13,6),(6,11)], fill=BRONZE[1])
    d.line([(4,9),(10,5)],fill=BRONZE[4])
    d.polygon([(7,12),(14,7),(13,10),(7,14)],fill=STEEL[1])
    block(d,10,10,STEEL[3]);block(d,4,12,STEEL[4])
    return im


def backplane():
    im, d = blank()
    d.polygon([(1,4),(4,2),(13,2),(15,4),(15,11),(12,13),(2,13),(1,11)],fill=STEEL[0])
    d.rectangle((2,4,13,11),fill='#375351')
    d.line([(2,4),(4,3),(12,3)],fill='#8ea89b')
    for x in (4,9):
        d.rectangle((x,5,x+2,8),fill=STEEL[0])
        d.line([(x,5),(x+2,5)],fill=BLUE[3])
        d.line([(x,9),(x+2,9)],fill=BRONZE[3])
    for x in (3,5,7,9,11): d.line([(x,11),(x,12)],fill=BRONZE[4])
    block(d,3,6,ICE[4]);block(d,12,9,ICE[4])
    return im


def fluid(name, low, high):
    for size, suffix in [(16, 'still'), (32, 'flow')]:
        sheet = Image.new('RGBA', (size, size * 4))
        for frame_i in range(4):
            for y in range(size):
                for x in range(size):
                    phase = math.tau * frame_i / 4
                    xx, yy = math.tau*x/size, math.tau*y/size
                    wave = .5 + .24*math.sin(2*xx + yy + phase) + .16*math.cos(3*yy - phase) + .09*math.sin(4*xx - 2*yy)
                    rgb = tuple(round(a + (b-a)*wave) for a,b in zip(low,high))
                    sheet.putpixel((x,y+frame_i*size),(*rgb,255))
        path = ROOT/'block'/('zpm_'+name+'_'+suffix+'.png')
        sheet.save(path)
        Path(str(path)+'.mcmeta').write_text(json.dumps({'animation':{'frametime':8,'interpolate':True}},separators=(',',':'))+'\n',encoding='utf-8')


if __name__ == '__main__':
    optics()
    save(frame(False), 'preload_frame')
    save(frame(True), 'tempered_frame')
    save(frame(True, True), 'europa_datum')
    save(cartridge(), 'die_cartridge')
    save(backplane(), 'storage_backplane')
    fluid('ceres_brine', (41,72,83), (136,185,180))
    fluid('spent_brine', (41,53,56), (123,130,102))
