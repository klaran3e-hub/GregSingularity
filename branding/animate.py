"""Render the nine seamless GregSingularity page banners from the original illustrations."""
from pathlib import Path
from math import cos, sin, tau, pi, exp
from random import Random
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / 'public'
W, H, LEFT = 800, 300, 270
SCENE = W - LEFT
FRAMES, DELAY = 100, 40
BANNERS = [
 ('cover','hero','Greg','Singularity','From the first bloomery','to a space-fed factory.','orbit'),
 ('workshop','workshop','THE FIRST','BRONZE','Wash the ore. Fire the mould.','Cast your first alloy.','furnace'),
 ('automation','automation','FLUID','AUTOMATION','Connect your refinery to AE2.','Keep every reactor supplied.','circuit'),
 ('space','space','OFF-WORLD','INDUSTRY','Three rocket tiers. Three fuels.','Eight planetary ore lines.','launch'),
 ('community','community','FACTORY','COMMS','Talk builds, report bugs and','share your factory on Discord.','radio'),
 ('core-cover','core','GregSingularity','Core','The materials, machines and','spacecraft behind the pack.','processor'),
 ('core-tools','workshop','MATERIALS','& TOOLING','Cut, crush and wash by hand.','Put GregTech tools to work.','workbench'),
 ('core-space','space','FLIGHT','SYSTEMS','Pilot Tier V, VI and VII','to Ceres, Europa and Titan.','telemetry'),
 ('core-install','community','CORE','INSTALLATION','One Forge JAR for the client','and the dedicated server.','boot')
]

def titlefont(size, width, text):
    while size >= 24:
        font = ImageFont.truetype(str(ROOT/'fonts/Oxanium.ttf'),size)
        font.set_variation_by_axes([680])
        if font.getlength(text) <= width: return font
        size-=1
    return font

def compose(spec):
    name, source, top, bottom, sub1, sub2, effect = spec
    im = Image.open(ROOT/'source'/(source+'.png')).convert('RGB')
    if source=='core':
        photo=Image.new('RGB',(SCENE,H),(5,14,17))
        cut=ImageOps.fit(im,(338,338),method=Image.Resampling.LANCZOS)
        photo.paste(cut,((SCENE-338)//2,-19))
    else:
        photo=ImageOps.fit(im,(SCENE,H),method=Image.Resampling.LANCZOS)
    image=Image.new('RGB',(W,H),(8,18,22));image.paste(photo,(LEFT,0))
    pix=np.asarray(image).astype(np.float32)
    y,x=np.mgrid[0:H,0:W];u=(x-LEFT)/SCENE;v=y/H
    tint=np.zeros((H,W),dtype=np.float32)
    if effect in ['furnace','workbench','launch','orbit','processor','telemetry']:
        cx,cy={'furnace':(.77,.55),'workbench':(.75,.65),'launch':(.764,.765),'telemetry':(.765,.765),'orbit':(.85,.1),'processor':(.50,.49)}[effect]
        tint=np.exp(-((u-cx)/.12)**2-((v-cy)/.17)**2)*np.clip((pix[:,:,0]-pix[:,:,2]-14)/70,0,1)
    elif effect in ['circuit','boot','radio']:
        cx,cy=(.78,.38) if effect=='circuit' else (.80,.25)
        tint=np.exp(-((u-cx)/.20)**2-((v-cy)/.20)**2)*np.clip((pix[:,:,2]+pix[:,:,1]-pix[:,:,0]*1.3)/125,0,1)
    meta=Image.new('RGBA',(W,H));draw=ImageDraw.Draw(meta)
    for xx in range(LEFT,LEFT+132):
        a=int(249*(1-(xx-LEFT)/132)**1.32)
        draw.line((xx,0,xx,H),fill=(8,18,22,a))
    # The figures are composed by active process; the headline stays stable throughout.
    draw.line((17,21,61,21),fill=(203,129,69,230),width=2)
    aFont=titlefont(42 if source!='core' else 40,335,top)
    bFont=titlefont(56,350,bottom)
    sub=ImageFont.truetype(str(ROOT/'fonts/BarlowCondensed-Medium.ttf'),22)
    draw.text((28,57),top,font=aFont,fill='#F1F2E8',stroke_width=1,stroke_fill='#131D1E')
    draw.text((27,102),bottom,font=bFont,fill='#FFAC64',stroke_width=1,stroke_fill='#34241E')
    draw.rectangle((31,177,88,179),fill='#D48042')
    draw.text((30,193),sub1,font=sub,fill='#D4DEDA')
    draw.text((30,218),sub2,font=sub,fill='#D4DEDA')
    draw.rectangle((0,0,W-1,H-1),outline=(150,103,61,220),width=1)
    for xx,dy in [(1,1),(W-2,-1)]:
        draw.line((xx,2,xx+dy*13,2),fill=(219,142,77),width=1)
    def xy(a,b):return ((LEFT+SCENE*a)*2,H*b*2)
    rng=Random(196)
    sparks=[(rng.random(),rng.uniform(-.12,.10),rng.uniform(.09,.32)) for _ in range(24)]
    def drawframe(i):
        t=i/FRAMES;wave=sin(tau*t)
        delta=(.11*wave+.035*sin(tau*3*t))*tint[:,:,None]
        visible=Image.fromarray(np.clip(pix*(1+delta),0,255).astype('uint8')).convert('RGBA')
        high=Image.new('RGBA',(W*2,H*2));p=ImageDraw.Draw(high)
        def line(pts,color,width=1):p.line([xy(xx,yy) for xx,yy in pts],fill=color,width=max(1,round(2*width)),joint='curve')
        def dot(xx,yy,r,col):
            a,b=xy(xx,yy);p.ellipse((a-r*2,b-r*2,a+r*2,b+r*2),fill=col)
        if effect in ('furnace','workbench'):
            origin=(.767,.548) if effect=='furnace' else (.744,.635)
            for phase,wind,rise in sparks:
                z=(t+phase)%1;alpha=round(185*sin(pi*z)**1.6);xx=origin[0]+wind*z+.008*sin(2*pi*z+phase*tau);yy=origin[1]-rise*z
                line([(xx,yy),(xx+.0018,yy+.006*(1-z))],(255,178,89,alpha),1.1)
            # Two thin trails of heat above the actual fire mouth.
            for band in range(2):
                pts=[(origin[0]+.009*sin(j*.25-t*tau+band*.9)+band*.009,origin[1]-.07-j*.009) for j in range(17)]
                line(pts,(249,174,116,23),1.7)
            if effect=='workbench':
                z=(1-cos(t*tau))/2;line([(.683,.705),(.709+.014*z,.738)],(255,187,98,80),1.3)
        elif effect in ('launch','telemetry'):
            for phase,wind,rise in sparks[:16]:
                z=(t*2+phase)%1;xx=.765+wind*.28*z;yy=.762+rise*.38*z
                dot(xx,yy,1.25-z*.55,(255,174,75,round(127*sin(pi*z))))
            for q in range(4):
                z=(t+q/4)%1;pts=[(.765+(.013+.04*z)*cos(a),.811+z*.024+(.002+.005*z)*sin(a)) for a in np.linspace(0,tau,35)]
                line(pts,(245,171,100,round(58*(1-z))),.65)
            if effect=='telemetry':
                pts=[(.42+.41*z,.46-.27*sin(z*pi)-.13*z) for z in np.linspace(0,1,65)]
                line(pts,(99,218,210,84),.8);z=t;dot(.42+.41*z,.46-.27*sin(z*pi)-.13*z,2.5,(155,250,232,round(215*sin(pi*z)**.5)))
        elif effect in ('orbit','processor'):
            cx,cy=(.856,.096) if effect=='orbit' else (.504,.494)
            rx,ry=(.135,.038) if effect=='orbit' else (.095,.022)
            for offset in (0,.51):
                for i2 in range(20):
                    a=t*tau+offset*tau-i2*.026
                    xx=cx+rx*cos(a);yy=cy+ry*sin(a)-(.48 if effect=='orbit' else .18)*(xx-cx)
                    dot(xx,yy,.9+(20-i2)*.038,(255,183+int(40*(1-i2/20)),110,round(154*(1-i2/20)**1.4)))
            if effect=='processor':
                for i2 in range(5):
                    z=(t+i2*.2)%1;dot(.398+.034*i2,.753,1.6,(81,236,212,round(180*sin(pi*z)**4)))
        elif effect=='circuit':
            path=[(.555,.70),(.655,.70),(.655,.53),(.715,.53),(.715,.39),(.775,.39)]
            line(path,(57,192,187,35),1.1)
            pts=np.array(path);length=np.linalg.norm(np.diff(pts,axis=0),axis=1);cum=np.concatenate(([0],np.cumsum(length)))
            for offset in [0,.53]:
                for j in range(13):
                    f=((t+offset-j*.004)%1)*cum[-1];ind=min(len(length)-1,max(0,int(np.searchsorted(cum,f,side='right')-1)));pos=pts[ind]+(pts[ind+1]-pts[ind])*(f-cum[ind])/length[ind];dot(*pos,1.8,(97,245,221,round(170*(1-j/13))))
            yy=.292+(1-cos(t*tau))*.072;line([(.745,yy),(.806,yy-.012)],(104,255,220,99),.8)
        else:
            for k in range(3):
                z=(t+k/3)%1;a=round(78*sin(pi*z)**1.3)
                pts=[(.851+(.025+.071*z)*cos(n),.175+(.041+.131*z)*sin(n)) for n in np.linspace(3.28,4.96,28)]
                line(pts,(112,219,218,a),1)
            if effect=='boot':
                pts=[(.40+i*.015,.74+.010*sin(i*1.3+t*tau)) for i in range(18)]
                line(pts,(106,244,207,95),1)
        fx=high.resize((W,H),Image.Resampling.LANCZOS)
        visible=Image.alpha_composite(visible,fx)
        return Image.alpha_composite(visible,meta).convert('RGB')
    first=drawframe(0);first.save(PUBLIC/(name+'.jpg'),quality=92,optimize=True)
    palette=first.quantize(colors=238)
    frames=[(first if i==0 else drawframe(i)).quantize(palette=palette,dither=Image.Dither.NONE) for i in range(FRAMES)]
    dest=PUBLIC/(name+'.gif')
    frames[0].save(dest,save_all=True,append_images=frames[1:],duration=DELAY,loop=0,disposal=1,optimize=True)
    with Image.open(dest) as chk:
        assert chk.size==(W,H) and chk.n_frames==FRAMES and chk.info['loop']==0
    print(name,FRAMES,DELAY,dest.stat().st_size,flush=True)

if __name__=='__main__':
    with ThreadPoolExecutor(max_workers=3) as executor:list(executor.map(compose,BANNERS))
