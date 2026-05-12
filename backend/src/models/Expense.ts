/**
 * @openapi
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - amount
 *         - description
 *         - categoryId
 *       properties:
 *         amount:
 *           type: number
 *           description: Monto del gasto
 *         description:
 *           type: string
 *           description: Concepto del gasto
 *         categoryId:
 *           type: string
 *           description: ID de la categoría asociada
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha del gasto
 */

import mongoose, { Schema, model, Document } from "mongoose";

export interface IExpense extends Document {
    amount: number;
    description: string;
    date: Date;
    categoryId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
}


const expenseSchema = new Schema<IExpense>(
    {
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Expense = model<IExpense>("Expense", expenseSchema);