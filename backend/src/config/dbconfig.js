import { Sequelize } from "sequelize";
import dotenv from "dotenv";



dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false
  }
);

// Verificar conexión
sequelize.authenticate()
  .then(() => console.log("✅ Conexión a la base de datos establecida correctamente"))
  .catch((error) => console.error("❌ Error de conexión:", error));

// ⚡ Sincroniza modelos con la base de datos (crea tablas si no existen)
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Tablas sincronizadas correctamente"))
  .catch((error) => console.error("❌ Error al sincronizar tablas:", error));

export default sequelize;
