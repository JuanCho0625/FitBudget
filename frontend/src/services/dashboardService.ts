import axios from "axios";

const API_URL = "http://localhost:3000/api";

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