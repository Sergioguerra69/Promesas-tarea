// Función para calcular la letra del NIF/NIE
function comprobarNifNie(nif) {
    var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];

    // Convertimos a mayúsculas
    let nifMay = nif.toUpperCase();

    // Para tratar el NIE
    let primeraLetra = nifMay.substr(0,1);

    // Última letra, para comprobación
    let letraNIF = nifMay.substring(8, 9);

    // Para almacenar el número
    let numNIF;

    // Si el primer carácter no es un número (NIE),
    // sustituimos por su número equivalente de acuerdo al algoritmo del NIE
    if (isNaN(primeraLetra)) {
	switch (primeraLetra) {
	    case "X":
		numNIF = "0";
		break;
	    case "Y":
		numNIF = "1";
		break;
	    case "Z":
		numNIF = "2";
		break;
	    default:
	}
	numNIF += nifMay.substring(1,8);
    } else {
	numNIF = nifMay.substring(0,8);
    }

    // Convertimos a número
    numNIF = parseInt(numNIF);

    // Calculamos la letra que corresponde a partir del número
    // Cogemos el resto de dividir el número del NIF entre 23
    // El resultado nos da la posición del array 'letras' donde
    // se encuentra la letra asociada a dicho número
    let letraCalculada = letras[numNIF % 23];

    // Comprobamos si coincide con la letra indicada en el formulario
    if (letraCalculada === letraNIF) {
	return true;
    } else {
	return false;
    }
}
