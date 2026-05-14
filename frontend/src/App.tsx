import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import IncomesPage from "./pages/IncomesPage";
import SavingGoalsPage from "./pages/savingGoalsPage";
import BudgetsPage from "./pages/BudgetsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/oauth-callback" element={<OAuthCallbackPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/expenses"
                    element={
                        <ProtectedRoute>
                            <ExpensesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/incomes"
                    element={
                        <ProtectedRoute>
                            <IncomesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/saving-goals"
                    element={
                        <ProtectedRoute>
                            <SavingGoalsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/budgets"
                    element={
                        <ProtectedRoute>
                            <BudgetsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;