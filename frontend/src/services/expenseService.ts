import axios from "axios";

const API_URL =
    "http://localhost:3000/api/expenses";

export const getExpenses = async () => {
    const token =
        localStorage.getItem("token");

    const response = await axios.get(
        API_URL,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const createExpense = async (
    expenseData: any
) => {
    const token =
        localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        expenseData,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const updateExpense = async (
    id: string,
    expenseData: any
) => {
    const token =
        localStorage.getItem("token");

    const response = await axios.put(
        `${API_URL}/${id}`,
        expenseData,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteExpense = async (
    id: string
) => {
    const token =
        localStorage.getItem("token");

    const response = await axios.delete(
        `${API_URL}/${id}`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    return response.data;
};