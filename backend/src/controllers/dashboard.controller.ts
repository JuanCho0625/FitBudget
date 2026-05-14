import { Response } from "express";
import mongoose from "mongoose";
import { Expense } from "../models/Expense";
import { Income } from "../models/Income";
import { SavingGoal } from "../models/SavingGoal";
import { AuthRequest } from "../middlewares/auth.middleware";

// ======================
// GET SUMMARY (filtrado por usuario)
// ======================
export const getSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const [totalIncomeResult, totalExpensesResult, totalSavedResult] = await Promise.all([
            Income.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Expense.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            SavingGoal.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: "$currentAmount" } } },
            ]),
        ]);

        const totalIncomes = totalIncomeResult[0]?.total || 0;
        const totalExpenses = totalExpensesResult[0]?.total || 0;
        const totalSaved = totalSavedResult[0]?.total || 0;

        res.json({
            totalIncomes,
            totalExpenses,
            totalSaved,
            balance: totalIncomes - totalExpenses - totalSaved,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo resumen" });
    }
};

// ======================
// GASTOS POR CATEGORÍA (del usuario)
// ======================
export const getExpensesByCategory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        const data = await Expense.aggregate([
            { $match: { userId: new (require("mongoose").Types.ObjectId)(userId) } },
            { $group: { _id: "$categoryId", total: { $sum: "$amount" } } },
        ]);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo gastos por categoría" });
    }
};

// ======================
// GASTOS POR MES (del usuario)
// ======================
export const getMonthlyExpenses = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        const data = await Expense.aggregate([
            { $match: { userId: new (require("mongoose").Types.ObjectId)(userId) } },
            { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } },
            { $sort: { _id: 1 } },
        ]);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo gastos mensuales" });
    }
};

// ======================
// INGRESOS POR MES (del usuario)
// ======================
export const getMonthlyIncome = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        const data = await Income.aggregate([
            { $match: { userId: new (require("mongoose").Types.ObjectId)(userId) } },
            { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } },
            { $sort: { _id: 1 } },
        ]);

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo ingresos mensuales" });
    }
};