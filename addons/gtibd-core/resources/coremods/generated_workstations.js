function initializeCoreMod() {
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList')
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var inputs = '(Lnet/minecraft/server/level/ServerLevel;Lnet/minecraft/world/level/chunk/ProtoChunk;'
    return {
        replaceGeneratedWorkstations: {
            target: {
                type: 'METHOD',
                class: 'net.minecraft.world.level.chunk.LevelChunk',
                methodName: '<init>',
                methodDesc: inputs + 'Lnet/minecraft/world/level/chunk/LevelChunk$PostLoadProcessor;)V'
            },
            transformer: function(method) {
                var prefix = new InsnList()
                prefix.add(new VarInsnNode(Opcodes.ALOAD, 1))
                prefix.add(new VarInsnNode(Opcodes.ALOAD, 2))
                prefix.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'gtibd/addon/GeneratedWorkstations',
                    'replace', inputs + ')V', false))
                method.instructions.insert(prefix)
                return method
            }
        }
    }
}
