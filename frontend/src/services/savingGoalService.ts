import axios from "axios";

const API_URL =
    "http://localhost:3000/api/saving-goals";

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

export const getSavingGoals =
    async () => {
        const response =
            await axios.get(
                API_URL,
                getAuthHeaders()
            );

        return response.data;
    };

export const createSavingGoal =
    async (
        goalData: any
    ) => {
        const response =
            await axios.post(
                API_URL,
                goalData,
                getAuthHeaders()
            );

        return response.data;
    };

export const updateSavingGoal =
    async (
        id: string,
        goalData: any
    ) => {
        const response =
            await axios.put(
                `${API_URL}/${id}`,
                goalData,
                getAuthHeaders()
            );

        return response.data;
    };

export const deleteSavingGoal =
    async (id: string) => {
        const response =
            await axios.delete(
                `${API_URL}/${id}`,
                getAuthHeaders()
            );

        return response.data;
    };