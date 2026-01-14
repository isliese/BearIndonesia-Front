import { fetchWordCloud } from "../api/statsApi";

export const getWordCloud = async (params) => {
  return fetchWordCloud(params);
};
