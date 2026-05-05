import mongoose, {Schema, model, Document} from "mongoose";

export interface ISavingGoal extends Document {
  userId: mongoose.Types.ObjectId;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  status: 'active' | 'completed' | 'paused';   
}

const savingGoalSchema = new Schema<ISavingGoal>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    goalName: { 
      type: String, 
      required: [true, "El nombre de la meta es obligatorio"],
      trim: true 
    },
    targetAmount: { 
      type: Number, 
      required: true,
      min: 1 
    },
    currentAmount: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    deadline: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      default: 'active',
      enum: ['active', 'completed', 'paused'] 
    }
  },
  { 
    timestamps: true 
  }
);

export const SavingGoal = model<ISavingGoal>("SavingGoal", savingGoalSchema);