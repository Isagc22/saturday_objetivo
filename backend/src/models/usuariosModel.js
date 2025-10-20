// Importamos la coneccion con la base de datos y  zequelize los tipos de datos
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

// Definicion de modelo usuario
class User extends Model { }

User.init({
id_document: {  //cedula id
  type: DataTypes.STRING(20),
  primaryKey: true,
  allowNull: false
},

  first_name: {             //  nombre
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {              //  apellido
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {                  // correo
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {               // contraseña
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {                   //  cargo
    type: DataTypes.STRING(50),
    allowNull: true
  }

}, {
  sequelize,
  modelName: 'User',        //  Usuario
});

export default User;
