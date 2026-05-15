import axios from "axios";

const API_URL = "https://fitbudget.onrender.com/api/categories";

const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getCategories = async (type?: "income" | "expense") => {
    const url = type ? `${API_URL}?type=${type}` : API_URL;
    const response = await axios.get(url, authHeaders());
    return response.data;
};

export const createCategory = async (data: { name: string; type: "income" | "expense"; color?: string }) => {
    const response = await axios.post(API_URL, data, authHeaders());
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, authHeaders());
    return response.data;
};