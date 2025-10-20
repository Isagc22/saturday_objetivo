import express from "express";
import bcrypt from "bcrypt";   // Para comparar contraseñas encriptadas
import User from "../models/usuariosModel.js"; // modelo de usuario

const rutaLogin = express.Router();

rutaLogin.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ where: { email } });
    
    if (!usuario) {
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }

    const contrasenaComparacion = await bcrypt.compare(password, usuario.password);
    if (!contrasenaComparacion) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    // Redirigir según rol
    let redirectUrl = "/";
    if (usuario.role === "T1") redirectUrl = "/tableroT1";
    else if (usuario.role === "T2") redirectUrl = "/tableroT2";
    else if (usuario.role === "admin") redirectUrl = "/requerimientos";

    // Enviamos también el rol y email al frontend
    res.json({
      success: true,
      redirectUrl,
      role: usuario.role,
      email: usuario.email
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

export default rutaLogin;
