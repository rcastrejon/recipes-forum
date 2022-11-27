interface RecipeForm {
    titulo: string,
    tiempo: number,
    costo: number,
    ingredientes: string,
    pasos: string
}

export function ConstructRecipe(recipe:RecipeForm):string{
    let recipeString = `## Tiempo de preparación\n\n`;
    recipeString += `${recipe.tiempo} minutos\n\n`;
    recipeString += `## Costo\n\n`;
    recipeString += `${recipe.costo} MXN\n\n`;
    recipeString += `## Ingredientes\n\n`;
    recipeString += BuildUnorderedList(recipe.ingredientes);
    recipeString += `## Pasos\n\n`;
    recipeString += BuildUnorderedList(recipe.pasos);

    return recipeString;
}

function BuildUnorderedList(list:string):string{
    let listString = '';
    let listArray = list.split(/,| \r\n|\n|\r /);

    listArray.forEach(element => {
        if(element != '')
            listString += `* ${element}\n`;
    });

    return listString;
}