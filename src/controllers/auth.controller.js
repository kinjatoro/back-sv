// src/controllers/auth.controller.js
import { createUser, authenticateUser } from "../services/auth.service.js";
import { z, ZodError } from "zod"; 


// Validaciones con Zod
const registerSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export const registerUser = async (req, res) => {
  try {
    const { nombre, email, password } = registerSchema.parse(req.body);
    const result = await createUser({ nombre, email, password });
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
