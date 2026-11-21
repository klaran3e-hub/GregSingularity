function initializeCoreMod() {
    var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI')
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList')
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode')
    var FieldInsnNode = Java.type('org.objectweb.asm.tree.FieldInsnNode')
    var TypeInsnNode = Java.type('org.objectweb.asm.tree.TypeInsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var screen = 'net/minecraft/client/gui/screens/inventory/CreativeModeInventoryScreen'
    var menu = screen + '$ItemPickerMenu'
    var tab = 'Lnet/minecraft/world/item/CreativeModeTab;'
    var editBox = 'Lnet/minecraft/client/gui/components/EditBox;'

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
        },
        includeGregSingularityRocketsInCreativeSearch: {
            target: {
                type: 'METHOD',
                class: screen.replace(/\//g, '.'),
                methodName: ASMAPI.mapMethod('m_98630_'),
                methodDesc: '()V'
            },
            transformer: function(method) {
                for (var i = 0; i < method.instructions.size(); i++) {
                    var call = method.instructions.get(i)
                    if (!(call instanceof MethodInsnNode) || call.owner !== menu ||
                        call.name !== ASMAPI.mapMethod('m_98642_') || call.desc !== '(F)V') continue

                    // Some search providers omit modded stacks. Fill the seven known aliases before the menu lays out its slots.
                    var hook = new InsnList()
                    hook.add(new FieldInsnNode(Opcodes.GETSTATIC, screen, ASMAPI.mapField('f_98507_'), tab))
                    hook.add(new VarInsnNode(Opcodes.ALOAD, 0))
                    hook.add(new FieldInsnNode(Opcodes.GETFIELD, screen, ASMAPI.mapField('f_98510_'), editBox))
                    hook.add(new VarInsnNode(Opcodes.ALOAD, 0))
                    hook.add(new FieldInsnNode(Opcodes.GETFIELD, screen, ASMAPI.mapField('f_97732_'),
                        'Lnet/minecraft/world/inventory/AbstractContainerMenu;'))
                    hook.add(new TypeInsnNode(Opcodes.CHECKCAST, menu))
                    hook.add(new FieldInsnNode(Opcodes.GETFIELD, menu, ASMAPI.mapField('f_98639_'), 'Lnet/minecraft/core/NonNullList;'))
                    hook.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'gtibd/addon/FieldworkSpaceClient', 'appendCreativeRockets',
                        '(' + tab + editBox + 'Ljava/util/List;)V', false))
                    method.instructions.insertBefore(call, hook)
                    return method
                }
                ASMAPI.log('WARN', 'Forge creative inventory did not expose its search results for GregSingularity')
                return method
            }
        }
    }
}
