"""Original 16px silhouettes for hardware without an exact GregTech material model.
Each color is sampled from the indicated GT part. Coordinates are integer texels.
"""
from PIL import Image, ImageDraw

def hardware(name, texture, rgb, item):
    def colors(*sources):
        return sorted({c[:3] for src in sources for c in texture(src).crop((0,0,16,16)).get_flattened_data() if c[3]>=160})
    def near(palette, target):
        return min(palette,key=lambda c:sum(k*(a-b)**2 for k,a,b in zip((2,3,1),c,target)))
    def grad(c,f):return tuple(min(255,max(0,round(x*f))) for x in c)
    def pxmask(rows, pal):
        img=Image.new('RGBA',(16,16))
        for y,row in enumerate(rows):
            if len(row)>16:raise ValueError((name,y,row))
            for x,key in enumerate(row):
                if key!='.':img.putpixel((x,y),(*pal[key],255))
        return img
    board=['item/basic_integrated_circuit','item/ram_chip','item/qbit_cpu_chip','item/data_stick','item/gold_credit','item/fiber_reinforced_printed_circuit_board','item/quantum_processor_assembly']
    if name in ('memory_module','clock_board','power_backplane'):
        ink=colors(*board);solder=colors('item/basic_integrated_circuit','item/data_stick','item/quantum_processor_assembly')
        greys=colors('item/ram_chip','item/advanced_integrated_circuit','item/machine_memory_card')
        edge=colors('item/gold_credit','item/qbit_cpu_chip','item/epoxy_printed_circuit_board')
        pal={'o':near(ink,(23,39,35)),'d':near(solder,(39,79,53)),'g':near(solder,(46,116,68)),
             'h':near(solder,(112,163,102)),'c':near(greys,(93,101,103)),'b':near(greys,(44,49,54)),
             'k':near(greys,(29,31,34)),'s':near(greys,(188,193,185)),'f':near(edge,(212,160,61)),
             'e':near(edge,(147,103,44)),'v':near(edge,(237,208,128))}
        # The keyed edge, pin rows and two storage packages stay legible at native size.
        # The green board uses GregTech mask colors toned down against the graphite chip cases.
        pal['d']=(40,68,53);pal['g']=(53,100,72);pal['h']=(99,142,100)
        pal['a']=pal['f'];pal['t']=(146,158,106);pal['c']=(99,108,107);pal['b']=(49,56,59);pal['k']=(29,36,39)
        rows=['','','','.oooooooooooooo.','ohhghthhgghhhggo','ogsssgtgsssghago',
              'ogcbkcgocbkcgkdo','ogbbkkgobbkkgcdo','ogkkkkgokkkkgsdo','odsssgtgsssgdgdo',
              'oghgggddgghhggdo','.fvfvf..fvfvfvf.','.eeeee..eeeeeee.','','','']
        im=pxmask(rows,pal);d=ImageDraw.Draw(im)
        if name=='clock_board':
            d.rectangle((7,5,10,8),fill=pal['s']);d.rectangle((8,6,9,7),fill=pal['c'])
        if name=='power_backplane':
            for x in (2,5,8,11):d.rectangle((x,5,x+1,9),fill=pal['c']);d.point((x,5),fill=pal['f'])
        return im,board
    refs={'heat_sink':['block/overlay/machine/hpca/heat_sink','item/cupronickel_credit'],
          'sample_vial':['item/glass_tube','item/empty_spray_can'],
          'document':['item/clipboard/clipboard','item/data_stick'],
          'crate':['block/treated_wood_planks','block/casings/steam/bricked_bronze/side'],
          'frame':['item/empty_wooden_form','block/casings/steam/bricked_steel/side'],
          'terminal':['item/hv_conveyor_module','item/gold_credit'],
          'wire_harness':['item/lv_electric_motor','item/copper_credit'],
          'rail':['item/material_sets/dull/rod_long','item/ram_chip'],
          'manifold':['item/lv_fluid_regulator','item/copper_credit'],
          'bellows':['block/treated_wood_planks','item/duct_tape'],
          'fire_drill':['block/treated_wood_planks','item/tools/handle'],
          'tube_bank':['item/glass_tube','item/copper_credit'],
          'screen':['item/portable_scanner','item/machine_memory_card'],
          'folded_filter':['item/fluid_filter','item/carbon_fiber_mesh'],
          'cassette':['item/machine_memory_card','block/overlay/machine/hpca/heat_sink'],
          'cask':['item/empty_spray_can','item/cupronickel_credit']}
    if name not in refs:raise ValueError(name)
    sources=refs[name];palette=colors(*sources)
    metal=colors('item/ram_chip','block/overlay/machine/hpca/heat_sink','item/empty_spray_can')
    # Use the material dye for the working face, keep steel hardware and gold contacts distinct.
    p={'o':near(metal,(31,36,40)),'s':near(metal,(83,94,101)),'m':near(metal,(146,159,161)),
       'l':near(metal,(212,221,215)),'b':grad(rgb,.40),'d':grad(rgb,.63),'g':grad(rgb,.84),
       'h':grad(rgb,1.09),'a':near(colors('item/gold_credit'),(216,165,74)),'w':(223,214,182)}
    xt={
     'heat_sink':['','','....oosoosooso..','...olmolmolmolo.','..olmslmslmslmo.','..omdsmdsmdsmso.',
       '..omdsmdsmdsmso.','..omdsmdsmdsmso.','..omdsmdsmdsmso.','..omdsmdsmdsmso.','..omdsmdsmdsmso.','..omssmssmssmso.','..oggggggggggdo.','...obbbbbbbbbo..','',''],
     'sample_vial':['','......oooo......','......slls......','......oss o.....'.replace(' ',''),'......o..o......',
       '.....ol..mo.....','.....ol..mo.....','.....olhhmo.....','.....olgdmo.....','.....olgdmo.....','.....olgdmo.....','.....olgdmo.....','.....olgdmo.....','......ommo......','',''],
     'document':['','....ooooooo.....','...olaaaalmo....','...omsss smmo....'.replace(' ',''),'...olwwwwwwmo...','...olwwbdbwmo...',
       '...olwwwwwwmo...','...olwbbbwwmo...','...olwwwwwwmo...','...olwbbdbwmo...','...olwwwwwwmo...','...olwwgggwmo...','...olwwgggwmo...','...ommmmmmmmo...','....oooooooo....',''],
     'crate':['','','...oooooooooo...','..ohgggggggggo..','..ogdddddddddgo.','..oghhgggghhdoo.',
       '..ogdhggghdhdbo.','..ogddhghddhdbo.','..oghddhdddhdbo.','..oghdhghddhdbo.','..oghgggghhhdbo.','..ogdddddddddbo.',
       '..oggggggggggoo.','...oooooooooo...','',''],
     'frame':['','','...oooooooooo...','..omhhhhhhhhlgo.','..ogoo.....oggo.','..ogo......oggo.',
       '..ogo......oggo.','..ogo......oggo.','..ogo......oggo.','..ogo......oggo.','..ogo......oggo.',
       '..ogoo.....oggo.','..oggggggggggbo.','...ooooooooooo..','',''],
     'terminal':['','','','.oooooooooooooo.','.ommmmmmmmmmmmo.','.ollsolsolsolmo.','.olsoolsoolsomo.','.osssosssosssso.',
       '.ogggggggggggdo.','.oghgghgghgghdo.','.obbbdbbdbbdbbo.','..oaao.oaao.oaao','..ooo..ooo..ooo.','','',''],
     'wire_harness':['','','..omo.....omo...','..oao.....oao...','...gho...ohg....','...odho.ohgo....','....oghohgo.....',
       '.....ohhgo......','......ommo......','......osso......','......oggo......','......ohgo......','......omaso.....','......oaaao.....','',''],
     'rail':['','','...........osmo.','.........osmlmo.','.......osmlmsoo.','.....osmlmsoo...','...osmlmsoo.....',
       '.osmlmsoo..ooo..','.olmsso..osmo...','..osso.osmso....','..oososmso......','.oosmlso........','.omlso..........','..oo............','',''],
     'manifold':['','','....oo..oo..oo..','...osmoosmoosmo.','...ohhooghoogho.','....og..og..og..','..oolhhhhhhhhhoo',
       '.ommgdggdggdggmo','.ossdbbbdbbdbbso','..oooodooodoooo.','.....ogo.ogo....','....ommoommo....','....ossoosso....','','',''],
     'bellows':['','','.......ooo......','......ohhdo.....','.....ohggddo....','....ohgdddbdo...',
       '...ohggddbbddo..','..ohggddddbbddo.','..obgddddddbbbo.','...obbbbbbgggo..',
       '....omsssmsso...','.....oagaaao....','......oagoo.....','.......oao......','........o.......',''],
     'fire_drill':['','','........ho......','......ohdo......','.....ohdo.......','....ogdo........','...ogdo...oo....',
       '...odo...ogdo...','....o...ogdo....','.......ogdo.....','......ogdo......','...ooogdoooo....','..ohgghggggggo..','..obbbbbbbbbbo..','',''],
     'tube_bank':['','','.....ooooooo....','...oolmolmolmoo.','..olmsohsohsohmo','..omdsgdsgdsgdmo',
       '..omdsgdsgdsgdmo','..omdsgdsgdsgdmo','..omdsgdsgdsgdmo','..omdsgdsgdsgdmo','..omdsgdsgdsgdmo','..omssssssssssmo',
       '...osmmmmmmmmso.','....oooooooooo..','',''],
     'screen':['','','..oooooooooooo..','.omllllllllllmo.','.olsbbbbbbbbsmo.','.olsdgggggggsmo.',
       '.olsghhggdhgsmo.','.olsghdghdhgsmo.','.olsghghgdhgsmo.','.olsghgdghhgsmo.','.olsdgggggggsmo.',
       '.omssssssssssmo.','..ooooossooooo..','.....ommmmo.....','',''],
     'folded_filter':['','','...oooooooooo...','..omllllllllmo..','..olhghghghgmo..','..olgdgdgdgdmo..',
       '..olhghghghgmo..','..olgdgdgdgdmo..','..olhghghghgmo..','..olgdgdgdgdmo..','..olhghghghgmo..',
       '..omssssssssmo..','...oooooooooo...','','',''],
     'cassette':['','','...oooooooooo...','..omllllllllmo..','..olsbbbbbbgmo..','..olbmmsmmsbmo..','..olbmmsmmsbmo..',
       '..olbssssssbmo..','..olbmmsmmsbmo..','..olbmmsmmsbmo..','..olsbbbbbbgmo..','..omssssssssmo..','...oaaaooaaao...','','',''],
     'cask':['','','.....ooo oo.....'.replace(' ',''),'....ommmmmo.....','...ollllllmo....','...ohgggggdo....',
       '...ommmmm mmo....'.replace(' ',''),'...ogggddgdo....','...ogggddgdo....','...ogggddgdo....','...ommmmm mmo....'.replace(' ',''),
       '...ogggdddbo....','...ossssssso....','....ooooooo.....','','']}
    im=pxmask(xt[name],p);d=ImageDraw.Draw(im)
    if name=='rail':
        # Drawer slides have a telescoping inner member. Full railway sections have an I flange.
        if item in ('drawer_slide','drawer_runner_blank'):
            im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im)
            d.polygon([(1,11),(11,3),(14,3),(14,6),(4,14),(1,14)],fill=p['s'])
            d.line((1,11,11,3),fill=p['l']);d.line((3,12,13,4),fill=p['m'])
            if item=='drawer_slide':
                d.line((5,11,15,3),fill=p['o']);d.line((5,10,15,2),fill=p['l'])
                for x,y in ((4,11),(10,6)):d.point((x,y),fill=p['o'])
        elif item=='rail_profile_blank':
            d.line((2,11,12,3),fill=p['b']);d.line((4,12,13,5),fill=p['d'])
        elif item=='iv_indexed_rail':
            for x,y in ((4,9),(7,7),(10,5),(13,3)):d.point((x,y),fill=p['a'])
    if name=='crate' and item in ('received_refractory_crate','sealed_refractory_crate'):
        for x in (4,11):d.line((x,4,x,12),fill=p['s']);d.point((x,5),fill=p['l'])
        if item.startswith('sealed'):d.rectangle((7,7,8,8),fill=p['a'])
        else:d.rectangle((6,6,9,8),fill=p['w']);d.line((7,7,8,7),fill=p['s'])
    if name=='document':
        marks={'black_start':[(8,6),(7,7),(8,7),(7,8)],'outage':[(6,6),(8,6),(7,7),(6,8),(8,8)],
               'concurrent':[(6,6),(7,6),(8,6),(6,8),(7,8),(8,8)],'shift':[(6,6),(6,7),(6,8),(7,8),(8,8)],
               'ignition':[(7,6),(7,7),(8,7),(6,8),(8,8)],'commissioning':[(6,7),(7,8),(8,7),(9,6)],
               'supply_sync':[(6,6),(8,6),(7,7),(6,8),(8,8)],'freight':[(6,6),(7,6),(8,6),(6,7),(8,7),(6,8),(7,8),(8,8)]}
        if 'certificate' in item:d.rectangle((6,10,8,12),fill=p['a']);d.point((7,11),fill=p['b'])
        if 'permit' in item:d.line((5,9,10,9),fill=p['g'])
        if 'license' in item:d.line((5,7,5,11),fill=p['d'])
        for key,points in marks.items():
            if key in item:
                d.rectangle((6,6,9,8),fill=p['w'])
                for point in points:d.point(point,fill=p['d'])
                break
    if name=='screen' and item=='final_telemetry_unit':
        d.rectangle((4,5,11,9),fill=p['d']);d.line([(4,8),(6,8),(7,5),(8,9),(9,7),(11,7)],fill=p['h'])
    if name=='manifold' and item=='packed_steam_valve':
        d.line((4,5,12,5),fill=p['b'])
        for x in (5,7,9,11):d.point((x,5),fill=p['h'])
    return im,sources
