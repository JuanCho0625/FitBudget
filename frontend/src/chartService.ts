import axios from "axios";

const API_URL = "https://fitbudget.onrender.com";

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