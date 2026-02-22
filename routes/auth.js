// ======================================================
// Rutas de Autenticación (Registro y Login)
// ======================================================

// Importamos el módulo Express
const express = require("express");

// Creamos un enrutador de Express para manejar las rutas de usuario
const router = express.Router();

// Importamos la conexión a la base de datos
const db = require("../db");

// Importamos bcrypt para encriptar y comparar contraseñas
const bcrypt = require("bcryptjs");


// ======================================================
// ------------------ REGISTRO ------------------
// ======================================================
router.post("/register", async (req, res) => {

    // Extraemos email y password enviados en el cuerpo de la petición
    const { email, password } = req.body;

    // Validación básica para asegurar que ambos campos existen
    if (!email || !password) {
        return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    // Encriptamos la contraseña usando bcrypt con 10 rondas de salt
    // Esto protege la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Consulta SQL para insertar un nuevo usuario en la tabla USERS
    const sql = "INSERT INTO USERS (email, password) VALUES (?, ?)";

    // Ejecutamos la consulta utilizando parámetros preparados
    db.query(sql, [email, hashedPassword], (err, result) => {

        // Si hay un error verificamos si es por usuario duplicado
        if (err) {

            // Código específico de MySQL para entrada duplicada (email único)
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "El usuario ya existe" });
            }

            // Cualquier otro error se considera error interno del servidor
            return res.status(500).json({ message: "Error en el servidor" });
        }

        // Si todo salió correctamente enviamos respuesta exitosa
        res.json({ message: "Usuario registrado correctamente" });
    });
});


// ======================================================
// ------------------ LOGIN ------------------
// ======================================================
router.post("/login", (req, res) => {

    // Obtenemos los datos enviados desde el cliente
    const { email, password } = req.body;

    // Consulta SQL para buscar el usuario por email
    const sql = "SELECT * FROM USERS WHERE email = ?";

    // Ejecutamos la consulta
    db.query(sql, [email], async (err, result) => {

        // Manejo de errores del servidor
        if (err) return res.status(500).json({ message: "Error en el servidor" });

        // Si no se encuentra el usuario, retornamos error de autenticación
        if (result.length === 0) {
            return res.status(401).json({ message: "Error en la autenticación (usuario no existe)" });
        }

        // Obtenemos el primer registro devuelto por la consulta
        const user = result[0];

        // Comparamos la contraseña enviada con la contraseña encriptada almacenada
        // user.PASSWORD corresponde al campo en la base de datos
        const validPass = await bcrypt.compare(password, user.PASSWORD);

        // Si la contraseña no coincide, enviamos error de autenticación
        if (!validPass) {
            return res.status(401).json({ message: "Error en la autenticación (contraseña incorrecta)" });
        }

        // Si todo es correcto, autenticación exitosa
        res.json({ message: "Autenticación satisfactoria" });
    });
});


// Exportamos el enrutador para usarlo en el servidor principal
module.exports = router;
