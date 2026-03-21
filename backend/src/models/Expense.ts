 import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  budgetPercentage: number;
}

const expenseSchema = new Schema<IExpense>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: [true, 'El monto es obligatorio'], min: [0.01, 'El monto debe ser mayor a 0'] },
    category: { type: String, enum: ['comida', 'transporte', 'ocio', 'suscripciones', 'renta', 'escuela', 'otro'], default: 'otro' },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    budgetPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>('Expense', expenseSchema);