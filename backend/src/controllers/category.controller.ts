import { Response } from "express";
import { Category } from "../models/Category";
import { AuthRequest } from "../middlewares/auth.middleware";

// ======================
// GET ALL CATEGORIES
// ======================
export const getCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { type } = req.query;

    const filter: any = {};
    if (type === "income" || type === "expense") {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

// ======================
// GET CATEGORY BY ID
// ======================
export const getCategoryById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Categoría no encontrada" });
      return;
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categoría" });
  }
};

// ======================
// CREATE CATEGORY (Admin)
// ======================
export const createCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, type, color } = req.body;

    if (!name || !type) {
      res.status(400).json({ message: "El nombre y el tipo son obligatorios" });
      return;
    }

    if (type !== "income" && type !== "expense") {
      res.status(400).json({ message: "El tipo debe ser 'income' o 'expense'" });
      return;
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
      return;
    }

    const category = new Category({ name, type, color });
    await category.save();

    res.status(201).json({ message: "Categoría creada correctamente", category });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
      return;
    }
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

// ======================
// UPDATE CATEGORY (Admin)
// ======================
export const updateCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, type, color } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Categoría no encontrada" });
      return;
    }

    if (type && type !== "income" && type !== "expense") {
      res.status(400).json({ message: "El tipo debe ser 'income' o 'expense'" });
      return;
    }

    if (name) category.name = name;
    if (type) category.type = type;
    if (color) category.color = color;

    await category.save();

    res.json({ message: "Categoría actualizada", category });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Ya existe una categoría con ese nombre" });
      return;
    }
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

// ======================
// DELETE CATEGORY (Admin)
// ======================
export const deleteCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: "Categoría no encontrada" });
      return;
    }

    await category.deleteOne();
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};