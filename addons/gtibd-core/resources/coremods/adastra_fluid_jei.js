function initializeCoreMod() {
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode')
    var layout = 'Lmezz/jei/api/gui/builder/IRecipeLayoutBuilder;'
    var input = 'Learth/terrarium/botarium/common/fluid/utils/QuantifiedFluidIngredient;'
    var output = 'Learth/terrarium/botarium/common/fluid/base/FluidHolder;'

    function category(name) {
        var recipe = 'earth/terrarium/adastra/common/recipes/machines/' + name + 'Recipe'
        return {
            target: {
                type: 'METHOD', class: 'earth.terrarium.adastra.common.compat.jei.categories.' + name + 'Category',
                methodName: 'setRecipe', methodDesc: '(' + layout + 'L' + recipe + ';Lmezz/jei/api/recipe/IFocusGroup;)V'
            },
            transformer: function(method) {
                var code = new InsnList()
                code.add(new VarInsnNode(Opcodes.ALOAD, 1))
                code.add(new VarInsnNode(Opcodes.ALOAD, 2))
                code.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, recipe, 'input', '()' + input, false))
                code.add(new VarInsnNode(Opcodes.ALOAD, 2))
                code.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, recipe, 'result', '()' + output, false))
                code.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'gtibd/addon/JeiAdAstraFluids', 'index',
                    '(' + layout + input + output + ')V', false))
                method.instructions.insert(code)
                return method
            }
        }
    }
    return {oxygenLoadingFluidIndex: category('OxygenLoading'), refiningFluidIndex: category('Refining')}
}
