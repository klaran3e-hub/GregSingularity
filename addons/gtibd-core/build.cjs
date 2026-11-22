const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),os=require('node:os');
const root=path.resolve(__dirname,'../..'), src=path.join(root,'pack/overrides/kubejs'), stage=fs.mkdtempSync(path.join(os.tmpdir(),'gtibd-build-'));
const jdk=process.env.JAVA_HOME||path.resolve(root,'../.tools/ports-toolchains/jdk17/jdk-17.0.20.1+1');
const mods=process.argv[2]||path.join(root,'.dev/toolbatch-qa/mods');
const dependencies=['kubejs-forge-','rhino-forge-','ad_astra-forge-','botarium-forge-','resourcefullib-forge-','gtceu-','jei-'].map(prefix=>{const match=fs.readdirSync(mods).filter(n=>n.startsWith(prefix)&&n.endsWith('.jar'));if(match.length!==1)throw Error('Expected one '+prefix+' dependency');return path.resolve(mods,match[0])});
const gtJar=dependencies.find(file=>path.basename(file).startsWith('gtceu-'));
const jarTool=path.join(jdk,'bin/jar'), nestedRoot=fs.mkdtempSync(path.join(os.tmpdir(),'gtibd-deps-'));
const nested=cp.execFileSync(jarTool,['tf',gtJar],{encoding:'utf8'}).split(/\r?\n/).filter(name=>/^META-INF\/jarjar\/(ldlib-forge-|Registrate-).*\.jar$/.test(name));
if(nested.length!==2)throw Error('Expected LDLib and Registrate in the pinned GregTech JAR');
cp.execFileSync(jarTool,['xf',gtJar,...nested],{cwd:nestedRoot});
dependencies.push(...nested.map(name=>path.join(nestedRoot,name)));
const forgeLibraries=process.env.FORGE_LIBRARIES||path.join(root,'.dev/server/libraries/net/minecraftforge');
for(const library of ['forge/1.20.1-47.4.28/forge-1.20.1-47.4.28-universal.jar','eventbus/6.2.33/eventbus-6.2.33.jar']) dependencies.push(path.join(forgeLibraries,library));
// The included Ad Astra classes use the 1.20.1 Forge (SRG) names.
const clientLibraries=process.env.FORGE_CLIENT_LIBRARIES||path.join(root,'.dev/client/libraries');
const forgeClient=path.join(clientLibraries,'net/minecraftforge/forge/1.20.1-47.4.28/forge-1.20.1-47.4.28-client.jar');
const clientSrg=path.join(clientLibraries,'net/minecraft/client/1.20.1-20230612.114412/client-1.20.1-20230612.114412-srg.jar');
dependencies.push(forgeClient,clientSrg);
const compileLibs=/^(?:mergetool|fmlcore|fmlloader|javafmllanguage|forgespi|datafixerupper|brigadier|fastutil|guava|authlib|joml|slf4j-api|jsr305|annotations|gson|logging|sponge-mixin|mixin)-[0-9].*\.jar$/;
for(const rel of fs.readdirSync(clientLibraries,{recursive:true})){
 if(compileLibs.test(path.basename(rel)))dependencies.push(path.join(clientLibraries,rel));
}
cp.execFileSync(process.execPath,[path.join(root,'tools/build-item-descriptions.mjs')],{stdio:'inherit'});
fs.cpSync(path.join(__dirname,'resources'),stage,{recursive:true});
for(const dir of ['assets','data'])fs.cpSync(path.join(src,dir),path.join(stage,dir),{recursive:true});
const scripts=path.join(stage,'gtibd_scripts');fs.mkdirSync(scripts);
for(const folder of ['startup_scripts','server_scripts','client_scripts']){
 const names=fs.readdirSync(path.join(src,folder),{recursive:true}).filter(n=>n.endsWith('.js')).map(n=>n.split(path.sep).join('/')).sort();
 fs.writeFileSync(path.join(scripts,folder+'.txt'),names.join('\n')+'\n');
 for(const name of names){const target=path.join(scripts,folder,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(src,folder,name),target)}
}
const identity=path.join(scripts,'startup_scripts/pack_identity.js');fs.writeFileSync(identity,fs.readFileSync(identity,'utf8').replaceAll('GTIBD Addon','GTIBD Core'));
cp.execFileSync(path.join(jdk,'bin/javac'),['-proc:none','--release','17','-encoding','UTF-8','-classpath',dependencies.join(path.delimiter),'-d',stage,path.join(__dirname,'AddonScripts.java'),path.join(__dirname,'ClientFog.java'),path.join(__dirname,'CreativeTabOrder.java'),path.join(__dirname,'FieldworkSpace.java'),path.join(__dirname,'FieldworkSpaceClient.java'),path.join(__dirname,'RecipeBrowser.java'),path.join(__dirname,'StationFreight.java'),path.join(__dirname,'GeneratedWorkstations.java'),path.join(__dirname,'FieldBloomery.java'),path.join(__dirname,'RegistryMigration.java'),path.join(__dirname,'RocketFuel.java'),path.join(__dirname,'JeiRecipeAmounts.java'),path.join(__dirname,'JeiAdAstraFluids.java')],{stdio:'inherit'});
const version=fs.readFileSync(path.join(__dirname,'resources/META-INF/mods.toml'),'utf8').match(/^version="([^"]+)"/m)[1];
const output=path.join(root,'dist','GregSingularity-Core-'+version);fs.mkdirSync(output,{recursive:true});
// The committed sprites are the finished art. Keep the same resource bytes in the dev profile and the shipped JAR.
const icons=path.join(stage,'assets/kubejs/textures/item');
for(const name of fs.readdirSync(icons).filter(name=>name.endsWith('.png'))){
 const png=fs.readFileSync(path.join(icons,name));
 if(!png.subarray(1,4).equals(Buffer.from('PNG'))||png.readUInt32BE(16)!==16||png.readUInt32BE(20)!==16)throw Error('Invalid 16x16 item sprite: '+name);
}
cp.execFileSync(path.join(jdk,'bin/jar'),['cf',path.join(output,'GregSingularity-Core-'+version+'.jar'),'-C',stage,'.']);
