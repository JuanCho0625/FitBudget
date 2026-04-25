import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { getUserFinancialSummary } from "../services/financialService";

export const createTransaction = async (req: any, res: Response) => {  
    try {
        const userId = req.userId || req.body.user; 
        const newExpense = await Expense.create({ ...req.body, userId: userId });
        
        const summary = await getUserFinancialSummary(userId);
        const io = req.app.get('io');

         
        io.to(userId).emit('update-dashboard', summary);
 
        io.to(userId).emit('new-expense', newExpense);

        res.status(201).json(newExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear gasto' });
    }
}

export const deleteTransaction = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId || req.body.user;

        // Buscamos el gasto primero para verificar que le pertenece al usuario
        const expense = await Expense.findOne({ _id: id, userId: userId });

        if (!expense) {
            return res.status(404).json({ message: "Gasto no encontrado" });
        }

        await expense.deleteOne();

        // RECALCULAR Y EMITIR (Igual que en create)
        const summary = await getUserFinancialSummary(userId);
        const io = req.app.get('io');
        
        // Notificamos que el dashboard cambió porque eliminamos un gasto
        io.to(userId).emit('update-dashboard', summary);
        // Notificamos específicamente qué ID se eliminó para limpiar la lista en el front
        io.to(userId).emit('expense-deleted', id);

        res.json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar gasto" });
    }
};

export const updateTransaction = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId || req.body.user;

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId: userId },
            req.body,
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Gasto no encontrado" });
        }

        // RECALCULAR Y EMITIR
        const summary = await getUserFinancialSummary(userId);
        const io = req.app.get('io');
        
        io.to(userId).emit('update-dashboard', summary);

        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar gasto" });
    }
};