import { getAuthToken } from "../utils/auth";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value || ""));

const request = async (path, options = {}) => {
  const {
    method = "GET",
    headers,
    body,
    responseType = "json",
    signal,
  } = options;

  const url = isAbsoluteUrl(path) ? String(path) : `${BASE_URL}${path}`;

  const token = getAuthToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...authHeader, ...headers },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    if (response.status === 401) {
      try {
        window.dispatchEvent(new Event("app-auth-required"));
      } catch {
        // ignore
      }
      const error = new Error("로그인이 필요합니다.");
      error.status = response.status;
      throw error;
    }
    if (response.status === 403) {
      try {
        window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "권한이 없습니다.", type: "info" } }));
      } catch {
        // ignore
      }
      const error = new Error("권한이 없습니다.");
      error.status = response.status;
      throw error;
    }

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
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  if (!text) return null;

  // Defensive: avoid crashing on HTML (e.g., dev server index.html) when JSON was expected.
  if (responseType === "json") {
    const looksLikeHtml = /^\s*</.test(text);
    const isJson = contentType.toLowerCase().includes("application/json");
    if (!isJson && looksLikeHtml) {
      const error = new Error(`JSON 응답이 필요하지만 HTML을 받았습니다. 백엔드 주소(VITE_API_BASE_URL) 설정을 확인해주세요. (${url})`);
      error.status = response.status;
      error.body = text.slice(0, 200);
      throw error;
    }
    try {
      return JSON.parse(text);
    } catch {
      const error = new Error(`JSON 파싱에 실패했습니다. (${url})`);
      error.status = response.status;
      error.body = text.slice(0, 200);
      throw error;
    }
  }

  return JSON.parse(text);
};

export { request };
