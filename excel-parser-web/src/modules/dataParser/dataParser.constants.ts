export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
export const DEBOUNCE_DELAY = 300;
export const PAGE_LIMIT = 10;

export const MESSAGES = {
  LOADING_SETUP: "Loading....",
  LOADING_RECORDS: "Loading fresh records directly from database rows...",
  NO_RECORDS:
    "No records parsed for this configuration parameters matching view filters.",
  NETWORK_ERROR: "Server network error while loading setup data",
  FETCH_ERROR: "Error while connecting to database rows fetch api",
  DATA_NO_FOUND: " No records found. Upload an Excel file to see data here!",
  PLACEHOLDER: "Search inside row records...",
  LOADING: "Loading file data...",
} as const;

export const FILTER = {
  HEADING: "Filter Sheet Data",
  SELECT: "Select Worksheet",
  CONTEXT: "File Context",
  SEARCH_LABEL: "Search Data",
} as const;

export const PAGE = {
  HEAD: "Total Found:",
  STRONG: " rows",
  SPAN: "Page",
  STRONG_OF: "of",
  BTN_PREV: " Previous",
  BTN_NEXT: "Next",
  DELETE: "Delete",
  CANCEL: "Cancel",
  SAVE: "Save",
  ADDROW: "Add Row",
  REFRESH: "Update",
} as const;

export const DATA_PARSER_ERRORS = {
  FETCH_UPLOAD_HISTORY: "Error fetching upload history",
  DELETE_UPLOAD: "Error deleting upload",
  RENAME_UPLOAD: "Error renaming upload",
  FETCH_RECORDS: "Error fetching records",
  UPDATE_CELL: "Network error while updating cell",
  UPDATE_CELL_FAILED: "Failed to update cell",
  DELETE_ROW: "Network error while deleting row",
  DELETE_ROW_FAILED: "Failed to delete row",
  LOAD_WORKSHEETS: "Network error",
  SAVE_ROW: "Error saving data",
} as const;

export const TABLE = {
  ACTIONS_HEADER: "Actions",
  DELETE_CONFIRM_TITLE: "Delete row?",
  DELETE_CONFIRM_BODY: "This action cannot be undone. The row will be permanently removed.",
  DELETE_CONFIRM_LABEL: "Delete",
  SAVE_CONFIRM_TITLE: "Save changes?",
  SAVE_CONFIRM_BODY: "Are you sure you want to save the changes to this row?",
  SAVE_CONFIRM_LABEL: "Save",
} as const;
