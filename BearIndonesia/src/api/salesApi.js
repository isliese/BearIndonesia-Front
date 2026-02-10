import { request } from "./httpClient";

// Admin-only Sales visualization reports
export const fetchSalesReports = () => {
  return request("/admin/sales/reports", { method: "GET" });
};

export const uploadSalesReport = ({ file, title }) => {
  const form = new FormData();
  form.append("file", file);
  if (title) form.append("title", title);
  return request("/admin/sales/reports", { method: "POST", body: form });
};

export const fetchSalesReportHtml = (id) => {
  return request(`/admin/sales/reports/${id}/html`, { method: "GET", responseType: "text" });
};

