const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),os=require('node:os');
const root=path.resolve(__dirname,'../..'), src=path.join(root,'pack/overrides/kubejs'), stage=fs.mkdtempSync(path.join(os.tmpdir(),'gtibd-build-'));
const jdk=process.env.JAVA_HOME||path.resolve(root,'../.tools/ports-toolchains/jdk17/jdk-17.0.20.1+1');
const mods=process.argv[2]||path.join(root,'.dev/toolbatch-qa/mods');
const dependencies=['kubejs-forge-','rhino-forge-'].map(prefix=>{const match=fs.readdirSync(mods).filter(n=>n.startsWith(prefix)&&n.endsWith('.jar'));if(match.length!==1)throw Error('Expected one '+prefix+' dependency');return path.resolve(mods,match[0])});
fs.cpSync(path.join(__dirname,'resources'),stage,{recursive:true});
for(const dir of ['assets','data'])fs.cpSync(path.join(src,dir),path.join(stage,dir),{recursive:true});
const scripts=path.join(stage,'gtibd_scripts');fs.mkdirSync(scripts);
for(const folder of ['startup_scripts','server_scripts','client_scripts']){
 const names=fs.readdirSync(path.join(src,folder),{recursive:true}).filter(n=>n.endsWith('.js')).map(n=>n.split(path.sep).join('/')).sort();
 fs.writeFileSync(path.join(scripts,folder+'.txt'),names.join('\n')+'\n');
 for(const name of names){const target=path.join(scripts,folder,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(src,folder,name),target)}
}
const primitive=path.join(scripts,'startup_scripts/primitive_items.js');fs.writeFileSync(primitive,fs.readFileSync(primitive,'utf8').replace("if (id === 'stone_chisel')","if (id === 'wooden_peg') item.texture('minecraft:item/stick').color(0, 0xcdb681)\n    if (id === 'stone_chisel')"));
const identity=path.join(scripts,'startup_scripts/pack_identity.js');fs.writeFileSync(identity,fs.readFileSync(identity,'utf8').replaceAll('GTIBD Addon','GTIBD Core'));
cp.execFileSync(path.join(jdk,'bin/javac'),['-proc:none','--release','17','-classpath',dependencies.join(path.delimiter),'-d',stage,path.join(__dirname,'AddonScripts.java')],{stdio:'inherit'});
const output=path.join(root,'dist/GTIBD-Core-0.0.1');fs.mkdirSync(output,{recursive:true});
cp.execFileSync(path.join(jdk,'bin/java'),['-Djava.awt.headless=true',path.join(__dirname,'MaterialArt.java'),path.join(src,'assets/kubejs/textures'),path.join(stage,'assets/kubejs/textures'),path.join(__dirname,'material-palette.png'),output],{stdio:'inherit'});
cp.execFileSync(path.join(jdk,'bin/jar'),['cf',path.join(output,'gtibd-core-0.0.1.jar'),'-C',stage,'.']);
