import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// ----------------------------------------------------------------
// Configuración DB y modelos
import sequelize from "../src/config/dbconfig.js";
import User from "../src/models/usuariosModel.js";
import Requirement from "../src/models/requerimientosModel.js";
// ----------------------------------------------------------------

dotenv.config();

import indexRoutes from './routes/routes.js'; 

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de vistas y assets
app.set('views', join(__dirname, '../../frontend/views/pages/'));
app.set('view engine', 'ejs');
app.use(express.static(join(__dirname, '../../frontend/public')));

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(indexRoutes);

// Ruta de prueba
app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

// ------------------------
// Sincronizar DB y arrancar servidor
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Conectar con la DB
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");

    // Sincronizar tablas
    await sequelize.sync({ alter: true }); // o { force: true } si quieres recrear tablas
    console.log("✅ Tablas sincronizadas correctamente");

    // Arrancar servidor
    app.listen(PORT, () => {
      console.log(`---------------------------Servidor corriendo en http://localhost:${PORT}------------------`);
    });

  } catch (error) {
    console.error("❌ Error al conectar o sincronizar DB:", error);
  }
})();
