// priority: 50
// Bursts are emitted only for completed actions and near the player who performed them.
const FieldParticles = Java.loadClass('net.minecraft.core.particles.ParticleTypes')
const FieldSounds = Java.loadClass('net.minecraftforge.registries.ForgeRegistries').SOUND_EVENTS
const FieldLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
const FieldSoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
const FieldItemParticle = Java.loadClass('net.minecraft.core.particles.ItemParticleOption')
const fieldChips = {knap:'minecraft:flint',lash:'kubejs:plant_fibre',cut:'minecraft:oak_planks',ram:'minecraft:clay_ball',strike:'kubejs:iron_rivet',mill:'kubejs:chamotte'}
const fieldParticles = {
  knap: FieldParticles.CRIT, lash: FieldParticles.COMPOSTER, cut: FieldParticles.POOF,
  ram: FieldParticles.ASH, wash: FieldParticles.SPLASH, strike: FieldParticles.CRIT,
  fire: FieldParticles.SMALL_FLAME, mill: FieldParticles.ASH
}
const activeFieldEffects = new Set()
global.fieldworkEffect = (level, pos, kind, player) => {
  if (level.isClientSide()) return
  const key = String(player.uuid)
  if (activeFieldEffects.has(key)) return
  activeFieldEffects.add(key)
  level.server.scheduleInTicks(1, () => activeFieldEffects.delete(key))
  const event = FieldSounds.getValue(new FieldLocation('kubejs', 'fieldwork.' + kind))
  const x = pos.x + 0.5, y = pos.y + 0.86, z = pos.z + 0.5
  level.playSound(null, x, y, z, event, FieldSoundSource.BLOCKS, 0.65, 0.94 + Math.random() * 0.12)
  if(kind==='wash'){
    level.spawnParticles(FieldParticles.SPLASH, false, x-.18, y-.15, z, .16, .04, .08, 4, .02)
    level.server.scheduleInTicks(4,()=>level.spawnParticles(FieldParticles.SPLASH, false, x+.20, y-.20, z+.1, .13, .03, .05, 3, .014))
  }else{
    level.spawnParticles(fieldParticles[kind], false, x, y, z, .12, .09, .12, 4, kind === 'strike' ? 0.07 : 0.025)
    var chip=fieldChips[kind]
    if(chip){
      var material=new FieldItemParticle(FieldParticles.ITEM,Item.of(chip))
      level.server.scheduleInTicks(3,()=>level.spawnParticles(material, false, x, y-.05, z, .1, .04, .1, 3, .035))
    }
  }
}
const fieldCraftFamilies = {
  knap: ['scored_flint_core','flint_shard','lapped_edge','gtceu:flint_knife','pick_head','axe_head'],
  lash: ['retting_bundle','washed_fibre','fibre_cord','tool_binding','woven_drive_belt','hearth_bellows','braided_valve_packing'],
  cut: ['haft_blank','tool_handle','wooden_peg','rough_slat','wedged_tenon','workbench_frame','workbench_top',
    'minecraft:crafting_table','gtceu:flint_pickaxe','gtceu:flint_axe','gtceu:flint_saw','wooden_joint','wheel_segment','ore_washing_trough','fire_drill','turned_spindle'],
  ram: ['ramming_mix','wet_lining','green_tuyere','green_ingot_mould','unfired_clay_bucket','unfired_crucible',
    'kiln_grate','bloomery_masonry','bloomery_shoulder','bloomery_stack','bloomery_casting_basin','minecraft:furnace','gtceu:field_bloomery','copper_charge','tin_charge','iron_charge','gold_charge','bronze_charge'],
  mill: ['chamotte','sand_temper','grinding_runner','coarse_flour','copper_grit','iron_grit','tin_grit','gold_grit'],
  strike: ['lv_terminal_block','copper_strap','iron_rivet','hand_forged_plate','forging_saddle','shaft_bushing','gear_rim','saw_teeth',
    'saw_blade','hand_pump_barrel','bronze_mould_frame','stamped_bronze_blank','sealed_boiler_joint','five_tube_register',
    'boiler_tube_bank','valve_spindle_blank','bronze_valve_spindle','unseated_steam_valve','packed_steam_valve',
    'gtceu:lp_steam_solid_boiler','gtceu:lp_steam_macerator','gtceu:lp_steam_forge_hammer',
    'gtceu:lp_steam_furnace','gtceu:lp_steam_alloy_smelter','gtceu:lp_steam_compressor','gtceu:lp_steam_extractor',
    'gtceu:bronze_plate','gtceu:iron_plate','gtceu:tin_plate','gtceu:copper_plate','gtceu:gold_plate']
}
const fieldCraftSounds = {}
Object.entries(fieldCraftFamilies).forEach(([kind, names]) => {
  names.forEach(name => {fieldCraftSounds[name.includes(':') ? name : 'kubejs:' + name] = kind})
})
ItemEvents.crafted(event => {
  const kind = fieldCraftSounds[String(event.item.id)]
  if (kind) global.fieldworkEffect(event.player.level, event.player.blockPosition(), kind, event.player)
})
