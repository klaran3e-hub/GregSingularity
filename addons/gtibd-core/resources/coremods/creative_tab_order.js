function initializeCoreMod() {
    var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI')
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')

    return {
        groupCreativeSections: {
            target: {
                type: 'METHOD',
                class: 'net.minecraft.client.gui.screens.inventory.CreativeModeInventoryScreen',
                methodName: ASMAPI.mapMethod('m_7856_'),
                methodDesc: '()V'
            },
            transformer: function(method) {
                for (var i = 0; i < method.instructions.size(); i++) {
                    var call = method.instructions.get(i)
                    if (!(call instanceof MethodInsnNode) ||
                        call.owner !== 'net/minecraftforge/common/CreativeModeTabRegistry' ||
                        call.name !== 'getSortedCreativeModeTabs' || call.desc !== '()Ljava/util/List;') continue
                    method.instructions.insert(call, new MethodInsnNode(Opcodes.INVOKESTATIC,
                        'gtibd/addon/CreativeTabOrder', 'groupSections',
                        '(Ljava/util/List;)Ljava/util/List;', false))
                    return method
                }
                ASMAPI.log('WARN', 'Forge creative inventory did not expose a sorted tab list for GregSingularity')
                return method
            }
        }
    }
}
