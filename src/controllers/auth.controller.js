// src/controllers/auth.controller.js
import { createUser, authenticateUser, updateUserProfile  } from "../services/auth.service.js";
import { z, ZodError } from "zod"; 


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

    // No se recibe foto_perfil, createUser lo setea a 0 automáticamente
    const result = await createUser({ nombre, email, password, metas });

    if (result.emailInUse) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    res.status(201).json({ msg: "Usuario registrado exitosamente" });
  } catch (err) {
    if (err instanceof ZodError && Array.isArray(err.errors)) {
      const errores = err.errors.map(e => e.message);
      return res.status(400).json({ errores });
    }

    console.error("ERROR en registro:", err);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, token } = await authenticateUser({ email, password });
    res.status(200).json({ user, token });
  } catch (err) {
  if (err instanceof ZodError && Array.isArray(err.errors)) {
    const errores = err.errors.map(e => e.message);
    return res.status(400).json({ errores });
  }


    // Error genérico para no exponer detalles internos
    return res.status(400).json({ msg: "Credenciales inválidas" });
  }
};

export const editarPerfil = async (req, res) => {
  try {
    const userId = req.user?.id; // Asumiendo que `req.user` viene del middleware de autenticación
    if (!userId) return res.status(401).json({ msg: "No autorizado" });

    const datosActualizados = updateProfileSchema.parse(req.body);

    const usuarioActualizado = await updateUserProfile(userId, datosActualizados);

    res.status(200).json({ msg: "Perfil actualizado exitosamente", user: usuarioActualizado });
  } catch (err) {
    if (err instanceof ZodError && Array.isArray(err.errors)) {
      const errores = err.errors.map(e => e.message);
      return res.status(400).json({ errores });
    }

    console.error("ERROR al actualizar perfil:", err);
    res.status(500).json({ msg: "Error al actualizar el perfil" });
  }
};
