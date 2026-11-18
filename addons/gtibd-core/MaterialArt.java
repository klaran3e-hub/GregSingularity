import java.awt.*;
import java.awt.image.BufferedImage;
import java.nio.file.*;
import java.util.*;
import java.util.List;
import javax.imageio.ImageIO;

class MaterialArt {
    static final Set<String> protectedItems=Set.of("clay_bucket_water_surface","clay_mortar","bench_soldering_iron","seismic_probe","fire_drill","stone_chisel","stone_hammer","flint_axe","flint_knife","flint_pickaxe","copper_axe","copper_hoe","copper_mining_hammer","copper_pickaxe","copper_shovel","copper_sword");
    static final int[][] ramps=new int[8][6];
    static int channel(int c,int shift){return c>>shift&255;}
    static int mix(int a,int b,double t){
        int c=a&0xff000000;
        for(int k:new int[]{0,8,16})c|=(int)Math.round(channel(a,k)*(1-t)+channel(b,k)*t)<<k;
        return c;
    }
    static int get(BufferedImage im,int x,int y){
        return x<0||y<0||x>=im.getWidth()||y>=im.getHeight()?0:im.getRGB(x,y);
    }
    static int tone(int c){return (channel(c,16)*3+channel(c,8)*6+channel(c,0))/10;}
    static int clamp(int n){return Math.max(0,Math.min(5,n));}
    static int family(String id,int c){
        int r=channel(c,16),g=channel(c,8),b=channel(c,0);
        if(Math.max(r,Math.max(g,b))-Math.min(r,Math.min(g,b))<22)return 0;
        if(b>r*1.08&&b>g*.97)return 6;
        if(g>r*1.12&&g>b*1.05)return 5;
        if(r>g*1.34&&g>b*1.16)return id.matches(".*(clay|brick|lining|crucible|refractory).*")?4:1;
        if(r>g&&g>b*1.19)return id.matches(".*(wood|fibre|slat|sleeper|peg|cord|workbench|belt).*")?3:(g>r*.76?2:1);
        return r>g&&g>b?7:0;
    }
    static final String[] chips={"................","................",".........22.....","........2442....",".......245532...",".......233331...","...22...2111....","..2452......22..",".245532....2442.",".233321...245321","..2111....233211","......222..111..",".....24532......","....233321......",".....2111.......","................"};
    static final String[] washed={"................","................","..........22....",".........2452...","........245331..",".........2111...","...22...........","..2452...22.....","..23321.2452....","...111..23321...",".....22..111.22.","....2452....2452","....23321...2321",".....111.....11.","................","................"};
    // Pixel motifs drawn directly on the native 16x16 grid.
    static BufferedImage motif(String[] rows,int... palette){
        var out=new BufferedImage(16,16,BufferedImage.TYPE_INT_ARGB);
        for(int y=0;y<rows.length;y++)for(int x=0;x<rows[y].length();x++){
            char ch=rows[y].charAt(x);if(ch!='.')out.setRGB(x,y,0xff000000|palette[Character.digit(ch,16)]);
        }
        return out;
    }
    static final int[] STEEL={0x202327,0x343940,0x49525b,0x697681,0x94a3a8,0xbfc9cb,0xe2e5da,0xffe3a5};
    static final Set<String> charges=Set.of("copper_charge","iron_charge","tin_charge","gold_charge","bronze_charge");
    static BufferedImage charge(String id){
        int[] metal=switch(id){
            case "copper_charge" -> new int[]{0x63392a,0xa75236,0xd5804e,0xf3b07c};
            case "tin_charge" -> new int[]{0x38484c,0x739396,0xb2c6bd,0xe2ece2};
            case "gold_charge" -> new int[]{0x705119,0xb68829,0xeabd50,0xffe49a};
            case "bronze_charge" -> new int[]{0x58402a,0x896138,0xc28f55,0xeac386};
            default -> new int[]{0x394047,0x647182,0x96a4af,0xcbd1cd};
        };
        // Distinct ore fragments sit below the back lip and behind the front lip.
        int[] palette={0x352624,0x513127,0x764232,0x975b40,0xba7753,0xd39a70,0xf0bd88,metal[0],metal[1],metal[2],metal[3],0x333439,0x899295,0xe1e5d9};
        String[] fill={"................",".......79.......","....097a870.....","..055a988a9850..",".05498779a97840.",".04588798877830.",".04554444333420.","..054333332320..","..054433322220..","...0543323220...","...0433322220...","....04322220....","....04332220....",".....022110.....","......0000......","................"};
        if(id.startsWith("bronze")){fill[2]="....0c7a870.....";fill[3]="..055dc88a9850..";fill[4]=".054cb779a97840.";}
        return motif(fill,palette);
    }
    static final Set<String> ringIds=Set.of("gear_rim","shaft_bushing","pressure_gasket","vacuum_gasket","polymer_seal_preform","chemical_grade_seal","vacuum_seal_preform","hv_steel_coil_preform","ev_traction_coil","balanced_turbine_rotor","turbine_rotor_blank");
    static BufferedImage roundPart(BufferedImage base,String id){
        var out=new BufferedImage(16,16,BufferedImage.TYPE_INT_ARGB);
        boolean rotor=id.contains("turbine_rotor"),gear=id.equals("gear_rim"),disc=id.contains("wafer"),coil=id.contains("coil");
        int metal=id.contains("polymer")?0xffaa8267:id.contains("chemical")?0xff717b68:id.equals("vacuum_seal_preform")?0xff696457:id.contains("vacuum")?0xff788583:id.equals("pressure_gasket")?0xff68594d:id.equals("shaft_bushing")?0xff978167:gear||coil&&!id.startsWith("hv")||rotor?0xffb07a48:0xff87929d;
        for(int y=0;y<16;y++)for(int x=0;x<16;x++){
            double dx=x-7.5,dy=y-7.5,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
            double outer=gear?(Math.cos(a*8)>.38?7.65:6.2):7.17;
            double bore=disc?0:rotor?0:id.equals("shaft_bushing")?3.1:id.equals("vacuum_seal_preform")?2.55:4.0;
            if(r>outer||r<bore)continue;
            int light=dx+dy<-3?0xffe2d4b6:0xff383e47;
            int c=mix(metal,light,dx+dy<-3?.43:.37);
            if(r>outer-.83)c=mix(metal,0xff23282e,.73);
            else if(r<bore+1&&!disc&&!rotor)c=mix(metal,dx+dy<0?0xff292a29:0xffe4d2bb,.62);
            else if(disc&&r<5.98){c=get(base,x,y);if(c>>>24==0)c=metal;}
            else if(rotor&&r<5.65){
                if(r<1.55)c=id.startsWith("balanced")?0xffc3d0ce:0xff775943;
                else if(r<2.45)c=0xff59616b;
                else{double bend=Math.cos(8*(a-r*.075));c=bend<-.30?0xff34363a:bend>.65?0xffe2bb80:metal;}
            }else if(coil&&Math.cos(a*16)>.42)c=mix(c,0xff432d29,.48);
            out.setRGB(x,y,c);
        }
        return out;
    }
    static BufferedImage brick(String id){
        int[] tones=id.startsWith("coke")?new int[]{0x332d2b,0x514139,0x72594b,0x8d715d,0xab8c70,0xc5a785,0x534d48}:id.startsWith("nether")?new int[]{0x332329,0x503138,0x68454a,0x865351,0xa16b64,0xbf8676,0x57393c}:new int[]{0x45352d,0x695042,0x896e5c,0xa68b70,0xc0a88a,0xdcc8a7,0x826c57};
        // Vanilla brick proportions. The pressed faces stay flat; coke inclusions only mark the clay.
        var brick = motif(new String[]{
            "................","................","..........11....",".......111453...",
            "....1114555553..",".11145555555553.","1655555555556643","1465555556664330",
            "1446556664333330","1444664333333320","134453333333200.",".134533332000...",
            "..13532000......","...1100.........","................","................"
        }, tones[0], tones[1], tones[2], tones[3], tones[4], tones[5], mix(0xff000000|tones[5],0xffebd9bb,.22));
        if (id.startsWith("coke")) {
            brick.setRGB(5,6,0xff000000|tones[3]);
            brick.setRGB(11,4,0xff000000|tones[4]);
            brick.setRGB(9,9,0xff000000|tones[2]);
        }
        return brick;
    }
    static BufferedImage feature(String id){
        if(charges.contains(id))return charge(id);
        if(id.matches("(coke|nether|refractory)_brick_blank"))return brick(id);
        if(id.equals("hand_forged_plate"))return motif(new String[]{
            "................",".........000....",".......005650...",".....005544430..","...00554544330..","..0554443333320.",".065443433433320",".054433334333320","..03433334433210","...034333332110.","....0344332110..",".....03221100...","......01100.....",".......00.......","................","................"},STEEL);
        if(id.equals("mv_rotor_core"))return motif(new String[]{
            "................","..........001...","........015641..",".......0145310..",".....00134310...","....01645310....","...016542300....","..01654323210...",".015432437320...",".044323763200...","..0234754220....","...03553210.....","...043210.......","..145310........","..13210.........","...00..........."},STEEL);
        if(id.equals("ev_control_module"))return motif(new String[]{
            "................","....111111111...",".1115555555531..",".16554444444321.",".15411111111321.",".15417788871321.",".14417788171321.",".14411111111321.",".14434544344321.",".13422222222321.",".13311111111320.",".12233333333210.","..111111111110..","...690690690....","...990990990....","................"},0x171a1c,0x30373e,0x404d56,0x61737e,0x84959b,0xbbc8c9,0xe9d8a7,0x365969,0x69aec3,0xb37543);
        if(id.equals("fired_crucible")||id.equals("unfired_crucible"))return motif(new String[]{
            "................","................","....00000000....","..005555444400..",".05432221112340.",".06532111112340.",".04555444333420.","..054333332320..","..054433322220..","...0543323220...","...0433322220...","....04322220....","....04332220....",".....022110.....","......0000......","................"},id.startsWith("un")?new int[]{0x39312d,0x51443d,0x746153,0x947f6e,0xb69f87,0xd6c4aa,0xe9dcc5}:new int[]{0x3b2725,0x53312a,0x784330,0xa65d40,0xc87f55,0xe6a370,0xffc58d});
        if(id.equals("copper_contact_strip"))return motif(new String[]{
            "................","................","...........001..","..........15541.",".........154331.","........1543321.",".......1543321..","......1543321...",".....1543321....","....1543321.....","...1563321......","..1543321.......","..143321........","...221..........","................","................"},0x3e2826,0x593529,0x834934,0xaf6143,0xd1845a,0xf0a675,0xffcda0);
        if(id.equals("plant_fibre")||id.equals("washed_fibre"))return motif(new String[]{
            "................","..........42....","...42.....42..4.","...42..4.542.42.","...542.4242.542.","....42.4242.42..","..4.542424242...","..42.42424242...",".542.5424242....","..542.424242....","...54245422.....","....543332......","....126562......","....233422......","...342.42.......","....2..2........"},0x1f271e,0x45412c,0x62603b,0x88673c,0xa49d57,0xc3bd74,id.startsWith("washed")?0xd9e7b1:0xe9cf8d);
        return null;
    }
    // Tighten the silhouette, then light exposed faces and inner bevels from upper left.
    static BufferedImage bevel(BufferedImage src){
        int minX=16,minY=16,maxX=-1,maxY=-1;
        for(int y=0;y<16;y++)for(int x=0;x<16;x++)if(get(src,x,y)>>>24!=0){
            minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
        }
        if(maxX<0)return src;
        int w=maxX-minX+1,h=maxY-minY+1;double scale=Math.min(1.6,14.0/Math.max(w,h));
        int nw=(int)Math.round(w*scale),nh=(int)Math.round(h*scale),left=(16-nw)/2,top=(16-nh)/2;
        var face=new BufferedImage(16,16,BufferedImage.TYPE_INT_ARGB);
        for(int y=0;y<nh;y++)for(int x=0;x<nw;x++)face.setRGB(left+x,top+y,src.getRGB(minX+(2*x+1)*w/(2*nw),minY+(2*y+1)*h/(2*nh)));
        var out=new BufferedImage(16,16,BufferedImage.TYPE_INT_ARGB);
        for(int y=0;y<16;y++)for(int x=0;x<16;x++){
            int c=get(face,x,y),north=get(face,x,y-1),west=get(face,x-1,y);
            if(c>>>24==0){
                if(north>>>24!=0||west>>>24!=0)out.setRGB(x,y,mix(north>>>24==0?west:north,0xff16191d,.67));
                continue;
            }
            double light=(x-left)/(double)nw+(y-top)/(double)nh;
            if(north>>>24==0||west>>>24==0)c=mix(c,0xfff5e6cc,tone(c)<50?.19:.37);
            else if(get(face,x,y+1)>>>24==0)c=mix(c,0xff232632,.33);
            else if(tone(north)-tone(c)>32)c=mix(c,0xff202329,.2);
            else if(tone(c)-tone(west)>44)c=mix(c,0xffffefdb,.25);
            else if(light<.75)c=mix(c,0xfffff1de,.12);
            else if(light>1.18)c=mix(c,0xff1c2026,.17);
            out.setRGB(x,y,c);
        }
        return out;
    }
    static BufferedImage render(BufferedImage src,String id,String group){
        var custom=feature(id);if(custom!=null)return custom;
        int w=src.getWidth(),h=src.getHeight();var out=new BufferedImage(w,h,BufferedImage.TYPE_INT_ARGB);
        boolean fluid=group.equals("block"),route=group.equals("web"),grit=id.matches("(washed_)?(iron|gold|copper|tin)_grit");
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){
            int c=get(src,x,y);
            if(grit){
                char v=(id.startsWith("washed")?washed:chips)[y].charAt(x);if(v=='.')continue;
                int base=ramps[id.contains("gold")?2:id.contains("copper")?1:0][v-'0'];
                out.setRGB(x,y,id.contains("iron")?mix(base,0xffbe9874,.24):id.contains("tin")?mix(base,0xff86b6ba,.16):base);continue;
            }
            if(c>>>24==0)continue;
            int val=tone(c),paint;
            if(route){
                paint=mix(c,ramps[0][clamp(val/44)],.68);
                if((x+y)%32<5)paint=mix(paint,ramps[2][4],.30);
            }else if(fluid){
                double dx=x*Math.PI/8,dy=y*Math.PI/8;
                double wv=id.endsWith("_flow")?Math.sin(dx+Math.sin(dy)*.8)+.45*Math.cos(2*dx-dy):Math.sin(dy+Math.sin(dx)*1.5)+.40*Math.cos(dx+dy);
                paint=wv>1.03?mix(c,0xffd3e2da,.42):wv>.45?mix(c,0xff9aafaa,.23):mix(c,wv>-.4?0xff34464a:0xff121c22,.30);
            }else{
                int row=family(id,c),n=get(src,x,y-1),l=get(src,x-1,y),e=get(src,x+1,y),s=get(src,x,y+1);
                int level=clamp((val+12)/46);
                if((n>>>24==0||l>>>24==0)&&val>75)level++;
                if(e>>>24==0||s>>>24==0)level--;
                if(val>75&&Math.abs(tone(n)-val)<18&&Math.abs(tone(l)-val)<18){
                    if(row==0&&(x+y)%9<2)level++;
                    if(row==3&&(y+x/5)%5==0)level--;
                    if(row==6&&(2*x+y)%13<2)level++;
                }
                boolean tint=row==5||row==6||channel(c,0)>1.2*channel(c,8)&&channel(c,16)>1.15*channel(c,8);
                paint=mix(c,ramps[row][clamp(level)],tint?.34:.72);
                if(val<42)paint=mix(paint,0xff14181c,.5);
            }
            out.setRGB(x,y,paint);
        }
        if(ringIds.contains(id)||id.contains("wafer")&&!id.equals("ev_logic_preform"))return roundPart(out,id);
        return fluid||route||grit?out:bevel(out);
    }
    static void sheet(Path before,Path after,List<Path> entries,Path file)throws Exception{
        int cols=8,cell=130,row=92;
        var im=new BufferedImage(cols*cell,42+row*((entries.size()+cols-1)/cols),BufferedImage.TYPE_INT_RGB);
        var g=im.createGraphics();g.setColor(new Color(30,34,38));g.fillRect(0,0,im.getWidth(),im.getHeight());
        g.setFont(new Font("Dialog",Font.BOLD,18));g.setColor(new Color(235,214,173));g.drawString("GTIBD CORE     /     BEFORE   /   AFTER",10,28);
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
        for(int i=0;i<entries.size();i++){var n=entries.get(i);int x=i%cols*cell,y=42+i/cols*row;
            g.setColor(new Color(i%2==0?0x35393c:0x303438));g.fillRect(x+1,y,cell-3,row-2);
            for(int j=0;j<2;j++){
                var src=ImageIO.read((j==0?before:after).resolve(n).toFile());double scale=Math.min(52.0/src.getWidth(),52.0/src.getHeight());
                g.drawImage(src,x+4+j*64,y+4,(int)(src.getWidth()*scale),(int)(src.getHeight()*scale),null);
            }
            g.setFont(new Font("Monospaced",Font.PLAIN,9));g.setColor(Color.LIGHT_GRAY);
            var name=n.getFileName().toString().replace(".png","");
            for(int j=0;j<name.length();j+=22)g.drawString(name.substring(j,Math.min(j+22,name.length())),x+4,y+70+j/22*10);
        }g.dispose();ImageIO.write(im,"png",file.toFile());
    }
    public static void main(String[] args)throws Exception{
        Path src=Path.of(args[0]),target=Path.of(args[1]),out=Path.of(args[3]);Files.createDirectories(out);
        var pal=ImageIO.read(Path.of(args[2]).toFile());
        for(int y=0;y<8;y++)for(int x=0;x<6;x++)ramps[y][x]=pal.getRGB((2*x+1)*pal.getWidth()/12,(2*y+1)*pal.getHeight()/16);
        var changed=new ArrayList<Path>();int saved=0;
        for(String folder:List.of("item","block","quests/web")){Path dir=src.resolve(folder);
            try(var paths=Files.list(dir)){for(var in:paths.sorted().toList()){String name=in.getFileName().toString();if(!name.endsWith(".png"))continue;
                var rel=src.relativize(in);var dest=target.resolve(rel);String id=name.replace(".png","");
                if(protectedItems.contains(id)){if(Files.mismatch(in,dest)!=-1)throw new IllegalStateException(name);saved++;continue;}
                ImageIO.write(render(ImageIO.read(in.toFile()),id,dir.getFileName().toString()),"png",dest.toFile());changed.add(rel);
            }}
        }
        for(int i=0;i<changed.size();i+=64)sheet(src,target,changed.subList(i,Math.min(i+64,changed.size())),out.resolve("textures-"+(i/64+1)+".png"));
        System.out.println(changed.size()+" textures rendered, "+saved+" protected files identical");
    }
}
