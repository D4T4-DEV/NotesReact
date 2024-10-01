// tomado de ejemplo de:
// https://www.tutorialesprogramacionya.com/angulardevya/detalleconcepto.php?punto=64&codigo=64&inicio=60#:~:text=Si%20supera%20la%20longitud%20m%C3%A1xima,texto%20truncado%20es%20luego%20devuelto.

const truncateText = (text: string | undefined, maxLength: number): string | undefined => {
    // Compara si el tamaño en caracteres es mayor al tamaño indicado
    // si es asi, toma el primer caracter de la cadena y el ultimo que este 
    // ocupando la posicion del tamanio indicado y se le agrega ...

    if(!text) return 

    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
};

export default truncateText;