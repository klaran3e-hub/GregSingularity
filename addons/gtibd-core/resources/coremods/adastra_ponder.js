function initializeCoreMod() {
    var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI')
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList')
    var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode')
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var LdcInsnNode = Java.type('org.objectweb.asm.tree.LdcInsnNode')
    var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode')
    var LabelNode = Java.type('org.objectweb.asm.tree.LabelNode')
    var FrameNode = Java.type('org.objectweb.asm.tree.FrameNode')
    return {
        skipAdAstraTickersInPonder: {
            target: {
                type: 'METHOD',
                class: 'earth.terrarium.adastra.common.blocks.base.BasicEntityBlock',
                methodName: ASMAPI.mapMethod('m_142354_'),
                methodDesc: '(Lnet/minecraft/world/level/Level;Lnet/minecraft/world/level/block/state/BlockState;' +
                    'Lnet/minecraft/world/level/block/entity/BlockEntityType;)Lnet/minecraft/world/level/block/entity/BlockEntityTicker;'
            },
            transformer: function(method) {
                var normalWorld = new LabelNode()
                var guard = new InsnList()
                // Ad Astra's client ticker casts its level to ClientLevel. Ponder draws blocks in its own level.
                guard.add(new VarInsnNode(Opcodes.ALOAD, 1))
                guard.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, 'java/lang/Object', 'getClass', '()Ljava/lang/Class;', false))
                guard.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, 'java/lang/Class', 'getName', '()Ljava/lang/String;', false))
                guard.add(new LdcInsnNode('net.createmod.ponder.api.level.PonderLevel'))
                guard.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, 'java/lang/String', 'equals', '(Ljava/lang/Object;)Z', false))
                guard.add(new JumpInsnNode(Opcodes.IFEQ, normalWorld))
                guard.add(new InsnNode(Opcodes.ACONST_NULL))
                guard.add(new InsnNode(Opcodes.ARETURN))
                guard.add(normalWorld)
                guard.add(new FrameNode(Opcodes.F_SAME, 0, null, 0, null))
                method.instructions.insert(guard)
                return method
            }
        }
    }
}
