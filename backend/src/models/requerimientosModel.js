// Importamos la conexion de la bd y clases de sequelize
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";
import { tr } from "@faker-js/faker";

class Requirement extends Model {}

Requirement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      //  nombre
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      //  descripción
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      //  estado
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    responsible: {
      //  responsable
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    typology: {
      //  tipologia T1 O T2
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    start_date: {
      //  fecha inicio
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      //  fecha que termino
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      //  fecha
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Requirement", //  Requerimiento
    tableName: "requirements", // nombre de la tabla
    timestamps: false,
  }
);

export default Requirement;
