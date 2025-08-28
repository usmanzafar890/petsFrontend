import api from "../api";
import type { SignUpData, LoginData } from "../types";

export const signUp = async (data: SignUpData) => {
  const response = await api.post("/users/register", data);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/users/login", data);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};
