// ======================================================
// Configuración y conexión a la base de datos MySQL
// ======================================================

//require("dotenv").config();
// Importamos el módulo mysql2, que permite conectarnos y trabajar con MySQL desde Node.js
const mysql = require("mysql2");

// Creamos una conexión a la base de datos utilizando los parámetros de configuración
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Intentamos establecer la conexión con el servidor MySQL
db.connect((err) => {

    // Si ocurre un error durante la conexión, se lanza la excepción
    // y se detiene la ejecución de la aplicación
    if (err) throw err;

    // Si la conexión es exitosa, mostramos un mensaje en consola
    console.log("Conexión a MySQL exitosa");
});

// Exportamos el objeto de conexión para poder reutilizarlo
// en otros archivos del proyecto (por ejemplo: controladores o rutas)
module.exports = db;
