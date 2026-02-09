import axios from "axios";

const API_BASE = "http://localhost:8080";

export const loginUser = async (data) => {
  const response = await axios.post(`${API_BASE}/api/auth/login`, data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${API_BASE}/api/auth/register`, data);
  return response.data;
};
