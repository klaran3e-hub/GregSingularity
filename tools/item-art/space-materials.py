"""Paint spacecraft surfaces at the visual pixel scale of Ad Astra and GregTech."""
from pathlib import Path
import runpy
from PIL import Image,ImageDraw

AIRFRAMES=runpy.run_path(str(Path(__file__).with_name('rocket-airframes.py')))
ACCENTS={'surveyor':(133,82,133),'courier':(78,121,80),'freighter':(37,125,134)}
SECOND={'surveyor':(186,140,75),'courier':(179,186,112),'freighter':(219,158,78)}
METALS={'surveyor':(184,184,179),'courier':(187,196,198),'freighter':(153,162,160)}


def mix(c,b,t):
    return tuple(round(a*(1-t)+z*t) for a,z in zip(c,b))


def shade(c,f):
    return tuple(min(250,max(0,round(x*f))) for x in c)


def tile(name,material,metal,accent):
    ink=(46,52,59);silver=(160,174,177);warm=(220,218,200);gold=SECOND[name]
    base={'skin':metal,'plate':mix(metal,silver,.35),'cream':warm,'enamel':accent,
          'stripe':accent,'graphite':(54,62,71),'ceramic':(89,90,88),
          'ribs':(103,113,118),'exhaust':(80,85,91),'throat':(36,35,40),
          'silver':silver,'sensor':(88,74,42),'glass':(55,100,125),
          'glass_edge':(59,71,78),'hatch':(120,132,137),'cargo':mix(metal,accent,.43),
          'latch':(109,124,125),'amber':gold,'mark':metal,'vents':ink,
          'foil':(182,148,92),'cap':silver,'heatshield':(79,76,75),'label':warm,
          'warning':gold,'port':(80,91,95),'spine':(118,131,138),'radiator':(95,110,111)}[material]
    im=Image.new('RGB',(16,16),base);d=ImageDraw.Draw(im)
    hi=mix(base,warm,.32);lo=shade(base,.78);deep=shade(base,.55)
    def rivets(points):
        for x,y in points:d.point((x,y),fill=deep);d.point((x,y-1),fill=hi)
    if material in ('skin','plate','cream','enamel'):
        d.line((0,0,15,0),fill=mix(base,warm,.23));d.line((15,0,15,15),fill=shade(base,.88))
        if material=='plate':
            d.line([(1,12),(4,12),(6,14),(14,14)],fill=lo)
            rivets([(2,3),(13,3)])
        elif material=='enamel':
            d.line((1,14,13,14),fill=shade(base,.89))
        else:
            d.line((2,15,14,15),fill=shade(base,.92))
    elif material=='stripe':
        d.rectangle((0,0,15,3),fill=shade(accent,.62));d.line((0,4,15,4),fill=mix(accent,warm,.36))
        d.rectangle((0,12,15,14),fill=warm);d.line((0,15,15,15),fill=lo)
    elif material in ('ribs','radiator','vents'):
        for y in range(1,16,4):
            d.rectangle((1,y,14,y+1),fill=deep);d.line((2,y+2,13,y+2),fill=hi)
        d.line((0,0,0,15),fill=hi);d.line((15,0,15,15),fill=lo)
    elif material in ('exhaust','throat','ceramic','heatshield'):
        for x in (3,9,14):d.line((x,1,x,15),fill=lo);d.line((x-1,1,x-1,14),fill=mix(base,hi,.38))
        if material=='throat':
            d.rectangle((0,0,15,8),fill=(35,32,38));d.line((0,9,15,9),fill=(77,61,57))
        if material=='heatshield':
            d.line((0,8,15,8),fill=deep);d.line((7,0,7,7),fill=deep)
    elif material in ('graphite','silver','cap'):
        d.line((0,0,15,0),fill=hi);d.line((15,0,15,15),fill=lo)
    elif material=='hatch':
        d.rounded_rectangle((1,0,14,15),radius=3,fill=deep)
        d.rounded_rectangle((2,1,13,14),radius=2,fill=hi)
        d.rounded_rectangle((3,2,12,13),radius=1,fill=base)
        d.rectangle((5,4,10,6),fill=(48,60,67));d.line((5,4,9,4),fill=(112,151,161))
        d.rectangle((9,9,12,10),fill=ink);d.point((9,9),fill=(222,186,111));d.line((5,12,7,12),fill=lo)
    elif material=='cargo':
        d.rectangle((1,0,14,15),outline=lo)
        for x in (4,8,12):
            d.line((x,3,x,12),fill=shade(base,.71));d.line((x+1,3,x+1,11),fill=hi)
        rivets([(2,2),(13,2),(2,14),(13,14)])
    elif material=='latch':
        d.rectangle((1,3,14,12),fill=ink);d.rectangle((3,2,12,11),fill=hi)
        d.rectangle((4,4,11,9),fill=accent);d.rectangle((6,6,9,12),fill=gold)
    elif material=='glass':
        d.rectangle((0,0,15,15),fill=(37,67,86));d.polygon([(0,0),(15,0),(15,5),(4,14),(0,14)],fill=(66,116,143))
        d.polygon([(0,0),(9,0),(0,9)],fill=(117,169,183));d.line((2,0,13,0),fill=(178,207,208))
        d.line((2,15,14,15),fill=(44,79,96))
    elif material=='glass_edge':
        d.rectangle((0,0,15,15),outline=ink);d.line((0,0,14,0),fill=silver)
    elif material=='sensor':
        d.ellipse((1,1,14,14),fill=(75,71,62),outline=gold)
        d.ellipse((4,4,11,11),fill=(42,65,74));d.ellipse((5,4,9,8),fill=(102,164,174));d.point((6,5),fill=warm)
    elif material=='foil':
        d.line([(1,1),(5,6),(2,9),(8,13)],fill=hi);d.line([(12,0),(10,7),(14,13)],fill=lo)
    elif material=='mark':
        d.rectangle((1,1,14,14),fill=shade(accent,.70))
        d.line((2,2,13,2),fill=mix(accent,warm,.45));d.line((2,13,13,13),fill=gold)
        strokes={'surveyor':[(4,5,7,10),(7,10,10,5)],
                 'courier':[(3,5,5,10),(5,10,8,5),(11,5,11,10)],
                 'freighter':[(2,5,4,10),(4,10,7,5),(9,5,9,10),(12,5,12,10)]}
        for line in strokes[name]:d.line(line,fill=warm)
    elif material=='spine':
        d.line((3,0,3,15),fill=hi);d.line((11,0,11,15),fill=deep)
        for y in (3,11):d.rectangle((0,y,15,y+2),fill=lo);d.line((0,y,15,y),fill=hi)
    return im


def icon(name,metal,accent):
    im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im);ink=(43,49,55);light=mix(metal,(249,244,221),.64)
    # Pixel silhouettes follow the three meshes, including the split transfer tanks and UV freight pods.
    d.polygon([(7,0),(8,0),(8,2),(10,5),(10,12),(9,13),(6,13),(5,12),(5,6),(6,3)],fill=ink)
    d.polygon([(7,2),(8,3),(9,5),(9,11),(6,11),(6,6)],fill=metal)
    d.line((7,3,7,5),fill=light);d.rectangle((6,5,9,6),fill=(53,85,100));d.line((6,5,8,5),fill=(124,178,190))
    d.rectangle((6,8,9,8),fill=accent);d.rectangle((6,12,9,13),fill=(76,82,88));d.line((6,14,9,14),fill=(55,60,66))
    if name=='surveyor':
        for x,sgn in ((5,-1),(10,1)):
            d.polygon([(x,8),(x,13),(x+sgn*3,14),(x+sgn*2,11)],fill=ink)
            d.line((x,9,x+sgn*2,12),fill=accent)
        d.point((5,7),fill=SECOND[name]);d.point((7,1),fill=light)
    elif name=='courier':
        for x,sgn in ((4,-1),(11,1)):
            d.polygon([(x,3),(x+sgn,5),(x+sgn,10),(x+sgn*3,13),(x,14),(x-sgn,12),(x-sgn,7)],fill=ink)
            d.line((x,5,x,11),fill=light);d.line((x,8,x,10),fill=accent);d.point((x,12),fill=metal)
    else:
        d.line((6,3,9,3),fill=metal)
        for x,sgn in ((4,-1),(11,1)):
            d.rectangle((min(x,x+sgn),6,max(x,x+sgn),12),fill=ink)
            d.line((x,6,x,10),fill=accent);d.point((x,7),fill=SECOND[name])
            d.polygon([(x,10),(x+sgn*2,9),(x+sgn*3,12),(x+sgn*2,15),(x,14)],fill=ink)
            d.line((x+sgn*2,10,x+sgn*2,13),fill=metal);d.point((x+sgn*2,12),fill=accent)
    return im


def paint(name,rel,src,texture,ref):
    native=texture(ref)
    samples=sorted((p[:3] for p in native.get_flattened_data() if p[3]),key=sum)
    metal=mix(METALS[name],samples[len(samples)*7//10],.11)
    if '/item/' in rel:return icon(name,metal,ACCENTS[name])
    im=Image.new('RGBA',(160,160),(59,65,69,255))
    for i,mat in enumerate(AIRFRAMES['MATERIALS']):
        im.paste(tile(name,mat,metal,ACCENTS[name]),(16*(i%10),16*(i//10)))
    return im
