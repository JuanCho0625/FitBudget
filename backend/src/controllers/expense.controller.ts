import { Response } from "express";
import { Expense } from "../models/Expense";
import { Budget } from "../models/Budget";
import { AuthRequest } from "../middlewares/auth.middleware";

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
      return;
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener gasto" });
  }
};

// ======================
// CREATE EXPENSE
// ======================
export const createExpense = async (
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

    const expense = new Expense({
      amount,
      description,
      date: date || Date.now(),
      categoryId,
      userId: req.userId,
    });

    await expense.save();

    // Revisar si el gasto supera el presupuesto del mes actual
    const expenseDate = new Date(date || Date.now());
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    const budget = await Budget.findOne({ userId: req.userId, month, year });

    let alertMessage: string | null = null;

    if (budget) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);

      const totalExpenses = await Expense.aggregate([
        {
          $match: {
            userId: expense.userId,
            date: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const total = totalExpenses[0]?.total || 0;
      const percentage = (total / budget.monthlyLimit) * 100;

      if (percentage >= 100 && !budget.isAlerted) {
        budget.isAlerted = true;
        await budget.save();
        alertMessage = "⚠️ Has superado tu presupuesto mensual";
      } else if (percentage >= 80 && !budget.isAlerted) {
        alertMessage = `⚠️ Has utilizado el ${percentage.toFixed(0)}% de tu presupuesto mensual`;
      }
    }

    res.status(201).json({
      message: "Gasto registrado correctamente",
      expense,
      ...(alertMessage && { alert: alertMessage }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar gasto" });
  }
};

// ======================
// UPDATE EXPENSE
// ======================
export const updateExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, description, date, categoryId } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!expense) {
      res.status(404).json({ message: "Gasto no encontrado" });
      return;
    }

    if (amount !== undefined && amount <= 0) {
      res.status(400).json({ message: "El monto debe ser mayor a 0" });
      return;
    }

    if (amount !== undefined) expense.amount = amount;
    if (description) expense.description = description;
    if (date) expense.date = date;
    if (categoryId) expense.categoryId = categoryId;

    await expense.save();

    res.json({ message: "Gasto actualizado", expense });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar gasto" });
  }
};

// ======================
// DELETE EXPENSE
// ======================
export const deleteExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!expense) {
      res.status(404).json({ message: "Gasto no encontrado" });
      return;
    }

    await expense.deleteOne();
    res.json({ message: "Gasto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar gasto" });
  }
};