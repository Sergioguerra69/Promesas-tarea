// Variable global para el presupuesto
let presupuesto = 0;

// Función para actualizar el presupuesto
function actualizarPresupuesto(valor) {
  if (typeof valor === "number" && valor >= 0) {
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

// Función constructora para crear un gasto
function CrearGasto(descripcion, valor) {
  if (typeof valor !== "number" || valor < 0) {
    this.valor = 0;
  } else {
    this.valor = valor;
  }
  this.descripcion = descripcion;
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

CrearGasto.prototype.actualizarDescripcion = function (nuevaDesc) {
  this.descripcion = nuevaDesc;
};

CrearGasto.prototype.actualizarValor = function (nuevoValor) {
  if (typeof nuevoValor === "number" && nuevoValor >= 0) {
    this.valor = nuevoValor;
  }
};

export { actualizarPresupuesto, mostrarPresupuesto, CrearGasto };
