import { request } from "./httpClient";
import { getAuthToken } from "../utils/auth";

const withAuth = () => {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

export const registerUser = ({ email, name, password }) => {
  return request("/auth/register", {
    method: "POST",
    body: { email, name, password },
  });
};

export const loginUser = ({ email, password }) => {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
};

export const fetchMe = () => {
  return request("/auth/me", {
    method: "GET",
    headers: withAuth(),
  });
};
