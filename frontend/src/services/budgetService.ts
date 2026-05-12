import axios from "axios";

const API_URL =
    "http://localhost:3000/api/budgets";

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

export const getBudgets =
    async () => {
        const response =
            await axios.get(
                API_URL,
                getAuthHeaders()
            );

        return response.data;
    };

export const createBudget =
    async (
        budgetData: any
    ) => {
        const response =
            await axios.post(
                API_URL,
                budgetData,
                getAuthHeaders()
            );

        return response.data;
    };

export const updateBudget =
    async (
        id: string,
        budgetData: any
    ) => {
        const response =
            await axios.put(
                `${API_URL}/${id}`,
                budgetData,
                getAuthHeaders()
            );

        return response.data;
    };

export const deleteBudget =
    async (id: string) => {
        const response =
            await axios.delete(
                `${API_URL}/${id}`,
                getAuthHeaders()
            );

        return response.data;
    };