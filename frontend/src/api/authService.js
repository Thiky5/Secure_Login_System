import axiosClient from "./axiosClient";

export function register({ username, email, password }) {
  return axiosClient.post("/auth/register", { username, email, password });
}

export function login({ username, password }) {
  return axiosClient.post("/auth/login", { username, password });
}

export function getCurrentUser() {
  return axiosClient.get("/users/me");
}
