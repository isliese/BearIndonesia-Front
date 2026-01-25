import { request } from "./httpClient";

export const searchArticles = ({ query, sortBy = "relevance", filterType = "all" }) => {
  return request("/api/search", {
    method: "POST",
    body: { query, sortBy, filterType },
  });
};

export const fetchAllArticles = () => {
  return request("/api/articles");
};
