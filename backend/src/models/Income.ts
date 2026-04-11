import mongoose, { Document, model, Schema } from "mongoose";

export interface IIncome extends Document {
  categoryId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const incomeSchema = new Schema<IIncome>(
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
  }
);

incomeSchema.index({ userId: 1, categoryId: 1 });

export const Income = model<IIncome>("Income", incomeSchema);
