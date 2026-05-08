import { Response } from "express";
import mongoose from "mongoose";
import { Expense } from "../models/Expense";
import { getUserFinancialSummary } from "../services/financialService";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const newExpense = await Expense.create({ ...req.body, userId });

        // Socket.io es opcional — en tests el app no tiene 'io' montado
        try {
            const io = req.app.get("io");
            if (io) {
                const summary = await getUserFinancialSummary(userId as string);
                io.to(userId).emit("update-dashboard", summary);
                io.to(userId).emit("new-expense", newExpense);
            }
        } catch (_) { /* silencioso en tests */ }

        res.status(201).json(newExpense);
    } catch (error) {
       if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            message: "Error de validación",
            errors: Object.values(error.errors).map((e) => e.message),
        });
    }
    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({ message: "ID con formato inválido" });
    }

    console.error(error); 
    res.status(500).json({ message: "Error al crear gasto" });
    }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID con formato inválido" });
        }

        const expense = await Expense.findOne({ _id: id, userId });

        if (!expense) {
            return res.status(404).json({ message: "Gasto no encontrado" });
        }

        await expense.deleteOne();

        try {
            const io = req.app.get("io");
            if (io) {
                const summary = await getUserFinancialSummary(userId as string);
                io.to(userId).emit("update-dashboard", summary);
                io.to(userId).emit("expense-deleted", id);
            }
        } catch (_) { /* silencioso en tests */ }

        res.json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: "ID con formato inválido" });
        }
        res.status(500).json({ message: "Error al eliminar gasto" });
    }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID con formato inválido" });
        }

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Gasto no encontrado" });
        }

        try {
            const io = req.app.get("io");
            if (io) {
                const summary = await getUserFinancialSummary(userId as string);
                io.to(userId).emit("update-dashboard", summary);
            }
        } catch (_) { /* silencioso en tests */ }

        res.json(updatedExpense);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: "Error de validación",
                errors: Object.values(error.errors).map((e) => e.message),
            });
        }
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: "ID con formato inválido" });
        }
        res.status(500).json({ message: "Error al actualizar gasto" });
    }
};