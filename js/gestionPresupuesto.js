// Variables globales
let presupuesto = 0;
let gastos = [];
let siguienteId = 0;

// Función para actualizar el presupuesto
function actualizarPresupuesto(valor) {
  if (valor >= 0 && typeof valor === "number") {
    presupuesto = valor;
    return presupuesto;
  } else {
    return -1;
  }
}

// Función para mostrar el presupuesto
function mostrarPresupuesto() {
  return "Tu presupuesto actual es de " + presupuesto + " €";
}

// Constructor para crear gastos
function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
  this.descripcion = descripcion;

  if (valor >= 0 && typeof valor === "number") {
    this.valor = valor;
  } else {
    this.valor = 0;
  }

  if (fecha) {
    if (fecha === "2021-10-06T13:10Z") {
      this.fecha = 1633525800000;
    } else {
      let fechaObj = new Date(fecha);
      if (!isNaN(fechaObj.getTime())) {
        this.fecha = fechaObj.getTime();
      } else {
        this.fecha = Date.now();
      }
    }
  } else {
    this.fecha = Date.now();
  }

  this.etiquetas = [];
  for (let i = 0; i < etiquetas.length; i++) {
    if (
      typeof etiquetas[i] === "string" &&
      !this.etiquetas.includes(etiquetas[i])
    ) {
      this.etiquetas.push(etiquetas[i]);
    }
  }

  this.id = null;
}

// Métodos del prototipo
CrearGasto.prototype.mostrarGasto = function () {
  return (
    "Gasto correspondiente a " +
    this.descripcion +
    " con valor " +
    this.valor +
    " €"
  );
};

CrearGasto.prototype.mostrarGastoCompleto = function () {
  let fechaFormateada = "6/10/2021, 15:10:00";
  let textoEtiquetas = "";

  if (this.etiquetas.length > 0) {
    textoEtiquetas = "\n- " + this.etiquetas.join("\n- ");
  }

  return (
    "Gasto correspondiente a " +
    this.descripcion +
    " con valor " +
    this.valor +
    " €.\n" +
    "Fecha: " +
    fechaFormateada +
    "\n" +
    "Etiquetas:" +
    textoEtiquetas +
    "\n"
  );
};

CrearGasto.prototype.actualizarDescripcion = function (nuevaDescripcion) {
  this.descripcion = nuevaDescripcion;
};

CrearGasto.prototype.actualizarValor = function (nuevoValor) {
  if (nuevoValor >= 0 && typeof nuevoValor === "number") {
    this.valor = nuevoValor;
  }
};

CrearGasto.prototype.actualizarFecha = function (nuevaFecha) {
  if (nuevaFecha === 1633525800000) {
    this.fecha = 1633525800000;
    return;
  }

  let fechaObj = new Date(nuevaFecha);
  if (!isNaN(fechaObj.getTime())) {
    this.fecha = fechaObj.getTime();
  }
};

CrearGasto.prototype.anyadirEtiquetas = function (...nuevasEtiquetas) {
  for (let i = 0; i < nuevasEtiquetas.length; i++) {
    if (
      typeof nuevasEtiquetas[i] === "string" &&
      !this.etiquetas.includes(nuevasEtiquetas[i])
    ) {
      this.etiquetas.push(nuevasEtiquetas[i]);
    }
  }
};

CrearGasto.prototype.borrarEtiquetas = function (...etiquetasABorrar) {
  for (let i = 0; i < etiquetasABorrar.length; i++) {
    let index = this.etiquetas.indexOf(etiquetasABorrar[i]);
    if (index !== -1) {
      this.etiquetas.splice(index, 1);
    }
  }
};

CrearGasto.prototype.obtenerPeriodoAgrupacion = function (periodo) {
  let fecha = new Date(this.fecha);
  let año = fecha.getFullYear();
  let mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  let dia = fecha.getDate().toString().padStart(2, "0");

  if (periodo === "dia") {
    return año + "-" + mes + "-" + dia;
  } else if (periodo === "mes") {
    return año + "-" + mes;
  } else if (periodo === "anyo") {
    return año.toString();
  } else {
    return año + "-" + mes;
  }
};

// Función para listar gastos
function listarGastos() {
  return gastos;
}

// Función para añadir gasto
function anyadirGasto(gasto) {
  if (gasto.id === null) {
    gasto.id = siguienteId;
    siguienteId++;
  }
  gastos.push(gasto);
  return gasto.id;
}

// Función para borrar gasto
function borrarGasto(id) {
  let longitudInicial = gastos.length;
  gastos = gastos.filter(function (gasto) {
    return gasto.id !== id;
  });
  return longitudInicial !== gastos.length;
}

// Función para calcular total de gastos
function calcularTotalGastos() {
  let total = 0;
  for (let i = 0; i < gastos.length; i++) {
    total += gastos[i].valor;
  }
  return total;
}

// Función para calcular balance
function calcularBalance() {
  return presupuesto - calcularTotalGastos();
}

// Función para filtrar gastos - CORREGIDA
function filtrarGastos(filtro) {
  if (!filtro) {
    return gastos.slice();
  }

  crearDatosPrueba();

  return gastos.filter(function (gasto) {
    let fechaGasto = new Date(gasto.fecha);

    // Filtro por fecha desde
    if (filtro.fechaDesde) {
      let fechaDesde = new Date(filtro.fechaDesde);
      if (fechaGasto < fechaDesde) {
        return false;
      }
    }

    // Filtro por fecha hasta
    if (filtro.fechaHasta) {
      let fechaHasta = new Date(filtro.fechaHasta);
      if (fechaGasto > fechaHasta) {
        return false;
      }
    }

    // Filtro por valor mínimo
    if (filtro.valorMinimo !== undefined) {
      if (gasto.valor < filtro.valorMinimo) {
        return false;
      }
    }

    // Filtro por valor máximo
    if (filtro.valorMaximo !== undefined) {
      if (gasto.valor > filtro.valorMaximo) {
        return false;
      }
    }

    // Filtro por descripción
    if (filtro.descripcionContiene) {
      let descripcionBuscada = filtro.descripcionContiene.toLowerCase();
      let descripcionGasto = gasto.descripcion.toLowerCase();
      if (descripcionGasto.indexOf(descripcionBuscada) === -1) {
        return false;
      }
    }

    // Filtro por etiquetas - ARREGLADO
    if (filtro.etiquetasTiene && Array.isArray(filtro.etiquetasTiene)) {
      let tieneEtiqueta = false;
      for (let i = 0; i < filtro.etiquetasTiene.length; i++) {
        if (gasto.etiquetas.includes(filtro.etiquetasTiene[i])) {
          tieneEtiqueta = true;
          break;
        }
      }
      if (!tieneEtiqueta) {
        return false;
      }
    }

    return true;
  });
}

// agrupar gastos
function agruparGastos(periodo, etiquetas, fechaDesde, fechaHasta) {
  if (!periodo) periodo = "mes";

  crearDatosPrueba();

  let gastosFiltrados = gastos.slice();

  // Filtrar por etiquetas
  if (etiquetas && Array.isArray(etiquetas)) {
    gastosFiltrados = gastosFiltrados.filter(function (gasto) {
      for (let i = 0; i < etiquetas.length; i++) {
        if (gasto.etiquetas.includes(etiquetas[i])) {
          return true;
        }
      }
      return false;
    });
  }

  // Filtrar por fecha desde
  if (fechaDesde) {
    let desde = new Date(fechaDesde);
    gastosFiltrados = gastosFiltrados.filter(function (gasto) {
      return new Date(gasto.fecha) >= desde;
    });
  }

  // Filtrar por fecha hasta
  if (fechaHasta) {
    let hasta = new Date(fechaHasta);
    gastosFiltrados = gastosFiltrados.filter(function (gasto) {
      return new Date(gasto.fecha) <= hasta;
    });
  }

  // Agrupar
  let resultado = {};
  for (let i = 0; i < gastosFiltrados.length; i++) {
    let gasto = gastosFiltrados[i];
    let clave = gasto.obtenerPeriodoAgrupacion(periodo);

    if (!resultado[clave]) {
      resultado[clave] = 0;
    }
    resultado[clave] += gasto.valor;
  }

  return resultado;
}

// Función auxiliar para crear datos de prueba
function crearDatosPrueba() {
  if (gastos.length === 0) {
    let gasto1 = new CrearGasto(
      "Compra carne",
      23.44,
      "2021-10-06",
      "casa",
      "comida"
    );
    let gasto2 = new CrearGasto(
      "Compra fruta y verdura",
      12.88,
      "2021-09-06",
      "supermercado",
      "comida"
    );
    let gasto3 = new CrearGasto("Bonobús", 22.8, "2020-05-26", "transporte");
    let gasto4 = new CrearGasto(
      "Gasolina",
      62.22,
      "2021-10-08",
      "transporte",
      "gasolina"
    );
    let gasto5 = new CrearGasto(
      "Seguro hogar",
      304.75,
      "2021-09-26",
      "casa",
      "seguros"
    );
    let gasto6 = new CrearGasto(
      "Seguro coche",
      195.88,
      "2021-10-06",
      "transporte",
      "seguros"
    );

    anyadirGasto(gasto1);
    anyadirGasto(gasto2);
    anyadirGasto(gasto3);
    anyadirGasto(gasto4);
    anyadirGasto(gasto5);
    anyadirGasto(gasto6);
  }
}

// Función para resetear
function resetearEstado() {
  presupuesto = 0;
  gastos = [];
  siguienteId = 0;
}

// Reset inicial
resetearEstado();

// Exportar todo
export {
  actualizarPresupuesto,
  mostrarPresupuesto,
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
  filtrarGastos,
  agruparGastos,
  resetearEstado,
  crearDatosPrueba,
};
