import { downloadExport } from "../api/exportApi";

export const downloadExportFile = async (params) => {
  return downloadExport(params);
};
