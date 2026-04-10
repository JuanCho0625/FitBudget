import mongoose, {Schema, model, Document} from 'mongoose';

export interface IBudget extends Document{
    userId: mongoose.Types.ObjectId;
    monthlyLimit: number;
    month: number;
    year: number;
    isAlerted: boolean;
}


const budgetSchema = new Schema<IBudget>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    monthlyLimit: { 
      type: Number, 
      required: true,
      min: 0 
    },
    month: { 
      type: Number, 
      required: true,
      min: 1,
      max: 12
    },
    year: { 
      type: Number, 
      required: true,
      default: () => new Date().getFullYear()
    },
    isAlerted: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const Budget = model<IBudget>("Budget", budgetSchema);