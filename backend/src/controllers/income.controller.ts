import { Response } from "express";
import { Income } from "../models/Income";
import { AuthRequest } from "../middlewares/auth.middleware";

// ======================
// GET ALL INCOMES (del usuario)
// ======================
export const getIncomes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { month, year, categoryId } = req.query;

    const filter: any = { userId: req.userId };

    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: start, $lt: end };
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const incomes = await Income.find(filter)
      .populate("categoryId", "name color type")
      .sort({ date: -1 });

    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ingresos" });
  }
};

// ======================
// GET INCOME BY ID
// ======================
export const getIncomeById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate("categoryId", "name color type");

    if (!income) {
      res.status(404).json({ message: "Ingreso no encontrado" });
      return;
    }

    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ingreso" });
  }
};

// ======================
// CREATE INCOME
// ======================
export const createIncome = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, description, date, categoryId } = req.body;

    if (!amount || !description || !categoryId) {
      res
        .status(400)
        .json({ message: "Monto, descripción y categoría son obligatorios" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ message: "El monto debe ser mayor a 0" });
      return;
    }

    const income = new Income({
      amount,
      description,
      date: date || Date.now(),
      categoryId,
      userId: req.userId,
    });

    await income.save();

    res.status(201).json({ message: "Ingreso registrado correctamente", income });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar ingreso" });
  }
};

// ======================
// UPDATE INCOME
// ======================
export const updateIncome = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, description, date, categoryId } = req.body;

    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!income) {
      res.status(404).json({ message: "Ingreso no encontrado" });
      return;
    }

    if (amount !== undefined && amount <= 0) {
      res.status(400).json({ message: "El monto debe ser mayor a 0" });
      return;
    }

    if (amount !== undefined) income.amount = amount;
    if (description) income.description = description;
    if (date) income.date = date;
    if (categoryId) income.categoryId = categoryId;

    await income.save();

    res.json({ message: "Ingreso actualizado", income });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar ingreso" });
  }
};

// ======================
// DELETE INCOME
// ======================
export const deleteIncome = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!income) {
      res.status(404).json({ message: "Ingreso no encontrado" });
      return;
    }

    await income.deleteOne();
    res.json({ message: "Ingreso eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar ingreso" });
  }
};