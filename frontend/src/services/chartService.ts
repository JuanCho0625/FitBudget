import axios from "axios";

const API_URL =
    "http://localhost:3000/api/charts";

const getAuthHeaders = () => {
    const token =
        localStorage.getItem(
            "token"
        );

    return {
        headers: {
            Authorization:
                `Bearer ${token}`,
        },
    };
};

export const getExpensesByCategory =
    async () => {
        const response =
            await axios.get(
                `${API_URL}/expenses-by-category`,
                getAuthHeaders()
            );

        return response.data;
    };

export const getMonthlyExpenses =
    async () => {
        const response =
            await axios.get(
                `${API_URL}/monthly-expenses`,
                getAuthHeaders()
            );

        return response.data;
    };