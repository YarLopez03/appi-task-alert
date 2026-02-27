// ======================================================
// Configuración principal del servidor Express
// ======================================================

require("dotenv").config();
// Importamos el módulo Express para crear el servidor web
const express = require("express");

// Creamos una instancia de la aplicación Express
const app = express();

// Importamos el middleware CORS para permitir peticiones
// desde otros dominios (por ejemplo: frontend en otro puerto)
const cors = require("cors");

// Importamos las rutas relacionadas con autenticación de usuarios
const authRoutes = require("./routes/auth");

// Importamos las rutas relacionadas con categorías
const categoriasRoutes = require("./routes/categorias");

// Importamos las rutas relacionadas con tareas
const tareasRoutes = require("./routes/tareas");


// ======================================================
// Configuración de Middlewares Globales
// ======================================================

// Habilitamos CORS para toda la aplicación
// Permite que el backend pueda recibir peticiones externas
app.use(cors());

// Middleware para que Express pueda interpretar
// cuerpos de solicitudes en formato JSON
app.use(express.json()); // Para JSON


// ======================================================
// Registro de Rutas
// ======================================================

// Todas las rutas definidas en authRoutes estarán bajo el prefijo /user
app.use("/user", authRoutes);

// Todas las rutas definidas en categoriasRoutes estarán bajo el prefijo /category
app.use("/category", categoriasRoutes);

// Todas las rutas definidas en tareasRoutes estarán bajo el prefijo /task
app.use("/task", tareasRoutes);


// ======================================================
// Configuración del Puerto y Arranque del Servidor
// ======================================================

// Puerto definido para ejecutar el servidor
const PORT = process.env.PORT || 9090;

// Iniciamos el servidor y lo ponemos a escuchar en el puerto configurado
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
