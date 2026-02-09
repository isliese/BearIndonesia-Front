import { getAuthToken } from "../utils/auth";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const {
    method = "GET",
    headers,
    body,
    responseType = "json",
    signal,
  } = options;

  const token = getAuthToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...authHeader, ...headers },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorData = null;
    if (errorText) {
      try {
        errorData = JSON.parse(errorText);
      } catch {
        // ignore parse error
      }
    }
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      errorText ||
      `Request failed: ${response.status} ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.body = errorText;
    error.data = errorData;
    throw error;
  }

  if (responseType === "blob") return response.blob();
  if (responseType === "text") return response.text();
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
};

export { request };
