import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root=fileURLToPath(new URL('../pack/overrides/kubejs/',import.meta.url))
const data='data/zero_shift/', render='assets/zero_shift/planet_renderers/'
const get=p=>JSON.parse(readFileSync(resolve(root,p+'.json'),'utf8'))
function save(path,obj) {
  const file=resolve(root,path+'.json')
  mkdirSync(dirname(file),{recursive:true})
  writeFileSync(file,JSON.stringify(obj,null,2)+'\n')
}
function ore(key,state,host,size,count,low,high) {
  const configured=get(data+'worldgen/configured_feature/ceres_salt_lens')
  configured.config.size=size
  configured.config.targets[0].target.block=host
  configured.config.targets[0].state.Name=state
  save(data+'worldgen/configured_feature/'+key,configured)
  const placed=get(data+'worldgen/placed_feature/ceres_salt_lens')
  placed.feature='zero_shift:'+key;placed.placement[0].count=count
  placed.placement[2].height.min_inclusive.absolute=low;placed.placement[2].height.max_inclusive.absolute=high
  if (key === 'titan_seam_core') {
    // The two fixed-biome worlds share the ore decoration seed. Vary only Titan's seam centers.
    const biomeFilter = placed.placement.findIndex(modifier => modifier.type === 'minecraft:biome')
    placed.placement.splice(biomeFilter, 0, {
      type: 'minecraft:random_offset',
      xz_spread: {type: 'minecraft:uniform', value: {min_inclusive: -8, max_inclusive: 8}},
      y_spread: 0
    })
  }
  save(data+'worldgen/placed_feature/'+key,placed)
}
const ceresBiome=get(data+'worldgen/biome/ceres_salt_basins')
ore('ceres_sapphire','gtceu:sapphire_ore','minecraft:deepslate',16,5,12,52)
ceresBiome.features[6]=['zero_shift:ceres_salt_lens','zero_shift:ceres_sapphire']
save(data+'worldgen/biome/ceres_salt_basins',ceresBiome)
for(const suffix of ['','_orbit']){
  const p=get(data+'planets/ceres'+suffix);p.tier=5;save(data+'planets/ceres'+suffix,p)
}
const worlds=[
  {id:'europa',tier:6,biome:'europa_fractures',stone:'minecraft:stone',surface:['blue_ice','packed_ice','snow_block'],core:'europa_rift_core',ore:'olivine',gravity:1.31,temp:-160,power:4,sky:0x223545,parent:'jupiter',relief:-6,grain:-4},
  {id:'titan',tier:7,biome:'titan_dunes',stone:'minecraft:stone',surface:['terracotta','brown_terracotta','red_sandstone'],core:'titan_seam_core',ore:'cassiterite_sand',gravity:1.35,temp:-179,power:2,sky:0x7c5b40,parent:'saturn',relief:-8,grain:-5}
]
for(const s of worlds) {
  for(const orbit of [false,true]){
    const suffix=orbit?'_orbit':'',key=s.id+suffix,id='zero_shift:'+key
    let p=get(data+'planets/ceres'+suffix);Object.assign(p,{dimension:id,tier:s.tier,gravity:orbit?0:s.gravity,solar_power:orbit?s.power*2:s.power,temperature:orbit?-270:s.temp})
    if(!orbit)p.orbit=id+'_orbit'
    save(data+'planets/'+key,p)
    let dim=get(data+'dimension/ceres'+suffix);dim.type=id
    if(!orbit){dim.generator.settings='zero_shift:'+s.id;dim.generator.biome_source.biome='zero_shift:'+s.biome}
    save(data+'dimension/'+key,dim)
    let type=get(data+'dimension_type/ceres'+suffix);type.effects=id;save(data+'dimension_type/'+key,type)
    let sky=get(render+'ceres'+suffix);sky.dimension=id
    if(orbit)sky.sky_renderables[1].texture='zero_shift:textures/environment/'+s.id+'.png'
    sky.sky_renderables.push({...sky.sky_renderables[0],texture:'zero_shift:textures/environment/'+s.parent+'.png',movement_type:'STATIC',global_rotation:[58,20,26],scale:s.id==='europa'?32:21,back_light_scale:1})
    save(render+key,sky)
  }
  const ns='zero_shift:'+s.id
  save(data+'worldgen/noise/'+s.id+'_relief',{firstOctave:s.relief,amplitudes:[1,.55,.24]})
  save(data+'worldgen/noise/'+s.id+'_scree',{firstOctave:s.grain,amplitudes:[1,.3]})
  const relief=get(data+'worldgen/density_function/ceres_relief')
  const base=relief.argument2.argument
  base.argument1.noise=ns+'_relief';base.argument2.argument2.noise=ns+'_scree'
  const grooves={type:'minecraft:abs',argument:base.argument2.argument2}
  base.argument2={type:'minecraft:mul',argument1:s.id==='europa'?1.35:.85,argument2:grooves}
  if(s.id==='titan'){grooves.argument.xz_scale=1.3;base.argument1.xz_scale=.45}
  save(data+'worldgen/density_function/'+s.id+'_relief',relief)
  const settings=JSON.parse(JSON.stringify(get(data+'worldgen/noise_settings/ceres')).replaceAll('zero_shift:ceres',ns))
  settings.default_block.Name=s.stone
  const layers=settings.surface_rule.sequence[1].then_run.sequence
  layers[0].then_run.result_state.Name='minecraft:'+s.surface[0]
  layers[1].then_run.result_state.Name='minecraft:'+s.surface[1]
  layers[2].result_state.Name='minecraft:'+s.surface[2]
  if(s.id==='europa')settings.surface_rule.sequence.push({type:'minecraft:condition',if_true:{type:'minecraft:stone_depth',offset:5,add_surface_depth:false,secondary_depth_range:0,surface_type:'floor'},then_run:{type:'minecraft:block',result_state:{Name:'minecraft:packed_ice'}}})
  save(data+'worldgen/noise_settings/'+s.id,settings)
  const biome=get(data+'worldgen/biome/ceres_salt_basins')
  biome.effects.sky_color=s.sky;biome.effects.fog_color=s.sky;biome.features[6]=['zero_shift:'+s.core,ns+'_'+s.ore]
  save(data+'worldgen/biome/'+s.biome,biome)
  ore(s.core,'kubejs:'+s.core,s.stone,14,6,20,62)
  ore(s.id+'_'+s.ore,'gtceu:'+s.ore+'_ore',s.stone,18,5,12,52)
}

const veinFile=resolve(root,'../../..','tools/orbital-veins.json')
const veins=JSON.parse(readFileSync(veinFile,'utf8'))
for(const [world,biome,vein,unique,base] of [
  ['ceres','ceres_salt_basins','sapphire_vein','sapphire','deepslate'],
  ['europa','europa_fractures','olivine_vein','olivine','stone'],
  ['titan','titan_dunes','garnet_tin_vein','cassiterite_sand','stone']]){
  const config=get(data+'worldgen/biome/'+biome)
  for(const [material,weight] of veins.find(row=>row.id===vein).ore){
    if(material===unique)continue
    const name=world+'_'+material
    ore(name,'gtceu:'+material+'_ore','minecraft:'+base,8+2*weight,weight,12,52)
    config.features[6].push('zero_shift:'+name)
  }
  save(data+'worldgen/biome/'+biome,config)
}
