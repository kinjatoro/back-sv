import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "2025tesis";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Aquí viene el id, email, etc. que pusiste al generar el token
    next();
  } catch (err) {
    console.error("Token inválido:", err);
    res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
