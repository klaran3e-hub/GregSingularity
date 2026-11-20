function initializeCoreMod() {
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var owner = 'earth/terrarium/adastra/common/recipes/SpaceStationRecipe'
    var player = 'Lnet/minecraft/world/entity/player/Player;'
    var level = 'Lnet/minecraft/world/level/Level;'
    var packet = 'earth/terrarium/adastra/common/network/messages/ServerboundConstructSpaceStationPacket'
    return {
        stationFreight: {
            target: {
                type: 'METHOD',
                class: packet.replace(/\//g, '.') + '$Type',
                methodName: 'lambda$handle$0',
                methodDesc: '(L' + packet + ';' + player + ')V'
            },
            transformer: function(method) {
                var check = null
                var consume = null
                for (var i = 0; i < method.instructions.size(); i++) {
                    var call = method.instructions.get(i)
                    if (!(call instanceof MethodInsnNode) || call.owner !== owner) continue
                    if (call.name === 'hasIngredients' && call.desc === '(' + player + level + 'L' + owner + ';)Z') check = call
                    if (call.name === 'consumeIngredients' && call.desc === '(' + player + level + ')V') consume = call
                }
                if (check === null || consume === null) throw new Error('Unsupported Ad Astra station payment routine')
                // Keep the native travel, dimension, menu and ownership checks surrounding these calls.
                method.instructions.set(check, new MethodInsnNode(Opcodes.INVOKESTATIC, 'gtibd/addon/StationFreight', 'pay', check.desc, false))
                method.instructions.set(consume, new InsnNode(Opcodes.POP2))
                return method
            }
        }
    }
}
