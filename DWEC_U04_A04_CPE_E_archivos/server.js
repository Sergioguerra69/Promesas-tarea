const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'gastos.json');

// Datos iniciales
const initialData = {
  "usuario1": [
    { id: 1, fecha: "2024-01-15", descripcion: "Comida", categoria: "Alimentación", cantidad: 25.50 },
    { id: 2, fecha: "2024-01-16", descripcion: "Transporte", categoria: "Transporte", cantidad: 15.00 }
  ],
  "usuario2": [
    { id: 1, fecha: "2024-01-14", descripcion: "Cine", categoria: "Ocio", cantidad: 12.50 },
    { id: 2, fecha: "2024-01-15", descripcion: "Libros", categoria: "Educación", cantidad: 30.00 }
  ]
};

// Inicializar archivo de datos si no existe
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// Leer datos
function readData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return initialData;
  }
}

// Guardar datos
function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// GET: Obtener gastos de usuario
app.get('/:usuario', (req, res) => {
  const data = readData();
  const usuario = req.params.usuario;
  
  if (data[usuario]) {
    res.json(data[usuario]);
  } else {
    data[usuario] = [];
    saveData(data);
    res.json([]);
  }
});

// POST: Añadir gasto a usuario
app.post('/:usuario', (req, res) => {
  const data = readData();
  const usuario = req.params.usuario;
  const nuevoGasto = req.body;
  
  if (!data[usuario]) {
    data[usuario] = [];
  }
  
  // Generar ID único
  const nuevoId = data[usuario].length > 0 
    ? Math.max(...data[usuario].map(g => g.id)) + 1 
    : 1;
  
  nuevoGasto.id = nuevoId;
  data[usuario].push(nuevoGasto);
  saveData(data);
  
  res.status(201).json(nuevoGasto);
});

// PUT: Actualizar gasto
app.put('/:usuario/:gastoid', (req, res) => {
  const data = readData();
  const usuario = req.params.usuario;
  const gastoId = parseInt(req.params.gastoid);
  const gastoActualizado = req.body;
  
  if (data[usuario]) {
    const index = data[usuario].findIndex(g => g.id === gastoId);
    if (index !== -1) {
      gastoActualizado.id = gastoId;
      data[usuario][index] = gastoActualizado;
      saveData(data);
      res.json(gastoActualizado);
    } else {
      res.status(404).json({ error: 'Gasto no encontrado' });
    }
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// DELETE: Eliminar gasto
app.delete('/:usuario/:gastoid', (req, res) => {
  const data = readData();
  const usuario = req.params.usuario;
  const gastoId = parseInt(req.params.gastoid);
  
  if (data[usuario]) {
    const index = data[usuario].findIndex(g => g.id === gastoId);
    if (index !== -1) {
      data[usuario].splice(index, 1);
      saveData(data);
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Gasto no encontrado' });
    }
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`API ejecutándose en http://localhost:${PORT}`);
  console.log(`Usuarios disponibles: usuario1, usuario2`);
});