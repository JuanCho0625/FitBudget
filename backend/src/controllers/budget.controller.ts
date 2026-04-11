import { Response } from "express";
import { Budget } from "../models/Budget";
import { Expense } from "../models/Expense";
import { AuthRequest } from "../middlewares/auth.middleware";

// ======================
// GET BUDGETS (del usuario)
// ======================
export const getBudgets = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const budgets = await Budget.find({ userId: req.userId }).sort({
      year: -1,
      month: -1,
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener presupuestos" });
  }
};

// ======================
// GET BUDGET BY MONTH (resumen con gastos)
// ======================
export const getBudgetByMonth = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const month = Number(req.params.month);
    const year = Number(req.params.year);

    if (!month || !year || month < 1 || month > 12) {
      res.status(400).json({ message: "Mes o año inválidos" });
      return;
    }

    const budget = await Budget.findOne({ userId: req.userId, month, year });

    if (!budget) {
      res.status(404).json({ message: "No se encontró presupuesto para ese mes" });
      return;
    }

    // Calcular total de gastos del mes
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const result = await Expense.aggregate([
      { $match: { userId: budget.userId, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSpent = result[0]?.total || 0;
    const percentage = (totalSpent / budget.monthlyLimit) * 100;

    res.json({
      budget,
      totalSpent,
      remaining: budget.monthlyLimit - totalSpent,
      percentageUsed: Math.min(percentage, 100).toFixed(1),
      isOverBudget: totalSpent > budget.monthlyLimit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener presupuesto del mes" });
  }
};

// ======================
// CREATE BUDGET
// ======================
export const createBudget = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { monthlyLimit, month, year } = req.body;

    if (!monthlyLimit || !month) {
      res.status(400).json({ message: "El límite mensual y el mes son obligatorios" });
      return;
    }

    if (monthlyLimit <= 0) {
      res.status(400).json({ message: "El límite debe ser mayor a 0" });
      return;
    }

    if (month < 1 || month > 12) {
      res.status(400).json({ message: "El mes debe estar entre 1 y 12" });
      return;
    }

    const existing = await Budget.findOne({
      userId: req.userId,
      month,
      year: year || new Date().getFullYear(),
    });

    if (existing) {
      res.status(400).json({ message: "Ya existe un presupuesto para ese mes y año" });
      return;
    }

    const budget = new Budget({
      userId: req.userId,
      monthlyLimit,
      month,
      year: year || new Date().getFullYear(),
    });

    await budget.save();

    res.status(201).json({ message: "Presupuesto creado correctamente", budget });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Ya existe un presupuesto para ese mes y año" });
      return;
    }
    res.status(500).json({ message: "Error al crear presupuesto" });
  }
};

// ======================
// UPDATE BUDGET
// ======================
export const updateBudget = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { monthlyLimit } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado" });
      return;
    }

    if (monthlyLimit !== undefined) {
      if (monthlyLimit <= 0) {
        res.status(400).json({ message: "El límite debe ser mayor a 0" });
        return;
      }
      budget.monthlyLimit = monthlyLimit;
      budget.isAlerted = false; // Resetea alerta al cambiar el límite
    }

    await budget.save();

    res.json({ message: "Presupuesto actualizado", budget });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar presupuesto" });
  }
};

// ======================
// DELETE BUDGET
// ======================
export const deleteBudget = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!budget) {
      res.status(404).json({ message: "Presupuesto no encontrado" });
      return;
    }

    await budget.deleteOne();
    res.json({ message: "Presupuesto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar presupuesto" });
  }
};