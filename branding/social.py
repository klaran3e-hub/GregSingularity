from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps
p=Path(__file__).resolve().parent
im=ImageOps.fit(Image.open(p/'source/hero.png').convert('RGB'),(1280,640),method=Image.Resampling.LANCZOS,centering=(.6,.38)).convert('RGBA')
over=Image.new('RGBA',im.size);d=ImageDraw.Draw(over)
for x in range(840):d.line((x,0,x,640),fill=(6,16,20,int(222*(1-x/840)**.8)))
title=ImageFont.truetype(str(p/'fonts/Oxanium.ttf'),92);title.set_variation_by_axes([680])
small=ImageFont.truetype(str(p/'fonts/BarlowCondensed-Medium.ttf'),33)
d.rectangle((53,162,131,167),fill='#e4995b')
d.text((46,192),'Greg',font=title,fill='#faf0de')
d.text((45,283),'Singularity',font=title,fill='#ffac64')
d.text((53,437),'Expert GregTech progression',font=small,fill='#f2efe0')
d.text((53,481),'Minecraft 1.20.1  /  Forge',font=small,fill='#c4d4d0')
Image.alpha_composite(im,over).convert('RGB').save(p/'public/github-social.jpg',quality=91,optimize=True)
