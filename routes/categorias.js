// ======================================================
// Rutas relacionadas con la gestión de categorías
// ======================================================

// Importamos Express para definir las rutas
const express = require("express");

// Creamos una instancia del enrutador
const router = express.Router();

// Importamos la conexión a la base de datos
const db = require("../db");


// ======================================================
// ------------------ CREAR CATEGORÍA ------------------
// ======================================================
router.post("/create", (req, res) => {

    // Extraemos los datos enviados en el cuerpo de la petición
    const { CATEGORYNAME, CATEGORYALERTDAYS, USERS_ID } = req.body;

    // Validamos que todos los campos obligatorios estén presentes
    if (!CATEGORYNAME || !CATEGORYALERTDAYS || !USERS_ID) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Consulta SQL para insertar una nueva categoría
    const sql = `
        INSERT INTO CATEGORIES (CATEGORYNAME, CATEGORYALERTDAYS, USERS_ID)
        VALUES (?, ?, ?)
    `;

    // Ejecutamos la consulta utilizando parámetros preparados
    db.query(sql, [CATEGORYNAME, CATEGORYALERTDAYS, USERS_ID], (err, result) => {

        // Manejo de error en caso de fallo en la inserción
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error al crear categoría" });
        }

        // Respuesta exitosa con el ID generado automáticamente
        res.json({
            message: "Categoría creada correctamente",
            id: result.insertId
        });
    });
});


// ======================================================
// ------------------ CONSULTAR CATEGORÍA ---------------
// ======================================================
router.get("/:ID", (req, res) => {

    // Obtenemos el ID desde los parámetros de la URL
    const { ID } = req.params;

    // Consulta SQL para obtener una categoría específica
    const sql = "SELECT * FROM CATEGORIES WHERE ID = ?";

    db.query(sql, [ID], (err, result) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al obtener tarea" });

        // Retornamos el resultado encontrado
        res.json(result);
    });
});


// ======================================================
// -------- LISTAR CATEGORÍAS POR USUARIO ---------------
// ======================================================
router.get("/list/:USERS_ID", (req, res) => {

    // Extraemos el ID del usuario desde los parámetros
    const { USERS_ID } = req.params;

    // Consulta SQL para obtener todas las categorías de un usuario
    const sql = "SELECT * FROM CATEGORIES WHERE USERS_ID = ?";

    db.query(sql, [USERS_ID], (err, result) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al obtener categorías" });

        // Retornamos la lista de categorías
        res.json(result);
    });
});


// ======================================================
// ------------------ ACTUALIZAR CATEGORÍA --------------
// ======================================================
router.put("/update/:ID/:USERS_ID", (req, res) => {

    // Extraemos ID de categoría y usuario desde la URL
    const { ID } = req.params;
    const { USERS_ID } = req.params;

    // Extraemos los nuevos datos enviados en el body
    const { CATEGORYNAME, CATEGORYALERTDAYS } = req.body;

    // Consulta SQL para actualizar la categoría
    // Se asegura que solo el usuario propietario pueda modificarla
    const sql = `
        UPDATE CATEGORIES 
        SET CATEGORYNAME = ?, CATEGORYALERTDAYS = ?
        WHERE ID = ? AND USERS_ID = ? 
    `;

    db.query(sql, [CATEGORYNAME, CATEGORYALERTDAYS, ID, USERS_ID], (err) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al actualizar categoría" });

        // Respuesta exitosa
        res.json({ message: "Categoría actualizada correctamente" });
    });
});


// ======================================================
// ------------------ ELIMINAR CATEGORÍA ----------------
// ======================================================
router.delete("/delete/:ID/:USERS_ID", (req, res) => {

    // Extraemos ID de categoría y usuario
    const { ID } = req.params;
    const { USERS_ID } = req.params

    // Consulta SQL para eliminar la categoría
    // Solo se elimina si pertenece al usuario
    const sql = "DELETE FROM CATEGORIES WHERE ID = ? AND USERS_ID = ?";

    db.query(sql, [ID, USERS_ID], (err) => {

        // Manejo de error (se retorna el mensaje real del error)
        // Esto puede ayudar en depuración cuando hay restricciones FK
        if (err) return res.status(500).json({ message: err.message });

        // Confirmación de eliminación
        res.json({ message: "Categoría eliminada correctamente" });
    });
});

// Exportamos el router para usarlo en el servidor principal
module.exports = router;
