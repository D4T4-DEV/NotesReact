// Colores de las notas 
export const ColorNotes: string[] = [
    '#f7941d', '#ffeb3b', '#bc8dbf', '#abd474', '#f49abf', '#6dd0f7', '#ECEE81', '#8DDFCB', '#82A0D8', '#EDB7ED',
    '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#ff99c8', '#d4a5a5',
    '#fce7b9', '#d0f4de', '#a3c4bc', '#f2e1c1', '#e4c1f9', '#d3ab9e', '#ffe5b4', '#c9f9cc', '#f0a5a7', '#a0e7e5',
    '#b4f8c8', '#f39ac7', '#ffdac1', '#ffecb3', '#ffccbc', '#d1c4e9', '#c5cae9', '#bbdefb', '#b2ebf2', '#b2dfdb',
    '#c8e6c9', '#dcf8c6', '#f1f8e9', '#f3e5f5', '#f8bbd0', '#fff9c4', '#fff8e1', '#fafafa', '#f3e5ab', '#f5e0d3',
    '#ebd7d7', '#ffccb3', '#ffe0b2', '#ffccbc', '#ffd54f', '#ffe57f', '#ffb74d', '#ff8a65', '#ff6e40', '#ffcc80'
];

// Conjunto de datos (colores), usados para almacenarse para evitar la repeticion
const coloresUsados: Set<string> = new Set();


// Funcion para obtener un color aleatorio y evitar la repeticion 
export default function getColorNoteRamdon(arregloColores?: string[]): string | undefined {


    // Verificamos que si se paso algo por la funcion se utilice, si no utilice el arreglo por defecto
    const arregloUsado = (arregloColores && arregloColores.length > 0) ? arregloColores : ColorNotes;

    // Cada que se ejecuta la funcion, creara un nuevo arreglo de datos, el cual, los/el color(es) que se haya(n) seleccionado 
    // no se incluran en el arreglo
    // 'has' devuelve true, si en el arreglo que pasamos existen los colores almacenados en el conjunto de datos

    // Filtramos los datos, obtenemos solo los colores que no esten en el conjunto
    const coloresDisponibles = arregloUsado.filter(color => !coloresUsados.has(color));

    // Si no tenemos ya opciones, restablecemos el conjunto de datos y llamamos a la funcion
    if (coloresDisponibles.length === 0) {
        // Limpiamos el conjunto
        coloresUsados.clear();
        // Llamamos a la funcion para obtener un valor y trabajar de nueva cuenta con los colores
        return getColorNoteRamdon(arregloColores);
    }

    // Calculamos el indice para el arreglo
    const indiceAleatorio = Math.floor(Math.random() * coloresDisponibles.length);

    // Apartir del indice tomamos el color 
    const colorSeleccionado = coloresDisponibles[indiceAleatorio];

    // Añadimos al conjunto de datos el color que salio de manera aleatoria
    coloresUsados.add(colorSeleccionado);

    return colorSeleccionado;
}

// Funcion set fue tomada de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

// Funcion que puede repetir los colores
export function getColorNoteRamdonWithRepeat(arregloColores?: string[]): string {

    // Definimos que si este dada la condición debe estar definido, si no, usamos el arreglo definido en el archivo
    const arregloUsado = (arregloColores && arregloColores.length > 0) ? arregloColores : ColorNotes;

    // Calculamos un indice en base al tamaño de un arreglo
    const indiceAleatorio = Math.floor(Math.random() * arregloUsado.length);

    // Obtenemos los datos dentro de este
    return arregloUsado[indiceAleatorio];
}