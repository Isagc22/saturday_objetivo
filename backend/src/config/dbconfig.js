//creamos la conexion a la base de datos con zequelize
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("saturday", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

export default sequelize;
