import { addScrap, fetchScraps, removeScrap } from "../api/scrapApi";
import { getAuthToken } from "./auth";

const SCRAP_CACHE_KEY = "bear_scrapped_ids";

const safeParse = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const getCache = () => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SCRAP_CACHE_KEY);
  const list = raw ? safeParse(raw) : [];
  return Array.isArray(list) ? list : [];
};

const setCache = (ids) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SCRAP_CACHE_KEY, JSON.stringify(ids));
};

export const clearScrapCache = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SCRAP_CACHE_KEY);
  window.dispatchEvent(new Event("scrapchange"));
};

export const getArticleKey = (article) => {
  if (!article) return "";
  return (
    article.id ||
    article.rawNewsId ||
    article.raw_news_id ||
    article.rawnewsId ||
    ""
  );
};

export const isScrapped = (article) => {
  if (!getAuthToken()) return false;
  const key = getArticleKey(article);
  if (!key) return false;
  return getCache().includes(key);
};

export const syncScrapList = async () => {
  if (!getAuthToken()) {
    clearScrapCache();
    return [];
  }
  const list = await fetchScraps();
  const ids = list.map((item) => item.id).filter(Boolean);
  setCache(ids);
  window.dispatchEvent(new Event("scrapchange"));
  return list;
};

export const toggleScrap = async (article, options = {}) => {
  const token = getAuthToken();
  const key = getArticleKey(article);
  if (!token || !key) return false;
  const cached = getCache();
  const exists = cached.includes(key);
  if (exists) {
    await removeScrap(key);
    const next = cached.filter((id) => id !== key);
    setCache(next);
    window.dispatchEvent(new Event("scrapchange"));
    return false;
  }
  const comment = typeof options?.comment === "string" ? options.comment.slice(0, 300) : undefined;
  await addScrap(key, comment !== undefined ? { comment } : undefined);
  const next = [key, ...cached];
  setCache(next);
  window.dispatchEvent(new Event("scrapchange"));
  return true;
};
