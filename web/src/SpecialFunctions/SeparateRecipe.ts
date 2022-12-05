export function getCosto(content:string):number {
    return parseInt(content.split('## Costo')[1].split(' ')[0]);
}

export function getTiempo(content:string) {
    return parseInt(content.split('## Tiempo de preparación')[1].split(' ')[0]);
}

export function getIngredientes(content:string):string {
    return content.split('## Ingredientes')[1].split('## Pasos')[0].replace(/(\r\n\r\n|\n\n\n\n|\r\r\r\r)/, "");
}

export function getPasos(content:string):string {
    return content.split('## Pasos')[1].replace(/(\r\n\r\n|\n\n\n\n|\r\r\r\r)/, "");
}