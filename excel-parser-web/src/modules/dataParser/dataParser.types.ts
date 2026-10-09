import type { ChangeEvent, Dispatch, SetStateAction } from "react"

import type { UploadHistoryItem } from "../upload/upload.types"

export interface Worksheet {
  id: number;
  name: string;
}

export interface UploadData {
  id: number;
  fileName: string;
  worksheets: Worksheet[];
}

export type CellValue = string | number | boolean | null

export type RowData = Record<string, CellValue>

export interface RecordRow {
  id: number;
  rowData: RowData;
  isNew?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    currentPage: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  totalPages: number;
  totalRecords: number;
}

export interface DataParserContextType {
  upload: UploadData | null;

  handleUploadComplete: (upload: UploadData) => void;

  worksheets: Worksheet[];
  selectedWorksheetId: string;

  records: RecordRow[];

  search: string;
  page: number;
  totalPages: number;
  totalRecords: number;

  loading: boolean;
  error: string | null;

  editingRowId: number | null;
  editData: RowData;
  allUploads: UploadHistoryItem[];
  handleWorksheetChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSearchChange: (value: string) => void;
  selectUpload: (uploadId: number) => Promise<void>;
  handlePageChange: (action: "prev" | "next") => void;
  fetchUploadHistory: () => Promise<void>;
  deleteUpload: (id: number) => Promise<void>;
  renameUpload: (id: number, newName: string) => Promise<void>;
  updateCell: (recordId: number, updatedRowData: RowData) => Promise<void>;
  addRow: () => Promise<void>;
  deleteRow: (recordId: number) => Promise<void>;
  fetchRecords: () => Promise<void>;
  refreshData: () => void;
  saveEdit: (id: number) => Promise<void>;
  handleSave: (tempId: number) => Promise<void>;
  handleAddRow: () => void;
  handleDoubleClick: (row: RecordRow) => void;
  cancelEdit: () => void;
  cancelAddRow: (rowId: number) => void;
  updateEditData: (header: string, value: CellValue) => void;
}

export interface WorksheetSubModuleProps {
  upload: UploadData | null;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export interface RecordsSubModuleProps {
  selectedWorksheetId: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}
