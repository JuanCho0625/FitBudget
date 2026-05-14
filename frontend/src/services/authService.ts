import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const loginUser = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const registerUser = async (name: string, email: string, password: string) => {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;
};

export const GOOGLE_AUTH_URL = `${API_URL}/google`;