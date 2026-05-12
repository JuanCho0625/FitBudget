import axios from "axios";

const API_URL =
    "http://localhost:3000/api/incomes";

export const getIncomes = async () => {
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

export const createIncome = async (
    incomeData: any
) => {
    const token =
        localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        incomeData,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const updateIncome = async (
    id: string,
    incomeData: any
) => {
    const token =
        localStorage.getItem("token");

    const response = await axios.put(
        `${API_URL}/${id}`,
        incomeData,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const deleteIncome = async (
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