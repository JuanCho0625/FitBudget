import mongoose, { Document, model, Schema } from "mongoose";

export interface IExpense extends Document {
    id: string;
    categoryId: mongoose.Types.ObjectId;
    amount: number;
    description: string;
    date: Date;
    userId: mongoose.Types.ObjectId;
}

const expenseSchema = new Schema<IExpense>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,  
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true, 
        },
        amount: {
            type: Number,
            required: [true, "El monto es obligatorio"],
            min: [0, "El monto no puede ser negativo"],
        },
        description: {
            type: String,
            required: [true, "La descripción es obligatoria"],
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,  
    },
);

expenseSchema.index({ userId: 1, categoryId: 1 });

export const Income = model<IExpense>('Expense', expenseSchema);
