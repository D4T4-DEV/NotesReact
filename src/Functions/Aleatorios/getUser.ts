const userNames: string[] = [
    "Paco", "Antonio", "Jose", "Carlos", "David", "Benito",
    "Ana", "Maria", "Laura", "Sofia", "Isabel", "Lucia", "Elber"
];

export default function getUserRandom(arregloNombres?: string[]): string {

    // Definimos que si este dada la condición debe estar definido, si no, usamos el arreglo definido en el archivo
    const arregloUsado = (arregloNombres && arregloNombres.length > 0) ? arregloNombres : userNames;

    // Calculamos un indice en base al tamaño de un arreglo
    const indiceAleatorio = Math.floor(Math.random() * arregloUsado.length);

    // Obtenemos los datos dentro de este
    return arregloUsado[indiceAleatorio];
}