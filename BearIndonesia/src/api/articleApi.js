import { request } from "./httpClient";

export const searchArticles = ({ query, sortBy = "relevance", filterType = "all" }) => {
  return request("/api/search", {
    method: "POST",
    body: { query, sortBy, filterType },
  });
};

export const fetchAllArticles = () => {
  return request("/api/articles").then((data) => {
    const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
    return results.map((item) => ({
      ...item,
      id: item?.id ?? item?.rawNewsId ?? item?.raw_news_id ?? null,
    }));
  });
};
