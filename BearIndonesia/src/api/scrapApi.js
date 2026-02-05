import { request } from "./httpClient";
import { getAuthToken } from "../utils/auth";

const withAuth = () => {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

export const fetchScraps = () => {
  return request("/api/scrap", {
    method: "GET",
    headers: withAuth(),
  });
};

export const addScrap = (rawNewsId) => {
  return request(`/api/scrap/${rawNewsId}`, {
    method: "POST",
    headers: withAuth(),
  });
};

export const removeScrap = (rawNewsId) => {
  return request(`/api/scrap/${rawNewsId}`, {
    method: "DELETE",
    headers: withAuth(),
  });
};
