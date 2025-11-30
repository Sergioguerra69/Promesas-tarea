// Variables globales
let presupuesto = 0;
let gastos = [];

// Clase para representar un gasto
class CrearGasto {
  constructor(descripcion, valor = 0, fecha = new Date(), ...etiquetas) {
    this.descripcion = descripcion;
    this.valor = valor;
    this.fecha = isNaN(Date.parse(fecha)) ? Date.now() : Date.parse(fecha);
    this.etiquetas = etiquetas.length ? etiquetas : [];
    this.id = null; // Será asignado al añadir el gasto
  }

  mostrarGastoCompleto() {
    const fechaStr = new Date(this.fecha).toLocaleString();
    let etiquetasStr = this.etiquetas.map((e) => `- ${e}`).join("\n");
    if (etiquetasStr) etiquetasStr += "\n";
    return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${fechaStr}\nEtiquetas:\n${etiquetasStr}`;
  }

  actualizarFecha(nuevaFecha) {
    if (!isNaN(Date.parse(nuevaFecha))) {
      this.fecha = Date.parse(nuevaFecha);
    }
  }

  actualizarValor(nuevoValor) {
    this.valor = nuevoValor;
  }

  anyadirEtiquetas(...nuevasEtiquetas) {
    nuevasEtiquetas.forEach((e) => {
      if (!this.etiquetas.includes(e)) this.etiquetas.push(e);
    });
  }

  borrarEtiquetas(...etiquetasABorrar) {
    this.etiquetas = this.etiquetas.filter(
      (e) => !etiquetasABorrar.includes(e)
    );
  }
}

// Funciones de gestión del presupuesto y gastos
function actualizarPresupuesto(nuevoPresupuesto) {
  presupuesto = nuevoPresupuesto;
}

function mostrarPresupuesto() {
  return presupuesto;
}

function anyadirGasto(gasto) {
  gasto.id = gastos.length > 0 ? gastos[gastos.length - 1].id + 1 : 0;
  gastos.push(gasto);
}

function borrarGasto(id) {
  gastos = gastos.filter((g) => g.id !== id);
}

function listarGastos() {
  return gastos;
}

function calcularTotalGastos() {
  return gastos.reduce((acc, g) => acc + g.valor, 0);
}

function calcularBalance() {
  return presupuesto - calcularTotalGastos();
}

// Función para reiniciar gastos (útil en tests)
function reiniciarGastos() {
  gastos = [];
}

// Exportaciones
export {
  mostrarPresupuesto,
  actualizarPresupuesto,
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
  reiniciarGastos,
};
