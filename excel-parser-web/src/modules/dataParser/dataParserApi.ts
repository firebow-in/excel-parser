import { VITE_API_BASE_URL, PAGE_LIMIT } from "./dataParser.constants";
import type { ApiResponse, PaginatedApiResponse, RecordRow, RowData, UploadData } from "./dataParser.types";

export const DATA_PARSER_ENDPOINTS = {
  GET_UPLOAD_BY_ID: (id: number) => `${VITE_API_BASE_URL}/uploads/${id}`,
  GET_RECORDS: (worksheetId: string, page: number, search?: string) => {
    const baseUrl = `${VITE_API_BASE_URL}/records?worksheetId=${worksheetId}&page=${page}&limit=${PAGE_LIMIT}`;
    return search ? `${baseUrl}&search=${encodeURIComponent(search)}` : baseUrl;
  },
  UPDATE_RECORD: (id: number) => `${VITE_API_BASE_URL}/records/${id}`,
  ADD_RECORD: (worksheetId: number) => `${VITE_API_BASE_URL}/worksheets/${worksheetId}/records`,
  DELETE_RECORD: (id: number) => `${VITE_API_BASE_URL}/records/${id}`,
} as const;

export const dataParserApi = {
  getUploadById: async (id: number): Promise<ApiResponse<UploadData>> => {
    const response = await fetch(DATA_PARSER_ENDPOINTS.GET_UPLOAD_BY_ID(id));
    const data = await response.json();
    return data;
  },
  getRecords: async (worksheetId: string, page: number, search?: string): Promise<PaginatedApiResponse<RecordRow[]>> => {
    const response = await fetch(DATA_PARSER_ENDPOINTS.GET_RECORDS(worksheetId, page, search));
    const data = await response.json();
    return data;
  },

  updateRecord: async (id: number, updatedRowData: RowData): Promise<ApiResponse<RecordRow>> => {
    const res = await fetch(DATA_PARSER_ENDPOINTS.UPDATE_RECORD(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowData: updatedRowData }),
    });
    return res.json();
  },

  addRecord: async (worksheetId: number, rowData: RowData): Promise<ApiResponse<RecordRow>> => {
    const res = await fetch(DATA_PARSER_ENDPOINTS.ADD_RECORD(worksheetId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowData }),
    });
    return res.json();
  },

  deleteRecord: async (id: number): Promise<ApiResponse<void>> => {
    const res = await fetch(DATA_PARSER_ENDPOINTS.DELETE_RECORD(id), {
      method: "DELETE",
    });
    return res.json();
  },
};

