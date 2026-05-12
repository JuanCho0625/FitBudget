import axios from "axios";

const API_URL = "http://localhost:3000/api/dashboard";

export const getExpensesByCategory = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/expenses-by-category`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getMonthlyExpenses = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/monthly-expenses`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};