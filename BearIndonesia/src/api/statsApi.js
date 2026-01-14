import { request } from "./httpClient";

const buildQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    qs.append(key, String(value));
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
};

export const fetchWordCloud = (params) => {
  return request(`/api/stats/wordcloud${buildQuery(params)}`);
};
