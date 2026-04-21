import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ======================
// REGISTER
// ======================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      res.status(400).json({ message: "Faltan datos obligatorios" });
      return;
    }

    // Verificar email duplicado
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "El email ya está registrado" });
      return;
    }

    // Crear usuario
    const user = new User({
      name,
      email,
      password,
      role: "USER", // importante para roles
    });

    await user.save();

    res.status(201).json({
      message: "Usuario creado correctamente",
    });

  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "El email ya está registrado" });
      return;
    }

    console.log(error);

    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

// ======================
// LOGIN
// ======================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      res.status(400).json({ message: "Faltan datos" });
      return;
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    // IMPORTANTE: incluir role en el token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login exitoso",
      token,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};