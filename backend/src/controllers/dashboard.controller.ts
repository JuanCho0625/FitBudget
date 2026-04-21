import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { Income } from "../models/Income";

// resumen general
export const getSummary = async (req: Request, res: Response) => {
  try {
    const totalIncome = await Income.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const income = totalIncome[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;

    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo resumen",
    });
  }
};

// gastos por categoría
export const getExpensesByCategory = async (req: Request, res: Response) => {
  try {
    const data = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo gastos por categoría",
    });
  }
};


// gastos por mes
export const getMonthlyExpenses = async (req: Request, res: Response) => {
  try {
    const data = await Expense.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo gastos mensuales",
    });
  }
};

//ingresos por mes
export const getMonthlyIncome = async (req: Request, res: Response) => {
  try {
    const data = await Income.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo ingresos mensuales",
    });
  }
};