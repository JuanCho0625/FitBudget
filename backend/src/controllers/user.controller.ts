import { Request, Response } from "express";
import { User } from "../models/User";

// ======================
// GET ALL USERS
// ======================
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ======================
// GET USER BY ID
// ======================
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// ======================
// UPDATE USER
// ======================
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ message: "Usuario actualizado", user });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// ======================
// DELETE USER
// ======================
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    await user.deleteOne();

    res.json({ message: "Usuario eliminado" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};