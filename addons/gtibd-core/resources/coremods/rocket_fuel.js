function initializeCoreMod() {
    var ASMAPI = Java.type('net.minecraftforge.coremod.api.ASMAPI')
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var TypeInsnNode = Java.type('org.objectweb.asm.tree.TypeInsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode')
    var helper = 'gtibd/addon/RocketFuel'
    var vehicles = 'earth.terrarium.adastra.common.items.vehicles.'
    var botarium = 'earth/terrarium/botarium/common/fluid/'
    var simple = botarium + 'impl/SimpleFluidContainer'
    var stack = 'Lnet/minecraft/world/item/ItemStack;'
    var fluid = 'Lnet/minecraft/world/level/material/Fluid;'
    var context = 'Lnet/minecraft/world/item/context/UseOnContext;'
    var constructorArgs = 'JILjava/util/function/BiPredicate;'

    function findCall(method, owner, name, desc) {
        for (var i = 0; i < method.instructions.size(); i++) {
            var node = method.instructions.get(i)
            if (node instanceof MethodInsnNode && node.owner === owner && node.name === name && node.desc === desc) return node
        }
        throw new Error('Unsupported Ad Astra method ' + method.name + ': missing ' + owner + '.' + name)
    }

    return {
        rocketItemTank: {
            target: {type: 'METHOD', class: vehicles + 'VehicleItem', methodName: 'getFluidContainer',
                methodDesc: '(' + stack + ')L' + botarium + 'impl/WrappedItemFluidContainer;'},
            transformer: function(method) {
                var init = findCall(method, simple, '<init>', '(' + constructorArgs + ')V')
                // Replace only the inner tank allocation. Ad Astra still builds its native item/NBT wrapper.
                var allocation = init.getPrevious()
                while (allocation !== null && !(allocation instanceof TypeInsnNode &&
                        allocation.getOpcode() === Opcodes.NEW && allocation.desc === simple)) allocation = allocation.getPrevious()
                if (allocation === null || allocation.getNext().getOpcode() !== Opcodes.DUP) throw new Error('Unsupported Ad Astra tank allocation')
                method.instructions.remove(allocation.getNext())
                method.instructions.remove(allocation)
                method.instructions.insertBefore(init, new VarInsnNode(Opcodes.ALOAD, 1))
                method.instructions.set(init, new MethodInsnNode(Opcodes.INVOKESTATIC, helper, 'itemTank',
                    '(' + constructorArgs + stack + ')L' + simple + ';', false))
                return method
            }
        },
        rocketFuelTooltip: {
            target: {type: 'METHOD', class: vehicles + 'VehicleItem', methodName: ASMAPI.mapMethod('m_7373_'),
                methodDesc: '(' + stack + 'Lnet/minecraft/world/level/Level;Ljava/util/List;Lnet/minecraft/world/item/TooltipFlag;)V'},
            transformer: function(method) {
                var render = findCall(method, 'earth/terrarium/adastra/common/utils/TooltipUtils', 'getFluidComponent',
                    '(L' + botarium + 'base/FluidHolder;J' + fluid + ')Lnet/minecraft/network/chat/Component;')
                method.instructions.insertBefore(render, new VarInsnNode(Opcodes.ALOAD, 1))
                method.instructions.insertBefore(render, new MethodInsnNode(Opcodes.INVOKESTATIC, helper, 'emptyTankFluid',
                    '(' + fluid + stack + ')' + fluid, false))
                return method
            }
        },
        rocketPadFuel: {
            target: {type: 'METHOD', class: vehicles + 'RocketItem', methodName: ASMAPI.mapMethod('m_6225_'),
                methodDesc: '(' + context + ')Lnet/minecraft/world/InteractionResult;'},
            transformer: function(method) {
                var check = findCall(method, 'net/minecraft/world/level/block/state/BlockState', ASMAPI.mapMethod('m_204336_'),
                    '(Lnet/minecraft/tags/TagKey;)Z')
                var source = new VarInsnNode(Opcodes.ALOAD, 1)
                method.instructions.insert(check, source)
                method.instructions.insert(source, new MethodInsnNode(Opcodes.INVOKESTATIC, helper, 'canPlaceOnPad',
                    '(Z' + context + ')Z', false))
                return method
            }
        }
    }
}
