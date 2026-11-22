StartupEvents.registry('item', event => {
  for (const part of ['lv_terminal_block', 'lv_contact_bridge', 'lv_line_contactor']) {
    event.create(global.gsItemId(part)).texture('kubejs:item/' + part)
  }
})
