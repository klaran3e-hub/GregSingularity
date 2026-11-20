ServerEvents.recipes(event=>{
  const k=id=>'kubejs:'+id, gt=id=>'gtceu:'+id, ad=id=>'ad_astra:'+id
  const process=(type,id)=>event.recipes.gtceu[type]('zero_shift:outer_space/'+id)
  const f=(id,n)=>Fluid.of(id,n)
  // Each blend uses equipment and cargo accessible before its destination.
  process('chemical_reactor','lunar_transfer_fuel').notConsumable(k('lunar_vacuum_seal'))
    .inputFluids(f(ad('fuel'),1000),f(k('chilled_vacuum_coolant'),250))
    .outputFluids(f(k('lunar_transfer_fuel'),1000),f(k('warm_vacuum_coolant'),250)).EUt(1920).duration(660)
  process('chemical_reactor','calorite_flight_gel').notConsumable(k('venus_thermal_screen'))
    .inputFluids(f(ad('cryo_fuel'),1000),f(k('mv_dielectric_oil'),250))
    .outputFluids(f(k('calorite_flight_gel'),1000)).EUt(24576).duration(920)
  process('chemical_reactor','survey_propellant').notConsumable(k('luv_cryo_cartridge'))
    .inputFluids(f(k('calorite_flight_gel'),1000),f(k('luv_optical_coolant'),500))
    .outputFluids(f(k('survey_propellant'),1000),f(k('luv_warm_optical_coolant'),500)).EUt(30720).duration(1120)
  process('mixer','europa_transfer_medium').itemInputs(k('luv_ceres_salt_concentrate'))
    .inputFluids(f(k('survey_propellant'),1000),f('gtceu:helium_plasma',250))
    .outputFluids(f(k('europa_transfer_medium'),1000)).EUt(114688).duration(1480)
  process('chemical_reactor','titan_flight_matrix').notConsumable(k('europa_phase_ceramic'))
    .inputFluids(f(k('europa_transfer_medium'),1000),f(k('vacuum_shield_gas'),750))
    .outputFluids(f(k('titan_flight_matrix'),1000)).EUt(491520).duration(1720)

  process('forming_press','europa_phase_ceramic').itemInputs(k('zpm_europa_membrane'),'2x gtceu:olivine_gem',
    k('zpm_glacio_lamella'),'2x gtceu:europium_plate').itemOutputs('2x '+k('europa_phase_ceramic'))
    .dimension('zero_shift:europa').EUt(122880).duration(1650)
  process('assembler','titan_load_standard').itemInputs(k('mill_titan_assay'),'4x gtceu:cassiterite_sand_dust',
    k('europa_phase_ceramic'),'2x gtceu:tritanium_plate',k('uv_phase_interlock'))
    .inputFluids(f(k('titan_flight_matrix'),750)).itemOutputs('2x '+k('titan_load_standard'))
    .dimension('zero_shift:titan').EUt(507904).duration(2100)

  const stages=[
    ['luv','surveyor','survey_drive',ad('tier_4_rocket'),k('luv_glacio_seed'),k('luv_venus_timing_prism'),'gtceu:hssg_plate','survey_propellant',30720],
    ['zpm','courier','courier_drive','gtibd_core:surveyor',k('glacio_reference_crystal'),k('luv_ceres_salt_concentrate'),'gtceu:naquadah_alloy_plate','europa_transfer_medium',122880],
    ['uv','freighter','freighter_drive','gtibd_core:courier',k('europa_phase_ceramic'),k('uv_phase_interlock'),'gtceu:tritanium_plate','titan_flight_matrix',507904]
  ]
  stages.forEach(([tier,ship,drive,previous,local,calibration,plate,fuel,eu],i)=>{
    const line = process('assembly_line', drive)
    const inputs = [gt(tier+'_machine_hull'), '2x '+gt(tier+'_electric_pump'), '2x '+gt(tier+'_electric_motor'),
      '2x '+gt(tier+'_sensor'), '4x '+gt(tier+'_field_generator'), '16x '+plate, '2x '+local,
      calibration, '4x kubejs:vacuum_gasket']
    for (const input of inputs) line.itemInputs(input)
    line.inputFluids(f(gt('lubricant'),2000+1000*i), f(gt('soldering_alloy'),2592+1728*i), f(k(fuel),1000*(i+1)))
      .itemOutputs(k(drive)).duration(4900+1220*i).EUt(eu)

    const tank = ad('calorite_tank'), fin = ad('rocket_fin')
    const parts = [ad('rocket_nose_cone'), previous, local, tank, tank, calibration, local,
      fin, tank, tank, fin, fin, k(drive), fin]
    event.custom({
      type: ad('nasa_workbench'),
      ingredients: parts.map(item => ({item: item})),
      result: {id: 'gtibd_core:'+ship, count: 1}
    }).id('zero_shift:outer_space/nasa_'+ship)
  })
})
