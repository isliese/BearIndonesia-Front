import { searchArticles } from "../api/articleApi";

export const getArticleSearchResults = async (query, options = {}) => {
  const data = await searchArticles({ query, ...options });
  return data?.results ?? [];
};
