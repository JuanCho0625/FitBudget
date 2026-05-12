import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email.service";

// ======================
// REGISTER
// ======================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Faltan datos obligatorios" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "El email ya está registrado" });
      return;
    }

    const user = new User({ name, email, password, role: "USER" });
    await user.save();

    // ── Correo de bienvenida ──────────────────────────────────────────────
    await sendEmail(email, "welcome", { userName: name });

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "El email ya está registrado" });
      return;
    }
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ======================
// LOGIN
// ======================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
