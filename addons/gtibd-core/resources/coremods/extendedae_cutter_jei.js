function initializeCoreMod() {
    var Opcodes = Java.type('org.objectweb.asm.Opcodes')
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList')
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode')
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode')
    var mod = 'com/glodblock/github/extendedae/'
    var recipe = mod + 'recipe/CircuitCutterRecipe'
    var amount = mod + 'recipe/util/IngredientStack'
    var ingredient = 'Lnet/minecraft/world/item/crafting/Ingredient;'
    return {
        circuitCutterItemCount: {
            target: {
                type: 'METHOD', class: 'com.glodblock.github.extendedae.xmod.jei.recipe.CircuitCutterCategory',
                methodName: 'setRecipe', methodDesc: '(Lmezz/jei/api/gui/builder/IRecipeLayoutBuilder;L' + recipe + ';Lmezz/jei/api/recipe/IFocusGroup;)V'
            },
            transformer: function(method) {
                for (var i = 0; i < method.instructions.size(); i++) {
                    var call = method.instructions.get(i)
                    if (!(call instanceof MethodInsnNode) || call.owner !== mod + 'xmod/jei/util/StackUtil' ||
                        call.name !== 'of' || call.desc !== '(L' + amount + '$Item;)' + ingredient) continue
                    var extra = new InsnList()
                    extra.add(new VarInsnNode(Opcodes.ALOAD, 2))
                    extra.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, recipe, 'getInput', '()L' + amount + '$Item;', false))
                    extra.add(new MethodInsnNode(Opcodes.INVOKEVIRTUAL, amount, 'getAmount', '()I', false))
                    extra.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'gtibd/addon/JeiRecipeAmounts', 'countedPreview',
                        '(' + ingredient + 'I)' + ingredient, false))
                    method.instructions.insert(call, extra)
                    return method
                }
                throw new Error('Unsupported ExtendedAE circuit cutter JEI input layout')
            }
        }
    }
}
