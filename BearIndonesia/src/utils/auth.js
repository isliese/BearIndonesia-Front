const AUTH_USER_KEY = "bear_auth_user";
const AUTH_TOKEN_KEY = "bear_auth_token";

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAuthUser = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed;
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
};

export const setAuthSession = ({ token, user }) => {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (user) window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("authchange"));
};

export const setAuthUser = (user) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("authchange"));
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event("authchange"));
};

export const getDisplayName = (user) => {
  if (!user) return "";
  if (user.name) return user.name;
  if (user.email) return String(user.email).split("@")[0];
  return "User";
};
