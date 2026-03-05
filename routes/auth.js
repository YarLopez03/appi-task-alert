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

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO USERS (email, password) VALUES (?, ?)";

    db.query(sql, [email, hashedPassword], (err, result) => {

        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "El usuario ya existe" });
            }
            return res.status(500).json({ message: err.message });
        }

        // ✅ Devolvemos el usuario con su ID generado automáticamente por MySQL
        res.status(201).json({
            message: "Usuario registrado correctamente",
            user: {
                ID: result.insertId,
                EMAIL: email
            }
        });
    });
});


// ======================================================
// ------------------ LOGIN ------------------
// ======================================================
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM USERS WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) return res.status(500).json({ message: err.message });

        if (result.length === 0) {
            return res.status(401).json({ message: "Error en la autenticación (usuario no existe)" });
        }

        const user = result[0];

        const validPass = await bcrypt.compare(password, user.PASSWORD);

        if (!validPass) {
            return res.status(401).json({ message: "Error en la autenticación (contraseña incorrecta)" });
        }

        // 🔥 RESPUESTA CORREGIDA
        res.json({
            message: "Autenticación satisfactoria",
            user: {
                ID: user.ID,
                EMAIL: user.EMAIL
            }
        });
    });
});

/*router.post("/login", (req, res) => {

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
});*/




// Exportamos el enrutador para usarlo en el servidor principal
module.exports = router;
