import {
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  crearDatosPrueba,
} from "./gestionPresupuesto.js";

// Debug
console.log("Módulo cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM cargado - iniciando aplicación");
  crearDatosPrueba();
  crearFormulario();
  actualizarInterfaz();
});

function crearFormulario() {
  const container = document.getElementById("formulario-container");
  const hoy = new Date().toISOString().split("T")[0];

  const form = document.createElement("form");
  form.innerHTML = `
    <div class="form-group">
      <label>Descripción:</label>
      <input type="text" id="descripcion" required>
    </div>
    <div class="form-group">
      <label>Valor:</label>
      <input type="number" id="valor" step="0.01" min="0.01" required>
    </div>
    <div class="form-group">
      <label>Fecha:</label>
      <input type="date" id="fecha" value="${hoy}" required>
    </div>
    <div class="form-group">
      <label>Etiquetas (separadas por comas):</label>
      <input type="text" id="etiquetas" placeholder="comida, transporte...">
    </div>
    <button type="submit">Añadir Gasto</button>
  `;

  container.appendChild(form);

  form.onsubmit = function (e) {
    e.preventDefault();

    const descripcion = document.getElementById("descripcion").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const fecha = document.getElementById("fecha").value;
    const etiquetasTexto = document.getElementById("etiquetas").value;

    const etiquetas = etiquetasTexto
      ? etiquetasTexto
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e)
      : [];

    if (descripcion && valor > 0 && fecha) {
      const gasto = new CrearGasto(descripcion, valor, fecha, ...etiquetas);
      anyadirGasto(gasto);
      actualizarInterfaz();
      form.reset();
      document.getElementById("fecha").value = hoy;
    }
  };
}

function actualizarInterfaz() {
  actualizarTotal();
  actualizarListado();
}

function actualizarTotal() {
  const total = calcularTotalGastos();
  document.getElementById("total").textContent = total.toFixed(2);
}

function actualizarListado() {
  const container = document.getElementById("listado-gastos");
  const gastos = listarGastos();

  // Limpiar contenedor (mantener título)
  const titulo = container.querySelector("h2");
  container.innerHTML = "";
  container.appendChild(titulo);

  if (gastos.length === 0) {
    container.innerHTML += "<p>No hay gastos registrados.</p>";
    return;
  }

  gastos.forEach((gasto) => {
    const div = document.createElement("div");
    div.className = "gasto-item";

    const fecha = new Date(gasto.fecha).toLocaleDateString("es-ES");

    div.innerHTML = `
      <div>
        <strong>${gasto.descripcion}</strong> - ${gasto.valor.toFixed(
      2
    )} € (${fecha})
        ${
          gasto.etiquetas && gasto.etiquetas.length > 0
            ? `<div class="etiquetas">${gasto.etiquetas
                .map((e) => `<span class="etiqueta">${e}</span>`)
                .join("")}</div>`
            : ""
        }
      </div>
      <button class="btn-borrar" data-id="${gasto.id}">Borrar</button>
    `;

    container.appendChild(div);
  });

  document.querySelectorAll(".btn-borrar").forEach((btn) => {
    btn.onclick = function () {
      if (confirm("¿Está seguro de que desea borrar este gasto?")) {
        borrarGasto(parseInt(this.dataset.id));
        actualizarInterfaz();
      }
    };
  });
}
