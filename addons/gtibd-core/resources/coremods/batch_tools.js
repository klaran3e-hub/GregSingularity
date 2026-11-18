function initializeCoreMod() {
    var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI')
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList')
    var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode')
    var TypeInsnNode = Java.type('org.objectweb.asm.tree.TypeInsnNode')
    var LdcInsnNode = Java.type('org.objectweb.asm.tree.LdcInsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode')
    var LabelNode = Java.type('org.objectweb.asm.tree.LabelNode')
    var stack = 'net/minecraft/world/item/ItemStack'
    var location = 'net/minecraft/resources/ResourceLocation'
    var tag = 'net/minecraft/tags/TagKey'

    return {
        batchTools: {
            target: {
                type: 'METHOD',
                class: 'mezz.jei.common.transfer.BasicRecipeTransferHandlerServer',
                methodName: 'lambda$getSlotStackLimit$0',
                methodDesc: '(Ljava/util/Map$Entry;)I'
            },
            transformer: function(method) {
                // JEI has already removed one tool and enough complete sets of materials.
                // Exclude reusable tools only from its final common insertion limit.
                // The actual per-slot insert still enforces the tool's stack size of one.
                for (var i = 0; i < method.instructions.size(); i++) {
                    var call = method.instructions.get(i)
                    if (!(call instanceof MethodInsnNode) || call.owner !== 'net/minecraft/world/inventory/Slot' ||
                        call.desc !== '(L' + stack + ';)I') continue
                    var code = new InsnList()
                    var normal = new LabelNode()
                    code.add(new InsnNode(Opcodes.DUP))
                    code.add(new TypeInsnNode(Opcodes.NEW, location))
                    code.add(new InsnNode(Opcodes.DUP))
                    code.add(new LdcInsnNode('zero_shift:reusable_crafting_tools'))
                    code.add(new MethodInsnNode(Opcodes.INVOKESPECIAL, location, '<init>', '(Ljava/lang/String;)V', false))
                    code.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'net/minecraft/tags/ItemTags', 'create', '(L' + location + ';)L' + tag + ';', false))
                    code.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, stack, ASMAPI.mapMethod('m_204117_'), '(L' + tag + ';)Z', false))
                    code.add(new JumpInsnNode(Opcodes.IFEQ, normal))
                    code.add(new InsnNode(Opcodes.POP2))
                    code.add(new (Java.type('org.objectweb.asm.tree.IntInsnNode'))(Opcodes.SIPUSH, 32767))
                    code.add(new InsnNode(Opcodes.IRETURN))
                    code.add(normal)
                    method.instructions.insertBefore(call, code)
                    return method
                }
                throw new Error('Unexpected JEI slot limit implementation')
            }
        }
    }
}
