"""Bake the three original GTIBD airframes as faceted Forge models, in 1/16-block units."""
from math import cos, hypot, pi, sin, sqrt
from pathlib import Path
import json

ASSETS = Path(__file__).resolve().parents[2] / 'pack/overrides/kubejs/assets'
SHIPS = ('surveyor', 'courier', 'freighter')
# Each tile is a hand-painted 16x16 material in the ship's 160px skin.
MATERIALS = ('skin', 'plate', 'enamel', 'stripe', 'graphite', 'ceramic', 'ribs',
             'exhaust', 'throat', 'silver', 'sensor', 'glass', 'glass_edge',
             'hatch', 'cargo', 'latch', 'amber', 'mark', 'vents', 'foil', 'cap',
             'heatshield', 'cream', 'label', 'warning', 'port', 'spine', 'radiator')


def coords(angle, radial, y, tangent=0):
    return (sin(angle)*radial + cos(angle)*tangent, y,
            cos(angle)*radial - sin(angle)*tangent)


def cross(a, b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])


def delta(a, b):
    return tuple(x-y for x,y in zip(a,b))


def unit(a):
    length=sqrt(sum(x*x for x in a))
    if length < 1e-7:
        raise ValueError('Degenerate model face')
    return tuple(x/length for x in a)


class Airframe:
    def __init__(self, name):
        self.name=name
        self.points={}
        self.uvs={}
        self.normals={}
        self.faces=[]

    @staticmethod
    def index(table, values):
        key=tuple(round(x,6) for x in values)
        return table.setdefault(key,len(table)+1)

    def face(self, points, material):
        if len(points)>4:
            for i in range(1,len(points)-1):
                self.face((points[0],points[i],points[i+1]),material)
            return
        normal=unit(cross(delta(points[1],points[0]),delta(points[2],points[0])))
        n=self.index(self.normals,normal)
        tile=MATERIALS.index(material)
        vertices=[]
        for pos,(u,v) in zip(points, ((0,1),(1,1),(1,0),(0,0))):
            j=self.index(self.points,(pos[0]/16+.5,pos[1]/16,pos[2]/16+.5))
            # flip_v in the Forge OBJ loader converts Wavefront's lower-left UV origin.
            t=self.index(self.uvs,(((tile%10)*16+.3+15.4*u)/160,
                                   1-((tile//10)*16+.3+15.4*v)/160))
            vertices.append(f'{j}/{t}/{n}')
        self.faces.append('f '+' '.join(vertices))

    def lathe(self, x, z, rings, sides=10, rotation=0, top=True, bottom=True):
        # Row material paints the wall up to the next row. Radius may shrink or flare.
        curves=[[(x+r*sin(rotation+2*pi*(i-.5)/sides),y,z+r*cos(rotation+2*pi*(i-.5)/sides))
                 for i in range(sides)] for y,r,_ in rings]
        for k in range(len(rings)-1):
            skin=rings[k][2]
            for i in range(sides):
                j=(i+1)%sides
                self.face((curves[k][i],curves[k][j],curves[k+1][j],curves[k+1][i]),
                          skin[i%len(skin)] if isinstance(skin,tuple) else skin)
        for curve,paint,is_top in ((curves[0],rings[0][2],False),(curves[-1],rings[-1][2],True)):
            if (is_top and not top) or (not is_top and not bottom):
                continue
            c=(x,curve[0][1],z)
            for i in range(sides):
                a,b=curve[i],curve[(i+1)%sides]
                self.face((c,a,b) if is_top else (c,b,a),paint if isinstance(paint,str) else paint[0])

    def solid(self, left, right, cap, edge):
        # Parallel end loops in the same order, wound outward using the solid's centre.
        all_points=left+right
        center=tuple(sum(p[k] for p in all_points)/len(all_points) for k in range(3))
        def finish(face,mat):
            normal=cross(delta(face[1],face[0]),delta(face[2],face[0]))
            if sum(a*b for a,b in zip(normal,delta(face[0],center)))<0:
                face=list(reversed(face))
            self.face(face,mat)
        finish(left,cap);finish(right,cap)
        for i in range(len(left)):
            j=(i+1)%len(left)
            finish([left[i],left[j],right[j],right[i]],edge)

    def plate(self, a, rad, y, width, height, depth, front, side='graphite', tangent=0, taper=0):
        # A hatch or tile lies on a faceted side. Taper follows sloping cabin glazing.
        layers=[]
        for r in (rad,rad+depth):
            layers.append([coords(a,r,y,tangent-width/2),coords(a,r,y,tangent+width/2),
                           coords(a,r+taper,y+height,tangent+width/2),coords(a,r+taper,y+height,tangent-width/2)])
        self.solid(*layers,front,side)

    def swept(self, a, profile, width, side, edge, offset=0):
        layers=[[coords(a,r,y,t) for r,y in profile] for t in (offset-width/2,offset+width/2)]
        self.solid(*layers,side,edge)

    def strut(self, start, end, radius, skin, sides=5):
        direction=unit(delta(end,start))
        u=unit(cross(direction,(1,0,0) if abs(direction[0])<.86 else (0,0,1)))
        v=cross(direction,u)
        def ring(p):
            return [tuple(p[k]+radius*(u[k]*cos(2*pi*i/sides)+v[k]*sin(2*pi*i/sides)) for k in range(3)) for i in range(sides)]
        self.solid(ring(start),ring(end),skin,skin)

    def save(self, folder):
        fmt=lambda q:' '.join(f'{x:.6f}'.rstrip('0').rstrip('.') or '0' for x in q)
        rows=['# Original GTIBD spacecraft. Coordinates are in Minecraft blocks.',
              f'mtllib {self.name}.mtl',f'o {self.name}']
        for prefix,table in [('v',self.points),('vt',self.uvs),('vn',self.normals)]:
            rows.extend(prefix+' '+fmt(k) for k in table)
        rows+=['usemtl hull',*self.faces]
        (folder/(self.name+'.obj')).write_text('\n'.join(rows)+'\n',encoding='ascii')
        (folder/(self.name+'.mtl')).write_text(f'newmtl hull\nKd 1 1 1\nmap_Kd gtibd_core:entity/{self.name}\n',encoding='ascii')


def engine(ship,x,z,y,r):
    # A recessed dark throat is visible from below; no flat cap across the bell.
    ship.lathe(x,z,[(y,r,'silver'),(y+.7,r,'exhaust'),(y+3.6,r*.75,'ribs'),
                    (y+6,r*.47,'graphite'),(y+8,r*.52,'exhaust')],8,bottom=False)
    ship.lathe(x,z,[(y,r,'ceramic'),(y,r*.80,'throat'),(y+3.4,r*.34,'throat')],8,top=True,bottom=False)


def landing_leg(ship,a,base,spread):
    joint=coords(a,base,16); knee=coords(a,spread-2,5)
    ship.strut(joint,knee,1.2,'graphite')
    ship.strut(knee,coords(a,spread,1.7),.85,'silver')
    ship.strut(coords(a,base-.5,8),coords(a,spread-1.2,3.5),.6,'silver')
    ship.swept(a,[(spread-3,.4),(spread+2.7,.4),(spread+2.1,1.8),(spread-1.6,2.2)],3.5,'graphite','silver')


def cockpit(ship,start,r,height,heavy=False):
    n=8 if heavy else 10
    ship.lathe(0,0,[(start,r,'graphite'),(start+1.7,r+0.3,'skin'),
                     (start+4,r,'graphite'),(start+height,r*.71,'skin')],n)
    for i in ([0,1,7,4] if heavy else [0,1,9,4,5,6]):
        a=2*pi*i/n;dist=r*cos(pi/n)
        ship.plate(a,dist-.25,start+4,r*(.68 if heavy else .52),height-5,.55,
                   'glass_edge','graphite',taper=-r*.25)
        ship.plate(a,dist+.34,start+4.9,r*(.55 if heavy else .4),height-6.5,.2,
                   'glass','graphite',taper=-r*.22)


def survey(ship):
    ship.lathe(0,0,[(9,5,'graphite'),(13,8,'heatshield'),(19,9,'ribs'),(22,10,'stripe'),
        (25,10,'plate'),(41,10,'enamel'),(44,10,'skin'),(57,9,'graphite'),(59,9,'cream')],10)
    cockpit(ship,59,9,10)
    ship.lathe(0,0,[(69,6.5,'cream'),(76,5.2,'stripe'),(78.5,4.7,'enamel'),(86,2.1,'graphite'),
                     (88,1.4,'silver'),(91,1.1,'cap')],10)
    ship.lathe(0,0,[(91,.9,'silver'),(96,.43,'graphite')],6)
    engine(ship,0,0,1.7,5.4)
    for i in range(3):
        a=2*pi*i/3+pi/3
        ship.swept(a,[(7,15),(17,5),(18.7,6.2),(16.9,20),(9,36),(7,35)],2,'enamel','silver')
        ship.swept(a,[(12,12),(16.5,8.4),(17,14),(12,22.5)],2.25,'stripe','graphite')
        x,_,z=coords(a,11,0)
        ship.lathe(x,z,[(6.4,2.8,'graphite'),(10,3.1,'skin'),(18,3.1,'enamel'),(22,1.2,'cap')],8)
        engine(ship,x,z,3,2.7)
        landing_leg(ship,a+pi/3,7.8,17.5)
    ship.plate(0,9.45,28,5.6,8.8,.6,'hatch','silver')
    ship.plate(0,9.2,46,4.8,7.2,.6,'mark')
    # The survey instrument is an off-axis gold foil housing with a recessed optics port.
    a=-pi*.39
    ship.plate(a,8.8,49,5.8,8,1.8,'foil')
    ship.plate(a,10.55,51,3.8,4.1,1.1,'sensor','graphite')
    ship.strut(coords(a,9.8,57),coords(a,8.1,70),.55,'silver')
    for a in (pi*.62,pi*1.22):
        ship.plate(a,9.35,26,2.1,18,.95,'spine','graphite')


def courier(ship):
    ship.lathe(0,0,[(8,5.2,'graphite'),(15,8.2,'ribs'),(20,9,'skin'),(29,9.6,'enamel'),
        (33,9.8,'graphite'),(37,9.8,'cream'),(56,9,'stripe'),(59,8.7,'plate'),
        (67,8.4,'graphite')],10)
    cockpit(ship,67,8.7,11)
    ship.lathe(0,0,[(78,6.2,'skin'),(85,5.5,'enamel'),(91,3.9,'cream'),
                     (98,1.6,'graphite'),(103,.65,'silver')],10)
    engine(ship,0,0,2,5.3)
    for sign in (-1,1):
        a=sign*pi/2
        x=sign*13
        # High-mounted twin transfer tanks and swept stabilisers make a forked profile.
        ship.lathe(x,0,[(11,3.3,'graphite'),(16,4.7,'ribs'),(20,5.1,'enamel'),
             (26,5.1,'cream'),(45,5.1,'plate'),(58,4.8,'graphite'),(60,4.8,'enamel'),
             (66,3.4,'cream'),(73,1.1,'cap')],8)
        engine(ship,x,0,3.2,4.4)
        ship.swept(a,[(6.8,24),(14,15),(15,20),(9.5,43),(7.8,45)],4,'graphite','silver')
        ship.swept(a,[(13,13),(22.3,5.5),(22.8,8.4),(19.3,24),(15,36),(13,30)],2.3,'enamel','silver')
        ship.swept(a,[(17,15),(21.5,9),(20.8,15),(17,23)],2.6,'cream','graphite')
    for a in (pi/4,3*pi/4,5*pi/4,7*pi/4):
        landing_leg(ship,a,8,15.8)
    ship.plate(0,8.85,42,6.2,10,1,'hatch')
    ship.plate(0,9,53,5,6,.85,'mark')
    for a in (pi*.83,pi*1.17):
        ship.plate(a,8.8,38,4.3,17,1.0,'radiator','silver')
    for a in (0,pi):
        ship.swept(a,[(8,18),(13,10),(13,17),(8,29)],1.8,'graphite','silver')


def freighter(ship):
    ship.lathe(0,0,[(9,7,'graphite'),(15,10,'ribs'),(21,11,'heatshield'),
        (26,11.5,'enamel'),(30,11.5,'plate'),(43,11.5,'graphite'),(46,12,'cargo'),
        (64,12,'graphite'),(67,11.6,'skin'),(75,11,'stripe'),(78,11,'graphite')],8)
    cockpit(ship,78,11.2,12,True)
    ship.lathe(0,0,[(90,8,'skin'),(93,8.2,'stripe'),(96,7.8,'cream'),(102,5.3,'plate'),
                     (107,3.4,'graphite'),(109,3.5,'silver'),(111,2.6,'cap')],8)
    engine(ship,0,0,2,6.1)
    for a in (pi/4,3*pi/4,5*pi/4,7*pi/4):
        x,_,z=coords(a,15.6,0)
        ship.lathe(x,z,[(8,3.1,'graphite'),(13,4.8,'ribs'),(17,5.5,'enamel'),(22,5.3,'plate'),
            (36,5.1,'enamel'),(39,5.1,'cream'),(46,4.8,'graphite'),(49,4,'silver'),(54,1.6,'cap')],8)
        engine(ship,x,z,2,4.8)
        ship.swept(a,[(7.5,19),(16,11),(16,23),(10.5,39),(8.4,40)],4.1,'graphite','silver')
        landing_leg(ship,a,14.3,22.2)
    # The two removable cargo saddles have locking shoes at both ends and diagonal tie braces.
    for a in (pi/2,-pi/2):
        ship.plate(a,9,40,12.6,29,5.5,'cargo','graphite')
        ship.plate(a,14.55,43.6,11.4,21.6,1.4,'cargo','silver')
        for y in (41.7,64):
            ship.plate(a,14.45,y,13.1,3.7,2.2,'latch','enamel')
        for t0,t1 in [(-5.2,5.2),(5.2,-5.2)]:
            ship.strut(coords(a,16.3,46,t0),coords(a,16.3,62.5,t1),.72,'silver',4)
    ship.plate(0,11.2,48,8.4,13,1.5,'hatch','graphite')
    ship.plate(0,10.8,70,6.8,5.5,.9,'mark')
    for a in (pi*.76,pi*1.24):
        ship.plate(a,11.1,48,3.3,15,1.2,'vents','silver')
    ship.lathe(-2.8,2.1,[(111,.7,'silver'),(115,.5,'enamel')],5)


# Keep the original carry scale and center the hull above Ad Astra's raised arms.
# Minecraft mirrors this transform for the left hand.
OVERHEAD_DISPLAY = {
    'surveyor': ([-27.79, 6.58, -10.47], 0.542),
    'courier': ([-28.07, 6.32, -9.59], 0.505),
    'freighter': ([-28.46, 6.64, -10.48], 0.452),
}
DISPLAY_FRAMING = {
    'surveyor': (0.172, -5.83, 0.15, 0.283),
    'courier': (0.16, -5.91, 0.14, 0.264),
    'freighter': (0.143, -6.03, 0.125, 0.237),
}


def item_model(name, mesh):
    icon = f'gtibd_core:item/{name}'
    origin, scale = OVERHEAD_DISPLAY[name]
    ground, frame_height, frame, head = DISPLAY_FRAMING[name]
    overhead = {'rotation': [-110, 0, -90], 'translation': origin, 'scale': [scale] * 3}
    display = {
        'thirdperson_righthand': overhead,
        'thirdperson_lefthand': overhead,
        'ground': {'translation': [0, 1.5, 0], 'scale': [ground] * 3},
        'fixed': {'translation': [0, frame_height, 0], 'scale': [frame] * 3},
        'head': {'translation': [0, 8, 0], 'scale': [head] * 3},
    }
    # Render an empty model in first person rather than transforming the world mesh.
    hidden = {'elements': [], 'textures': {'particle': icon}}
    return {
        'loader': 'forge:separate_transforms',
        'gui_light': 'front',
        'textures': {'particle': icon},
        'base': {**mesh, 'textures': {'particle': f'gtibd_core:entity/{name}'}, 'display': display},
        'perspectives': {
            'gui': {'parent': 'minecraft:item/generated', 'textures': {'layer0': icon}},
            'firstperson_righthand': hidden,
            'firstperson_lefthand': hidden,
        },
    }


def build():
    folder=ASSETS/'gtibd_core/models/vehicle'
    folder.mkdir(parents=True,exist_ok=True)
    for name,draw in zip(SHIPS,(survey,courier,freighter)):
        ship=Airframe(name);draw(ship);ship.save(folder)
        obj={'loader':'forge:obj','model':f'gtibd_core:models/vehicle/{name}.obj',
             'automatic_culling':False,'shade_quads':True,'flip_v':True,'emissive_ambient':False}
        (folder/f'{name}.json').write_text(json.dumps(obj,indent=2)+'\n',encoding='utf8')
        model = item_model(name, obj)
        (ASSETS/f'gtibd_core/models/item/{name}.json').write_text(json.dumps(model,indent=2)+'\n',encoding='utf8')
        print(name,len(ship.faces),'faces;',len(ship.points),'welded vertices')
    atlas=ASSETS/'minecraft/atlases/blocks.json'
    atlas.parent.mkdir(parents=True,exist_ok=True)
    cfg=json.loads(atlas.read_text(encoding='utf8')) if atlas.exists() else {'sources':[]}
    for name in SHIPS:
        entry={'type':'minecraft:single','resource':'gtibd_core:entity/'+name}
        if entry not in cfg['sources']:cfg['sources'].append(entry)
    atlas.write_text(json.dumps(cfg,indent=2)+'\n',encoding='utf8')


if __name__=='__main__':
    build()
