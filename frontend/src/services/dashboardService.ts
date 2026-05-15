import axios from "axios";

const API_URL = "https://fitbudget.onrender.com";

export const getDashboardSummary = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/dashboard/summary`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};