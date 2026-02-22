// ======================================================
// Rutas relacionadas con la gestión de tareas (TASKS)
// ======================================================

// Importamos Express para manejar las rutas
const express = require("express");

// Creamos una instancia del enrutador
const router = express.Router();

// Importamos la conexión a la base de datos
const db = require("../db");


// ======================================================
// ------------------ CREAR TAREA ------------------
// ======================================================
router.post("/create", (req, res) => {

    // Extraemos los datos enviados en el cuerpo de la petición
    const { TASKNAME, STARTDAY, ENDDAY, CATEGORIES_ID, USERS_ID } = req.body;

    // Estado inicial automático al crear una tarea
    const STATUS = "Creada";

    // Validamos que todos los campos obligatorios estén presentes
    if (!TASKNAME || !STARTDAY || !ENDDAY || !CATEGORIES_ID || !USERS_ID) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Consulta SQL para insertar una nueva tarea
    const sql = `
        INSERT INTO TASKS (TASKNAME, STARTDAY, ENDDAY, STATUS, CATEGORIES_ID, USERS_ID)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Ejecutamos la consulta con parámetros preparados (previene inyección SQL)
    db.query(sql, [TASKNAME, STARTDAY, ENDDAY, STATUS, CATEGORIES_ID, USERS_ID], (err, result) => {

        // Manejo de error en caso de fallo en la inserción
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error al crear tarea" });
        }

        // Respuesta exitosa con el ID generado automáticamente
        res.json({
            message: "Tarea creada correctamente",
            id: result.insertId
        });
    });
});


// ======================================================
// ------------------ CONSULTAR TAREA ------------------
// ======================================================
router.get("/:ID", (req, res) => {

    // Obtenemos el ID desde los parámetros de la URL
    const { ID } = req.params;

    // Consulta SQL para obtener una tarea específica
    const sql = "SELECT * FROM TASKS WHERE ID = ?";

    // Ejecutamos la consulta
    db.query(sql, [ID], (err, result) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al obtener tarea" });

        // Retornamos el resultado encontrado
        res.json(result);
    });
});


// ======================================================
// -------- LISTAR TAREAS POR USUARIO -------------------
// ======================================================
router.get("/list/:USERS_ID", (req, res) => {

    // Extraemos el ID del usuario desde los parámetros
    const { USERS_ID } = req.params;

    // Consulta SQL para obtener todas las tareas de un usuario
    const sql = "SELECT * FROM TASKS WHERE USERS_ID = ?";

    db.query(sql, [USERS_ID], (err, result) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al obtener tareas" });

        // Retornamos la lista de tareas
        res.json(result);
    });
});


// ======================================================
// ---- LISTAR TAREAS POR USUARIO Y CATEGORÍA ----------
// ======================================================
router.get("/list/:USERS_ID/:CATEGORIES_ID", (req, res) => {

    // Extraemos usuario y categoría desde los parámetros
    const { USERS_ID, CATEGORIES_ID } = req.params;

    // Consulta SQL filtrando por usuario y categoría
    const sql = "SELECT * FROM TASKS WHERE USERS_ID = ? AND CATEGORIES_ID = ?";

    db.query(sql, [USERS_ID, CATEGORIES_ID], (err, result) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al obtener tareas" });

        // Retornamos las tareas filtradas
        res.json(result);
    });
});


// ======================================================
// ------------------ ACTUALIZAR TAREA ------------------
// ======================================================
router.put("/update/:ID/:USERS_ID", (req, res) => {

    // Extraemos ID de tarea y usuario desde la URL
    const { ID } = req.params;
    const { USERS_ID } = req.params;

    // Extraemos los datos a actualizar desde el body
    const { TASKNAME, STARTDAY, CATEGORIES_ID } = req.body;

    // Consulta SQL para actualizar la tarea (solo si pertenece al usuario)
    const sql = `
        UPDATE TASKS 
        SET TASKNAME = ?, STARTDAY = ?,  CATEGORIES_ID = ? 
        WHERE ID = ? AND USERS_ID = ? 
    `;

    db.query(sql, [TASKNAME, STARTDAY, CATEGORIES_ID, ID, USERS_ID], (err) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: err.message });

        // Respuesta exitosa
        res.json({ message: "Tarea actualizada correctamente" });
    });
});


// ======================================================
// ------------------ PRORROGAR TAREA -------------------
// ======================================================
router.put("/extension/:ID/:USERS_ID", (req, res) => {

    // Extraemos ID de tarea y usuario
    const { ID } = req.params;
    const { USERS_ID } = req.params;

    // Nueva fecha de finalización enviada en el body
    const { ENDDAY } = req.body;

    // Consulta SQL para actualizar únicamente la fecha final
    const sql = `
        UPDATE TASKS 
        SET ENDDAY = ? 
        WHERE ID = ? AND USERS_ID = ? 
    `;

    db.query(sql, [ENDDAY, ID, USERS_ID], (err) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al actualizar la tarea" });

        // Respuesta exitosa
        res.json({ message: "Tarea actualizada correctamente" });
    });
});


// ======================================================
// ------------------ ELIMINAR TAREA --------------------
// ======================================================
router.delete("/delete/:ID/:USERS_ID", (req, res) => {

    // Extraemos ID de tarea y usuario
    const { ID } = req.params;
    const { USERS_ID } = req.params;

    // Consulta SQL para eliminar la tarea si pertenece al usuario
    const sql = "DELETE FROM TASKS WHERE ID = ? AND USERS_ID = ?";

    db.query(sql, [ID, USERS_ID], (err) => {

        // Manejo de error
        if (err) return res.status(500).json({ message: "Error al eliminar tarea" });

        // Confirmación de eliminación
        res.json({ message: "Tarea eliminada correctamente" });
    });
});


// Exportamos el router para poder usarlo en el archivo principal del servidor
module.exports = router;
