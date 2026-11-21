function initializeCoreMod() {
    var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI')
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList')
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var context = 'Lnet/minecraft/client/renderer/entity/EntityRendererProvider$Context;'

    return {
        useGregSingularityRocketModels: {
            target: {
                type: 'METHOD',
                class: 'net.minecraft.client.renderer.entity.EntityRenderers',
                methodName: ASMAPI.mapMethod('m_174049_'),
                methodDesc: '(' + context + ')Ljava/util/Map;'
            },
            transformer: function(method) {
                var instructions = method.instructions.toArray()
                for (var i = 0; i < instructions.length; i++) {
                    if (instructions[i].getOpcode() !== Opcodes.ARETURN) continue
                    // Ad Astra also registers native renderers late. Swap those four entries after construction.
                    var hook = new InsnList()
                    hook.add(new VarInsnNode(Opcodes.ALOAD, 0))
                    hook.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'gtibd/addon/FieldworkSpaceClient',
                        'replaceNativeRocketRenderers', '(Ljava/util/Map;' + context + ')Ljava/util/Map;', false))
                    method.instructions.insertBefore(instructions[i], hook)
                }
                return method
            }
        }
    }
}
