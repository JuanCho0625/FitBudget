export interface IFinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  totalSaved: number;
  updatedAt: Date;
}

export interface INotification {
    type: 'warning' | 'success' | 'info';
    message: string;
}

export interface ServerToClientEvents {
  "update-dashboard": (data: IFinancialSummary) => void;
  "notification": (data: INotification) => void;
  "update-saving-goal": (data: any) => void;
  "delete-saving-goal": (goalId: string) => void;
}

export interface ClientToServerEvents {
  "join-user-room": (userId: string) => void;
}