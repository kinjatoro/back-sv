// src/controllers/auth.controller.js
import { createUser, authenticateUser, updateUserProfile, getUserByEmail  } from "../services/auth.service.js";
import { z, ZodError } from "zod"; 
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "2025tesis";


// Validaciones con Zod
const registerSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  metas: z.string().optional(),
});

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

const updateProfileSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").optional(),
  foto_perfil: z.number({ invalid_type_error: "foto_perfil debe ser un número" }).optional(),
  metas: z.string().optional(),
});

export const registerUser = async (req, res) => {
  try {
    const { nombre, email, password, metas } = registerSchema.parse(req.body);
    const result = await createUser({ nombre, email, password, metas });

    if (result.emailInUse) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    const user = await getUserByEmail(email); 

    const token = jwt.sign({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      foto_perfil: user.foto_perfil,
      metas: user.metas
    }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        foto_perfil: user.foto_perfil,
        metas: user.metas
      },
      token
    });

  } catch (err) {
    if (err instanceof ZodError) {
      const errores = err.issues.map(issue => issue.message);
      return res.status(400).json({ errores });
    }

    console.error("ERROR en registro:", err);
    return res.status(500).json({ msg: "Error al registrar usuario" });
  }

};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, token } = await authenticateUser({ email, password });
    res.status(200).json({ user, token });
  } catch (err) {
  if (err instanceof ZodError) {
      const errores = err.issues.map(issue => issue.message);
      return res.status(400).json({ errores });
    }


    // Error genérico para no exponer detalles internos
    return res.status(400).json({ msg: "Credenciales inválidas" });
  }
};

export const editarPerfil = async (req, res) => {
  try {
    const userId = req.user?.id; 
    if (!userId) return res.status(401).json({ msg: "No autorizado" });

    const datosActualizados = updateProfileSchema.parse(req.body);

    const usuarioActualizado = await updateUserProfile(userId, datosActualizados);

    res.status(200).json({ msg: "Perfil actualizado exitosamente", user: usuarioActualizado });
  } catch (err) {
    if (err instanceof ZodError) {
      const errores = err.issues.map(issue => issue.message);
      return res.status(400).json({ errores });
    }

    console.error("ERROR al actualizar perfil:", err);
    res.status(500).json({ msg: "Error al actualizar el perfil" });
  }
};
