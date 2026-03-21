 import mongoose, { Document, Schema } from 'mongoose';

export interface IIncome extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description?: string;
  date: Date;
}

const incomeSchema = new Schema<IIncome>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: [true, 'El monto es obligatorio'], min: [0.01, 'El monto debe ser mayor a 0'] },
    category: { type: String, enum: ['sueldo', 'apoyo_familiar', 'beca', 'trabajo_temporal', 'otro'], default: 'otro' },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IIncome>('Income', incomeSchema);