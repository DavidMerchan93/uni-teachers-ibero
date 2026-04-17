// Carga las variables de entorno desde el archivo .env (contraseña, usuario, etc.)
require('dotenv').config();

const mysql = require('mysql2');

// Crea la conexión a la base de datos usando los datos del archivo .env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,         // Dirección del servidor de la base de datos
    user: process.env.DB_USER,         // Usuario de MySQL
    password: process.env.DB_PASSWORD, // Contraseña de MySQL
    database: process.env.DB_NAME,     // Nombre de la base de datos
});

// Intenta conectarse; si falla, muestra el error en consola
connection.connect((err) => {
    if(err) {
        console.log("Database connection error");
        return;
    }
    console.log("Database connection successfuly");
});

// Exporta la conexión para usarla en otros archivos
module.exports = connection;
