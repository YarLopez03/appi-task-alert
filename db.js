// ======================================================
// Configuración y conexión a la base de datos MySQL
// ======================================================

// Importamos el módulo mysql2, que permite conectarnos y trabajar con MySQL desde Node.js
const mysql = require("mysql2");

// Creamos una conexión a la base de datos utilizando los parámetros de configuración
const db = mysql.createConnection({
    host: "localhost",        // Dirección del servidor donde está instalado MySQL
    user: "root",             // Usuario con el que nos autenticamos en MySQL
    password: "root",         // Contraseña del usuario MySQL
    database: "task_alert_DB" // Nombre de la base de datos a la que nos conectaremos
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
