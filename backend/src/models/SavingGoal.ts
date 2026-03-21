 import mongoose, { Document, Schema } from 'mongoose';

export interface ISavingGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  completed: boolean;
}

const savingGoalSchema = new Schema<ISavingGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'El nombre de la meta es obligatorio'], trim: true },
    targetAmount: { type: Number, required: [true, 'El monto objetivo es obligatorio'], min: [0.01, 'El monto objetivo debe ser mayor a 0'] },
    currentAmount: { type: Number, default: 0, min: 0 },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISavingGoal>('SavingGoal', savingGoalSchema);