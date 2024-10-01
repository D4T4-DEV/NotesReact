const degresRotation: string[] = [
    'rotate(-2deg)',
    'rotate(2deg)'
];

export default function getRamdonDegrees(arregloDegrees?: string[]): string {

    // Definimos que si este dada la condición debe estar definido, si no, usamos el arreglo definido en el archivo
    const arregloUsado = (arregloDegrees && arregloDegrees.length > 0) ? arregloDegrees : degresRotation;

    // Calculamos un indice en base al tamaño de un arreglo
    const indiceAleatorio = Math.floor(Math.random() * arregloUsado.length);

    // Obtenemos los datos dentro de este
    return arregloUsado[indiceAleatorio];
}