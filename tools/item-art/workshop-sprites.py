"""Fieldwork items with a physical shape beyond a standard GT material form."""
from PIL import Image, ImageDraw

def workshop(kind,name,texture,rgb):
    metal='item/ram_chip';brick='item/coke_oven_brick';wood='block/treated_wood_planks';flint='item/material_sets/flint/gem'
    ore='item/material_sets/dull/crushed';refs=[metal]
    im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im)
    ink=(36,38,39);shadow=(66,73,76);steel=(148,161,166);silver=(204,214,210)
    def tone(c,f):return tuple(max(0,min(255,round(v*f))) for v in c)
    def line(points,color):d.line(points,fill=color)
    def polygon(points,fill):d.polygon(points,fill=fill)
    light,mid,dark=tone(rgb,1.15),tone(rgb,.85),tone(rgb,.5)
    if kind in ('pot','charge'):
        refs=[brick,'block/casings/solid/machine_primitive_bricks']+([ore] if kind=='charge' else [])
        clay=(144,110,91) if name=='unfired_crucible' else (151,85,62)
        pottery=Image.new('RGBA',(16,16));shell=ImageDraw.Draw(pottery)
        shell.polygon([(2,3),(13,3),(14,4),(13,9),(11,13),(9,14),(6,14),(4,12),(2,8),(1,5)],fill=(57,42,37))
        shell.polygon([(2,5),(13,5),(12,9),(10,12),(9,13),(6,13),(4,10)],fill=tone(clay,.88))
        shell.line([(3,6),(4,9),(6,12)],fill=tone(clay,1.27));shell.line([(12,6),(11,10),(9,12)],fill=tone(clay,.65))
        shell.polygon([(5,7),(9,7),(8,9),(6,10),(5,9)],fill=tone(clay,1.02))
        shell.line([(10,7),(11,7),(10,10),(9,11)],fill=tone(clay,.78));shell.line([(6,12),(8,12)],fill=tone(clay,.97))
        shell.polygon([(2,4),(4,2),(11,2),(13,3),(14,4),(13,6),(4,6)],fill=tone(clay,1.22))
        shell.polygon([(3,4),(5,3),(10,3),(12,4),(11,5),(4,5)],fill=(67,48,41))
        shell.line([(3,4),(5,2),(8,2)],fill=tone(clay,1.47));shell.line([(4,6),(10,6)],fill=tone(clay,1.09))
        if kind=='charge':
            # Separate pieces of feed are visible inside the rim. The body has the same clay in all five materials.
            for x,y,k in ((4,4,.81),(5,3,1.04),(6,4,.69),(7,4,1.13),(8,3,.81),(9,3,1.18),(10,4,.73),(11,4,.96)):
                shell.point((x,y),fill=tone(rgb,k))
        return pottery,refs
    if kind=='tuyere' or kind=='waveguide':
        refs=['item/glass_tube',brick] if kind=='tuyere' else ['item/glass_tube','item/blue_glass_lens']
        polygon([(1,10),(3,8),(9,3),(12,2),(14,4),(14,6),(7,12),(4,14),(2,13)],ink)
        polygon([(2,10),(4,8),(11,3),(13,4),(11,6),(5,12),(3,12)],mid)
        line([(2,10),(4,9),(11,4)],light);line([(4,13),(7,10),(13,5)],dark)
        if kind=='tuyere':
            polygon([(9,4),(11,2),(13,2),(15,4),(14,6),(12,7),(10,6)],dark)
            polygon([(10,4),(12,3),(14,4),(13,5),(12,6)],light)
            line([(12,4),(13,4),(12,5)],ink)
        elif name=='luv_polished_waveguide':
            line([(5,9),(11,4)],silver);line([(6,10),(12,5)],(116,178,203))
    elif kind=='hinge':
        refs=['item/material_sets/dull/plate','item/material_sets/dull/rod']
        polygon([(1,6),(5,3),(8,4),(8,12),(4,13),(1,12)],shadow)
        polygon([(8,4),(12,3),(14,5),(14,11),(10,13),(8,12)],mid)
        line([(2,6),(5,4),(7,5)],silver);line([(9,5),(12,4),(13,5)],light)
        for yy in (4,7,10):d.rectangle((6,yy,8,yy+1),fill=steel);d.point((6,yy),fill=silver)
        for x,y in ((3,7),(4,10),(11,6),(12,9)):d.point((x,y),fill=ink)
    elif kind in ('teeth','saw','blade'):
        refs=['item/tools/knife','item/material_sets/dull/tool_head_buzz_saw']
        if kind=='teeth':
            for x,y in ((5,1),(1,8),(9,8)):
                polygon([(x,y+5),(x+3,y),(x+5,y+4),(x+5,y+6),(x,y+6)],ink)
                polygon([(x+1,y+4),(x+3,y+1),(x+4,y+4),(x+4,y+5),(x+1,y+5)],steel)
                line([(x+1,y+4),(x+3,y+1)],silver);d.point((x+3,y+4),fill=shadow)
        else:
            polygon([(1,11),(3,7),(12,3),(15,3),(14,5),(5,12),(3,13)],ink)
            polygon([(2,10),(4,7),(12,4),(14,4),(5,11)],steel if kind=='saw' else mid)
            line([(3,9),(6,7),(12,4)],silver if kind=='saw' else light)
            if kind=='saw':
                for x,y in ((4,11),(6,10),(8,9),(10,7),(12,6)):d.point((x,y+1),fill=shadow)
            else:line([(3,12),(11,6)],light)
    elif kind=='wheel':
        refs=['block/stones/black_granite/stone','item/material_sets/dull/gear']
        d.ellipse((1,3,14,14),fill=ink);d.ellipse((1,2,14,12),fill=dark)
        d.ellipse((2,2,13,11),fill=mid);d.arc((2,2,13,11),175,295,fill=light)
        for xy in [[(3,6),(5,6)],[(8,3),(8,5)],[(9,8),(11,9)],[(4,9),(6,8)]]:line(xy,dark)
        d.rectangle((6,6,8,7),fill=ink);d.point((8,7),fill=light)
    elif kind=='grate':
        refs=['block/stones/basalt/stone','item/carbon_fiber_mesh']
        for x in (2,5,8,11):
            line([(x,12),(x+2,3)],shadow);line([(x+1,12),(x+3,3)],steel)
        line([(1,12),(11,14),(13,12)],dark);line([(2,11),(12,13)],mid);line([(4,3),(14,4)],light)
    elif kind=='charge_tray':
        refs=['item/material_sets/dull/plate','item/fluid_filter']
        d.ellipse((1,4,14,12),fill=dark);d.ellipse((1,3,14,10),fill=light);d.ellipse((3,4,12,8),fill=mid)
        for point in ((4,6),(7,5),(9,7),(11,6),(6,8)):d.point(point,fill=dark)
    elif kind=='barbus':
        refs=['item/copper_credit','item/material_sets/dull/plate_double'];polygon([(1,10),(10,3),(14,3),(15,5),(5,13),(2,13)],dark)
        polygon([(1,10),(11,3),(14,4),(4,12)],mid);line([(2,10),(11,4)],light)
        for x,y in ((4,10),(11,5)):d.point((x,y),fill=ink)
    elif kind=='solder_iron':
        refs=['item/tools/handle_screwdriver','item/copper_credit']
        line([(2,13),(1,14),(1,15)],ink);polygon([(2,11),(5,7),(7,7),(8,9),(5,13),(3,13)],dark)
        line([(3,11),(6,8)],light);line([(6,9),(8,7)],steel);line([(8,7),(11,4)],(174,109,65))
        line([(9,7),(12,4)],(230,172,101));line([(12,4),(14,2)],silver)
    elif kind=='fibre':
        refs=['item/bio_chaff','item/carbon_fibers']
        for pts,clr in [([(2,13),(6,10),(9,6),(12,3)],dark),([(3,13),(6,9),(9,5),(10,2)],mid),([(4,14),(7,10),(10,7),(14,5)],light),([(4,12),(5,8),(8,4),(8,2)],mid),([(2,12),(3,7),(6,5)],light)]:
            line(pts,clr)
        if name in ('retting_bundle','retted_bundle'):line([(4,8),(7,11)],dark);line([(4,7),(8,10)],light)
    elif kind=='clay_lump':
        refs=['item/sticky_resin',brick]
        polygon([(1,11),(3,8),(5,8),(7,5),(10,4),(12,6),(13,9),(15,11),(14,13),(3,13)],dark)
        polygon([(2,11),(4,9),(6,9),(8,6),(10,5),(12,7),(12,10),(14,11),(10,12),(4,12)],mid)
        line([(5,9),(7,8),(9,6)],light);line([(8,10),(10,9)],light)
    elif kind=='mould':
        refs=['item/ingot_casting_mold',brick]
        polygon([(1,9),(8,3),(13,3),(15,6),(9,12),(4,14),(1,12)],dark)
        polygon([(2,9),(9,4),(12,4),(14,6),(8,11),(4,12)],light)
        polygon([(4,9),(9,5),(11,5),(12,6),(7,10),(5,10)],dark);line([(5,9),(9,6),(11,6)],mid)
    elif kind=='plate_stack':
        refs=['item/epoxy_circuit_board','item/material_sets/dull/plate']
        for y in (4,2,0):
            polygon([(2,8+y),(8,3+y),(13,3+y),(14,5+y),(8,10+y),(3,10+y)],dark)
            polygon([(3,8+y),(9,4+y),(12,4+y),(13,5+y),(7,9+y)],mid)
        line([(4,7),(9,4),(12,4)],light)
    else:raise ValueError(kind)
    return im,refs
