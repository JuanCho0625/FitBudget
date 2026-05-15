import axios from "axios";

const API_URL = "https://fitbudget.onrender.com/api/dashboard/summary";

export const getDashboardSummary = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};