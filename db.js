// ======================================================
// Configuración y conexión a la base de datos MySQL
// ======================================================
const mysql = require("mysql2");

// Usamos pool en lugar de createConnection para manejar
// reconexiones automáticas y múltiples conexiones simultáneas
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,  // Espera si no hay conexiones disponibles
    connectionLimit: 10,        // Máximo 10 conexiones simultáneas
    queueLimit: 0               // Sin límite de cola
});

// Verificamos que la conexión funciona al iniciar
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conexión a MySQL exitosa");
    connection.release(); // Devolvemos la conexión al pool
});

// Exportamos el pool para reutilizarlo en rutas y controladores
module.exports = pool;