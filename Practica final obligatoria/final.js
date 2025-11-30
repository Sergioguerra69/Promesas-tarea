// Lista global de gastos
let gastos = [];

// Clase para crear un gasto
export class CrearGasto {
  constructor(
    descripcion,
    valor,
    fecha,
    categoria,
    subcategoria = "",
    etiqueta = ""
  ) {
    this.descripcion = descripcion;
    this.valor = valor;
    this.fecha = fecha;
    this.categoria = categoria;
    this.subcategoria = subcategoria;

    // Etiquetas como array, nunca vacío
    if (etiqueta) {
      this.etiquetas = [etiqueta];
    } else if (subcategoria) {
      this.etiquetas = [subcategoria];
    } else {
      this.etiquetas = [categoria];
    }
  }

  obtenerPeriodoAgrupacion(tipo) {
    if (tipo === "dia") return this.fecha;
    if (tipo === "mes") return this.fecha.slice(0, 7);
    if (tipo === "anyo") return this.fecha.slice(0, 4);
    return this.fecha;
  }
}

// Añadir gasto
export function anyadirGasto(gasto) {
  gastos.push(gasto);
}

// Filtrar gastos según opciones
export function filtrarGastos(opciones) {
  return gastos.filter((g) => {
    if (opciones.fechaDesde && g.fecha < opciones.fechaDesde) return false;
    if (opciones.fechaHasta && g.fecha > opciones.fechaHasta) return false;
    if (opciones.valorMinimo && g.valor < opciones.valorMinimo) return false;
    if (opciones.valorMaximo && g.valor > opciones.valorMaximo) return false;
    if (
      opciones.descripcionContiene &&
      !g.descripcion.includes(opciones.descripcionContiene)
    )
      return false;
    if (
      opciones.etiquetasTiene &&
      !g.etiquetas.some((e) => opciones.etiquetasTiene.includes(e))
    )
      return false;
    return true;
  });
}

// Agrupar gastos por periodo y filtrar opcionalmente
export function agruparGastos(
  periodo,
  etiquetas = [],
  fechaDesde = null,
  fechaHasta = null
) {
  let filtrados = gastos;

  if (etiquetas.length > 0) {
    filtrados = filtrados.filter(
      (g) =>
        g.etiquetas.some((e) => etiquetas.includes(e)) ||
        etiquetas.includes(g.categoria)
    );
  }

  if (fechaDesde) filtrados = filtrados.filter((g) => g.fecha >= fechaDesde);
  if (fechaHasta) filtrados = filtrados.filter((g) => g.fecha <= fechaHasta);

  const agrup = {};
  filtrados.forEach((g) => {
    const key = g.obtenerPeriodoAgrupacion(periodo);
    agrup[key] = (agrup[key] || 0) + g.valor;
  });

  return agrup;
}
 