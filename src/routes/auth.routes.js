// src/routes/auth.routes.js
import express from "express";
import { registerUser, loginUser, editarPerfil } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.put("/profile", editarPerfil);

/*
authRouter.post("/verify-code", (req, res) => {
    const { email, code, ip } = req.body;

    if (!email || !code) {
        return res.status(400).json({ msg: "Por favor complete todos los campos" });
    }

    console.log('Email:', email);
    console.log('Code:', code);
    console.log('IP del usuario:', ip);

    // Verificar el código en la base de datos
    const query = `
        SELECT * FROM verification_codes 
        WHERE user_id = (SELECT id FROM usuarios WHERE email = ?) 
        AND code = ? 
        AND expires_at > NOW()
    `;

    connection.query(query, [email, code], (err, results) => {
        if (err) {
            console.error('Error en la consulta de verificación de código:', err);
            return res.status(500).json({ msg: "Error al verificar el código" });
        }

        console.log('Resultados de verificación de código:', results);

        if (results.length > 0) {
            // Código válido, obtener el usuario
            const userId = results[0].user_id;
            const tokenQuery = `SELECT * FROM usuarios WHERE id = ?`;
            connection.query(tokenQuery, [userId], (err, userResults) => {
                if (err || userResults.length === 0) {
                    console.error('Error en la consulta de usuario o usuario no encontrado:', err);
                    return res.status(500).json({ msg: "Error al obtener el usuario" });
                }

                const user = userResults[0];

                // Si el usuario es admin o master, validar la IP
                if (user.rol === 'admin' || user.rol === 'master') {
                    const ipQuery = `SELECT * FROM ips_registradas WHERE user_id = ? AND ip_address = ?`;
                    connection.query(ipQuery, [user.id, ip], (err, ipResults) => {
                        if (err) {
                            console.error('Error al consultar las IPs registradas:', err);
                            return res.status(500).json({ msg: "Error al validar la IP" });
                        }

                        if (ipResults.length === 0) {
                            // Si no se encuentra la IP registrada, rechazar la solicitud
                            return res.status(403).json({ msg: "IP no autorizada" });
                        }

                        // IP válida, generar el token
                        const token = jwt.sign(
                            { id: user.id, rol: user.rol, username: user.nombre },
                            JWT_SECRET,
                            { expiresIn: '1h' }
                        );
                        res.status(200).json({ token, rol: user.rol, username: user.nombre });
                    });
                } else {
                    // Si el usuario no es admin o master, solo generar el token
                    const token = jwt.sign(
                        { id: user.id, rol: user.rol, username: user.nombre },
                        JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    res.status(200).json({ token, rol: user.rol, username: user.nombre });
                }
            });
        } else {
            console.log('Código inválido o expirado');
            res.status(400).json({ msg: "Código inválido o expirado" });
        }
    });
});

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

*/

