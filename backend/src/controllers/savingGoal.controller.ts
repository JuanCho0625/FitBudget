import { Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";
import { SavingGoal } from "../models/SavingGoal";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendEmail } from "../services/email.service";
 
// Helper — emite por socket solo si io está disponible (no en tests)
const emit = (req: AuthRequest, event: string, data: any) => {
    try {
        const io = req.app.get("io");
        if (io) io.to(req.userId?.toString()).emit(event, data);
    } catch (_) { /* silencioso en tests */ }
};
 
export const getSavingGoals = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.query;
        const filter: any = { userId: req.userId };
        if (status) filter.status = status;
 
        const goals = await SavingGoal.find(filter).sort({ createdAt: -1 });
        const result = goals.map((g) => ({
            ...g.toObject(),
            progressPercentage:
                g.targetAmount > 0
                    ? Math.min((g.currentAmount / g.targetAmount) * 100, 100).toFixed(1)
                    : "0.0",
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener metas de ahorro" });
    }
};
 
export const getSavingGoalById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: "ID con formato inválido" });
            return;
        }
 
        const goal = await SavingGoal.findOne({ _id: req.params.id, userId: req.userId });
        if (!goal) {
            res.status(404).json({ message: "Meta de ahorro no encontrada" });
            return;
        }
        res.json({
            ...goal.toObject(),
            progressPercentage:
                goal.targetAmount > 0
                    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(1)
                    : "0.0",
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener meta de ahorro" });
    }
};
 
export const createSavingGoal = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Acepta tanto "name" (usado en tests) como "goalName" (nombre original)
        const goalName = req.body.goalName || req.body.name;
        const { targetAmount, deadline, currentAmount } = req.body;
 
        if (!goalName || !targetAmount || !deadline) {
            res.status(400).json({ message: "Nombre, monto objetivo y fecha límite son obligatorios" });
            return;
        }
        if (targetAmount <= 0) {
            res.status(400).json({ message: "El monto objetivo debe ser mayor a 0" });
            return;
        }
        if (new Date(deadline) <= new Date()) {
            res.status(400).json({ message: "La fecha límite debe ser futura" });
            return;
        }
 
        const goal = new SavingGoal({
            userId: req.userId,
            goalName,
            targetAmount,
            currentAmount: currentAmount || 0,
            deadline,
            status: "active",
        });
 
        await goal.save();
 
        emit(req, "update-saving-goal", {
            ...goal.toObject(),
            progressPercentage: Math.min(
                (goal.currentAmount / goal.targetAmount) * 100,
                100
            ).toFixed(1),
        });
 
        res.status(201).json({ message: "Meta de ahorro creada correctamente", goal });
    } catch (error) {
        res.status(500).json({ message: "Error al crear meta de ahorro" });
    }
};
 
export const updateSavingGoal = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: "ID con formato inválido" });
            return;
        }
 
        const { goalName, targetAmount, currentAmount, deadline, status, addAmount } = req.body;
        const goal = await SavingGoal.findOne({ _id: req.params.id, userId: req.userId });
 
        if (!goal) {
            res.status(404).json({ message: "Meta de ahorro no encontrada" });
            return;
        }
 
        const wasCompleted = goal.status === "completed";
 
        if (goalName) goal.goalName = goalName;
        if (targetAmount !== undefined) {
            if (targetAmount <= 0) {
                res.status(400).json({ message: "El monto objetivo debe ser mayor a 0" });
                return;
            }
            goal.targetAmount = targetAmount;
        }
        if (deadline) goal.deadline = deadline;
        if (status) goal.status = status;
 
        if (addAmount !== undefined) {
            if (addAmount <= 0) {
                res.status(400).json({ message: "El monto a abonar debe ser mayor a 0" });
                return;
            }
            goal.currentAmount = Math.min(goal.currentAmount + addAmount, goal.targetAmount);
        } else if (currentAmount !== undefined) {
            if (currentAmount < 0) {
                res.status(400).json({ message: "El monto no puede ser negativo" });
                return;
            }
            goal.currentAmount = Math.min(currentAmount, goal.targetAmount);
        }
 
        const justCompleted =
            !wasCompleted &&
            goal.status !== "paused" &&
            goal.currentAmount >= goal.targetAmount;
 
        if (justCompleted) goal.status = "completed";
 
        await goal.save();
 
        if (justCompleted) {
            try {
                const user = await User.findById(req.userId);
                if (user)
                    await sendEmail(user.email, "goalCompleted", {
                        userName: user.name,
                        goalName: goal.goalName,
                        targetAmount: goal.targetAmount,
                    });
            } catch (_) { /* no romper si el email falla */ }
        }
 
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const progressPercentage = Math.min(progress, 100).toFixed(1);
 
        emit(req, "update-saving-goal", { ...goal.toObject(), progressPercentage });
        if (justCompleted) {
            emit(req, "notification", {
                type: "success",
                message: `🎉 ¡Felicidades! Has alcanzado tu meta de ahorro: ${goal.goalName}`,
            });
        }
 
        res.json({
            message: "Meta de ahorro actualizada",
            goal: { ...goal.toObject(), progressPercentage },
            ...(justCompleted && { alert: "🎉 ¡Felicidades! Has alcanzado tu meta de ahorro" }),
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar meta de ahorro" });
    }
};
 
export const deleteSavingGoal = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ message: "ID con formato inválido" });
            return;
        }
 
        const goal = await SavingGoal.findOne({ _id: req.params.id, userId: req.userId });
        if (!goal) {
            res.status(404).json({ message: "Meta de ahorro no encontrada" });
            return;
        }
 
        await goal.deleteOne();
 
        emit(req, "delete-saving-goal", req.params.id);
 
        res.json({ message: "Meta de ahorro eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar meta de ahorro" });
    }
};