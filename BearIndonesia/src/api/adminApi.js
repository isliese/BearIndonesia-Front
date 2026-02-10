import { request } from "./httpClient";

// Admin-only APIs (always call backend base URL, not frontend route)
const API_BASE = import.meta.env?.VITE_API_BASE_URL || "";
const joinUrl = (base, path) => {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
};

export const fetchAdminUsers = () => {
  if (!API_BASE) {
    throw new Error("ADMIN API 호출을 위해 VITE_API_BASE_URL 설정이 필요합니다.");
  }
  return request(joinUrl(API_BASE, "/admin/users"), { method: "GET" });
};

export const updateUserRole = (id, role) => {
  if (!API_BASE) {
    throw new Error("ADMIN API 호출을 위해 VITE_API_BASE_URL 설정이 필요합니다.");
  }
  return request(joinUrl(API_BASE, `/admin/users/${id}/role`), {
    method: "PATCH",
    body: { role },
  });
};

