import { fetchNewsletter } from "../api/newsletterApi";

export const getNewsletter = async (params) => {
  return fetchNewsletter(params);
};
