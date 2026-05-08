import { Response } from "express";
import { Expense } from "../models/Expense";
import { Budget } from "../models/Budget";
import { AuthRequest } from "../middlewares/auth.middleware";
import mongoose from "mongoose";

// ======================
// GET ALL EXPENSES (del usuario)
// ======================
export const getExpenses = async (
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

    const expenses = await Expense.find(filter)
      .populate("categoryId", "name color type")
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener gastos" });
  }
};

// ======================
// GET EXPENSE BY ID
// ======================
 
export const getExpenseById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate("categoryId", "name color type");

    if (!expense) {
      res.status(404).json({ message: "Gasto no encontrado" });
      return; // <--- Return solo, sin devolver el objeto res
    }

    res.json(expense);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
        res.status(400).json({ message: "ID con formato inválido" });
        return; // <--- Return solo
    }
    res.status(500).json({ message: "Error al obtener gasto" });
  }
};