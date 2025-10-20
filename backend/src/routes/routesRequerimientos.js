import express from "express";
import Requirement from "../models/requerimientosModel.js";
import User from "../models/usuariosModel.js";
import { Op } from "sequelize";

const router = express.Router();

//  Vista de requerimientos
router.get("/requerimientos", async (req, res) => {
  try {
    const requerimientos = await Requirement.findAll();
    res.render("requerimientos", { requerimientos });
  } catch (error) {
    console.error("Error al obtener requerimientos:", error);
    res.status(500).send("Error en el servidor");
  }
});

//  Crear requerimiento
router.post("/requerimientos", async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      responsible,
      typology,
      start_date,
      end_date,
    } = req.body;

    const createRequirement = await Requirement.create({
      name,
      description,
      status: "compromiso",
      responsible: responsible || null,
      typology: typology || null,
      start_date: start_date || null,
      end_date: end_date || null,
      created_at: new Date(),
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: "Requirement created successfully",
      body: createRequirement,
    });
  } catch (error) {
    console.error(" Error creando requerimiento:", error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error creando requerimiento",
      error: error.message,
    });
  }
});

//  Tablero T1
router.get("/tableroT1", async (req, res) => {
  try {
    const reqs = await Requirement.findAll({ where: { typology: "T1" } });
    const usersRaw = await User.findAll({ where: { role: "T1" } });
    const users = usersRaw.map((u) => (u.toJSON ? u.toJSON() : u));

    const requerimientos = reqs.map((r) => {
      const rr = r.toJSON ? r.toJSON() : r;
      const match = users.find((u) => {
        const fullname = `${(u.first_name || "").trim()}${
          u.last_name ? " " + u.last_name.trim() : ""
        }`.trim();
        return (
          fullname &&
          (fullname === (rr.responsible || "").trim() ||
            u.first_name === (rr.responsible || "").trim())
        );
      });
      rr.responsible_id = match ? match.id_document : null;
      return rr;
    });

    const estados = ["compromiso", "implementacion", "qa/revision"];

    res.render("tableroT1", {
      requerimientos,
      users,
      estados,
      layout: false,
    });
  } catch (error) {
    console.error(" Error cargando tablero T1:", error);
    res.status(500).send("Error cargando tablero T1");
  }
});

//  Tablero T2
router.get("/tableroT2", async (req, res) => {
  try {
    const reqs = await Requirement.findAll({ where: { typology: "T2" } });
    const usersRaw = await User.findAll({ where: { role: "T2" } });
    const users = usersRaw.map((u) => (u.toJSON ? u.toJSON() : u));

    const requerimientos = reqs.map((r) => {
      const rr = r.toJSON ? r.toJSON() : r;
      const match = users.find((u) => {
        const fullname = `${(u.first_name || "").trim()}${
          u.last_name ? " " + u.last_name.trim() : ""
        }`.trim();
        return (
          fullname &&
          (fullname === (rr.responsible || "").trim() ||
            u.id === rr.responsible_id)
        );
      });
      rr.responsible_id = match ? match.id : null;
      return rr;
    });

    const estados = ["compromiso", "implementacion", "qa/revision"];

    res.render("tableroT2", {
      requerimientos,
      users,
      estados,
      layout: false,
    });
  } catch (error) {
    console.error(" Error cargando tablero T2:", error);
    res.status(500).send("Error cargando tablero T2");
  }
});

//  Actualizar responsable de un requerimiento
router.put("/requerimientos/:id/responsable", async (req, res) => {
  try {
    const { id } = req.params;
    const { responsible } = req.body;

    const reqUpdated = await Requirement.update(
      { responsible },
      { where: { id } }
    );

    if (reqUpdated[0] === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Requerimiento no encontrado" });
    }

    res.json({ ok: true, message: "Responsable actualizado correctamente" });
  } catch (error) {
    console.error(" Error actualizando responsable:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error en el servidor" });
  }
});

//  Actualizar requerimiento (estado o responsable)
router.patch("/requerimientos/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responsible } = req.body;

    const requerimiento = await Requirement.findByPk(id);
    if (!requerimiento) {
      return res
        .status(404)
        .json({ ok: false, message: "Requerimiento no encontrado" });
    }

    if (status) {
      requerimiento.status = status;

      if (status === "implementacion" && !requerimiento.start_date) {
        requerimiento.start_date = new Date();
      }
      if (status === "qa/revision" && !requerimiento.end_date) {
        requerimiento.end_date = new Date();
      }
    }

    if (responsible !== undefined) {
      requerimiento.responsible = responsible;
    }

    await requerimiento.save();

    res.json({
      ok: true,
      message: "Requerimiento actualizado",
      requerimiento,
    });
  } catch (error) {
    console.error(" Error actualizando requerimiento:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error actualizando requerimiento" });
  }
});

//  Buscar requerimientos (para autocompletado en nav)
router.get("/buscar", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const requerimientos = await Requirement.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { responsible: { [Op.like]: `%${q}%` } },
        ],
      },
      limit: 10,
    });

    res.json(requerimientos);
  } catch (error) {
    console.error(" Error en búsqueda:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error en la búsqueda" });
  }
});

//  Obtener detalle de un requerimiento en JSON (para modal)
router.get("/api/requerimientos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reqItem = await Requirement.findByPk(id);

    if (!reqItem) {
      return res
        .status(404)
        .json({ ok: false, message: "Requerimiento no encontrado" });
    }

    res.json(reqItem);
  } catch (error) {
    console.error(" Error fetching requerimiento:", error);
    res
      .status(500)
      .json({ ok: false, message: "Error en el servidor" });
  }
});

export default router;
