import {
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
} from "./gestionPresupuesto.js";

// COMPONENTE WEB PERSONALIZADO
class GastoComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.gasto = null;
  }

  setGastoData(gasto) {
    this.gasto = gasto;
    this.render();
  }

  render() {
    if (!this.gasto) return;

    const template = document.getElementById("template-gasto");
    const content = template.content.cloneNode(true);

    // CSS  para el Shadow DOM
    const styles = `
            <style>
                .gasto-item {
                    border: 1px solid #ddd;
                    padding: 15px;
                    margin-bottom: 15px;
                    background: white;
                }

                .gasto-descripcion {
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 5px;
                }

                .gasto-valor {
                    color: #e74c3c;
                    font-weight: bold;
                    margin: 5px 0;
                }

                .gasto-fecha {
                    color: #666;
                    margin: 5px 0;
                }

                .etiquetas-container {
                    margin: 10px 0;
                }

                .etiqueta {
                    display: inline-block;
                    background: #f0f0f0;
                    padding: 3px 8px;
                    border-radius: 10px;
                    font-size: 0.8em;
                    margin-right: 5px;
                    margin-bottom: 5px;
                }

                .acciones {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }

                .btn-editar, .btn-borrar, .btn-guardar, .btn-cancelar {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .btn-editar {
                    background: #3498db;
                    color: white;
                }

                .btn-borrar {
                    background: #e74c3c;
                    color: white;
                }

                .btn-guardar {
                    background: #27ae60;
                    color: white;
                }

                .btn-cancelar {
                    background: #95a5a6;
                    color: white;
                }

                .formulario-edicion {
                    background: #f9f9f9;
                    padding: 15px;
                    margin-top: 15px;
                    border-left: 3px solid #3498db;
                }

                .form-group {
                    margin-bottom: 10px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }

                .form-group input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                .hidden {
                    display: none;
                }
            </style>
        `;

    this.shadowRoot.innerHTML = styles;
    this.shadowRoot.appendChild(content);
    this.actualizarVista();
    this.configurarEventos();
  }

  actualizarVista() {
    if (!this.gasto) return;

    this.shadowRoot.querySelector(".gasto-descripcion").textContent =
      this.gasto.descripcion;
    this.shadowRoot.querySelector(
      ".gasto-valor"
    ).textContent = `${this.gasto.valor.toFixed(2)} €`;

    const fecha = new Date(this.gasto.fecha);
    const fechaFormateada = fecha.toLocaleDateString("es-ES");
    this.shadowRoot.querySelector(
      ".gasto-fecha"
    ).textContent = `Fecha: ${fechaFormateada}`;

    const etiquetasContainer = this.shadowRoot.querySelector(
      ".etiquetas-container"
    );
    etiquetasContainer.innerHTML = "";
    if (this.gasto.etiquetas && this.gasto.etiquetas.length > 0) {
      this.gasto.etiquetas.forEach((etiqueta) => {
        const span = document.createElement("span");
        span.className = "etiqueta";
        span.textContent = etiqueta;
        etiquetasContainer.appendChild(span);
      });
    }
  }

  configurarEventos() {
    this.shadowRoot
      .querySelector(".btn-editar")
      .addEventListener("click", () => {
        this.mostrarFormularioEdicion();
      });

    this.shadowRoot
      .querySelector(".btn-borrar")
      .addEventListener("click", () => {
        this.eliminarGasto();
      });

    this.shadowRoot
      .querySelector(".btn-guardar")
      .addEventListener("click", () => {
        this.guardarCambios();
      });

    this.shadowRoot
      .querySelector(".btn-cancelar")
      .addEventListener("click", () => {
        this.ocultarFormularioEdicion();
      });
  }

  mostrarFormularioEdicion() {
    const form = this.shadowRoot.querySelector(".formulario-edicion");
    form.classList.remove("hidden");

    this.shadowRoot.querySelector(".edit-descripcion").value =
      this.gasto.descripcion;
    this.shadowRoot.querySelector(".edit-valor").value = this.gasto.valor;

    const fecha = new Date(this.gasto.fecha);
    const fechaInput = fecha.toISOString().split("T")[0];
    this.shadowRoot.querySelector(".edit-fecha").value = fechaInput;

    this.shadowRoot.querySelector(".edit-etiquetas").value = this.gasto
      .etiquetas
      ? this.gasto.etiquetas.join(", ")
      : "";
  }

  ocultarFormularioEdicion() {
    const form = this.shadowRoot.querySelector(".formulario-edicion");
    form.classList.add("hidden");
  }

  eliminarGasto() {
    if (confirm("¿Estás seguro de que quieres eliminar este gasto?")) {
      this.dispatchEvent(
        new CustomEvent("gasto-eliminado", {
          detail: { id: this.gasto.id },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  guardarCambios() {
    const descripcion =
      this.shadowRoot.querySelector(".edit-descripcion").value;
    const valor = parseFloat(
      this.shadowRoot.querySelector(".edit-valor").value
    );
    const fecha = this.shadowRoot.querySelector(".edit-fecha").value;
    const etiquetas = this.shadowRoot.querySelector(".edit-etiquetas").value;

    if (!descripcion || !valor || !fecha) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (isNaN(valor) || valor <= 0) {
      alert("Por favor, introduce un valor válido");
      return;
    }

    this.dispatchEvent(
      new CustomEvent("gasto-actualizado", {
        detail: {
          id: this.gasto.id,
          descripcion,
          valor,
          fecha,
          etiquetas,
        },
        bubbles: true,
        composed: true,
      })
    );

    this.ocultarFormularioEdicion();
  }
}

// Registrar el componente personalizado
customElements.define("gasto-component", GastoComponent);

// CLASE PRINCIPAL DE LA APLICACIÓN V2
class GestionPresupuestoWebV2 {
  constructor() {
    this.init();
  }

  init() {
    actualizarPresupuesto(1000);
    crearDatosPrueba();

    this.crearFormulario();
    this.actualizarVista();

    document.addEventListener("gasto-eliminado", (e) => {
      this.eliminarGasto(e.detail.id);
    });

    document.addEventListener("gasto-actualizado", (e) => {
      this.actualizarGasto(e.detail);
    });
  }

  crearFormulario() {
    const container = document.getElementById("formulario-container");

    const form = document.createElement("form");
    form.id = "form-nuevo-gasto";
    form.innerHTML = `
            <div class="form-group">
                <label for="descripcion">Descripción:</label>
                <input type="text" id="descripcion" required />
            </div>
            <div class="form-group">
                <label for="valor">Valor (€):</label>
                <input type="number" id="valor" step="0.01" min="0.01" required />
            </div>
            <div class="form-group">
                <label for="fecha">Fecha:</label>
                <input type="date" id="fecha" required />
            </div>
            <div class="form-group">
                <label for="etiquetas">Etiquetas (separadas por comas):</label>
                <input type="text" id="etiquetas" placeholder="comida, transporte, ocio..." />
            </div>
            <button type="submit">Añadir Gasto</button>
        `;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.agregarGasto();
    });

    container.appendChild(form);
    document.getElementById("fecha").valueAsDate = new Date();
  }

  agregarGasto() {
    const descripcion = document.getElementById("descripcion").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const fecha = document.getElementById("fecha").value;
    const etiquetas = document.getElementById("etiquetas").value;

    if (!descripcion || !valor || !fecha) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (isNaN(valor) || valor <= 0) {
      alert("Por favor, introduce un valor válido");
      return;
    }

    const nuevoGasto = new CrearGasto(
      descripcion,
      valor,
      fecha,
      ...etiquetas.split(",").map((e) => e.trim())
    );
    anyadirGasto(nuevoGasto);

    this.actualizarVista();
    document.getElementById("form-nuevo-gasto").reset();
    document.getElementById("fecha").valueAsDate = new Date();
  }

  eliminarGasto(id) {
    borrarGasto(id);
    this.actualizarVista();
  }

  actualizarGasto(datos) {
    const gastos = listarGastos();
    const gastoExistente = gastos.find((g) => g.id === datos.id);

    if (gastoExistente) {
      gastoExistente.actualizarDescripcion(datos.descripcion);
      gastoExistente.actualizarValor(datos.valor);
      gastoExistente.actualizarFecha(datos.fecha);

      if (gastoExistente.etiquetas) {
        gastoExistente.borrarEtiquetas(...gastoExistente.etiquetas);
      }
      if (datos.etiquetas.trim()) {
        gastoExistente.anyadirEtiquetas(
          ...datos.etiquetas.split(",").map((e) => e.trim())
        );
      }

      this.actualizarVista();
    }
  }

  actualizarVista() {
    this.actualizarTotal();
    this.cargarGastos();
  }

  cargarGastos() {
    const container = document.getElementById("listado-gastos");
    const gastosList =
      container.querySelector(".gastos-list") || document.createElement("div");
    gastosList.className = "gastos-list";
    gastosList.innerHTML = "";

    const gastos = listarGastos();

    if (gastos.length === 0) {
      gastosList.innerHTML = "<p>No hay gastos registrados.</p>";
    } else {
      gastos.forEach((gasto) => {
        const componente = document.createElement("gasto-component");
        componente.setGastoData(gasto);
        gastosList.appendChild(componente);
      });
    }

    if (!container.contains(gastosList)) {
      container.appendChild(gastosList);
    }
  }

  actualizarTotal() {
    const total = calcularTotalGastos();
    const balance = calcularBalance();

    document.getElementById("total").textContent = total.toFixed(2);

    const totalElement = document.getElementById("total-gastos");
    totalElement.innerHTML = `
            <h2>Total Gastado: <span id="total">${total.toFixed(
              2
            )}</span> €</h2>
            <p>Balance: ${balance.toFixed(2)} €</p>
        `;
  }
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  new GestionPresupuestoWebV2();
});
