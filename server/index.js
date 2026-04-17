const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// Permite que el frontend (otro origen) pueda hacer peticiones a esta API
app.use(cors());

// Permite recibir datos en formato JSON en el cuerpo de las peticiones
app.use(express.json());

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3000;


// ── RUTAS DE DOCENTES ──────────────────────────────────────────────────────────
// GET    /docentes        → obtener todos
// GET    /docentes/:id    → obtener uno por ID
// POST   /docentes        → crear nuevo
// PUT    /docentes/:id    → actualizar existente
// DELETE /docentes/:id    → eliminar


// Devuelve la lista completa de docentes
app.get('/docentes', (_req, res) => {
    const sql = 'SELECT * FROM docentes';

    db.query(sql, (err, results) => {
        if (err) {
            // 500 = error interno del servidor
            return res.status(500).json({ error: 'error al obtener los docentes' });
        }
        // 200 implícito — devuelve el arreglo de docentes
        res.json(results);
    });
});


// Devuelve un docente específico según su ID
app.get('/docentes/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM docentes WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'error al obtener el docente' });
        }

        // 404 si no existe ningún docente con ese ID
        if (!results.length) {
            return res.status(404).json({ error: 'Docente no encontrado' });
        }

        res.json(results[0]);
    });
});


// Crea un nuevo docente con los datos enviados en el cuerpo de la petición
app.post('/docentes', (req, res) => {
    const { nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia } = req.body;

    // Valida que todos los campos estén presentes y no vacíos
    if (!nombre?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() || !anios_experiencia?.trim()) {
        return res.status(400).json({ error: 'todos los campos son requeridos' });
    }

    const anios = Number(anios_experiencia);

    // Valida que los años de experiencia sean un número positivo
    if (Number.isNaN(anios) || anios < 0) {
        return res.status(400).json({ error: 'anios de experiencia invalidos' });
    }

    // 7 campos → 7 marcadores de posición (?)
    const sql = 'INSERT INTO docentes (nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia) VALUES (?,?,?,?,?,?,?)';

    db.query(sql, [nombre.trim(), correo.trim(), telefono.trim(), titulo.trim(), area_academica.trim(), dedicacion.trim(), anios], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'error al guardar el docente' });
        }

        // Devuelve el docente recién creado con el ID asignado por la base de datos
        res.status(201).json({
            id: result.insertId,
            nombre: nombre.trim(),
            correo: correo.trim(),
            telefono: telefono.trim(),
            titulo: titulo.trim(),
            area_academica: area_academica.trim(),
            dedicacion: dedicacion.trim(),
            anios_experiencia: anios
        });
    });
});


// Actualiza los datos de un docente existente según su ID
app.put('/docentes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, correo, telefono, titulo, area_academica, dedicacion, anios_experiencia } = req.body;

    // Valida que todos los campos estén presentes y no vacíos
    if (!nombre?.trim() || !correo?.trim() || !telefono?.trim() || !titulo?.trim() || !area_academica?.trim() || !dedicacion?.trim() || !anios_experiencia?.trim()) {
        return res.status(400).json({ error: 'todos los campos son requeridos' });
    }

    const anios = Number(anios_experiencia);

    if (Number.isNaN(anios) || anios < 0) {
        return res.status(400).json({ error: 'anios de experiencia invalidos' });
    }

    const sql = 'UPDATE docentes SET nombre=?, correo=?, telefono=?, titulo=?, area_academica=?, dedicacion=?, anios_experiencia=? WHERE id=?';

    db.query(sql, [nombre.trim(), correo.trim(), telefono.trim(), titulo.trim(), area_academica.trim(), dedicacion.trim(), anios, id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'error al actualizar el docente' });
        }
        return res.json({ message: 'Docente actualizado' });
    });
});


// Elimina un docente según su ID
app.delete('/docentes/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM docentes WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'error al eliminar el docente' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Docente no encontrado' });
        }

        res.json({ message: 'Docente eliminado' });
    });
});


// Inicia el servidor y lo pone a escuchar peticiones en el puerto indicado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
