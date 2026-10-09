export const ALLOWED_FILE_TYPES = [".xlsx", ".xls", ".csv"] as const
export const ALLOWED_FILE_ACCEPT = ALLOWED_FILE_TYPES.join(",")

export const UPLOAD_MESSAGES = {
  NO_FILE_SELECTED: "Please select a file.",
  INVALID_FILE_TYPE: "Only .xlsx, .xls and .csv files are allowed.",
  UPLOAD_SUCCESS: "File uploaded successfully.",
  UPLOAD_FAILED: "Failed to upload file.",
  DELETE_CONFIRM: "Delete this upload?",
} as const

export const UPLOAD_TEXT = {
  TITLE_FIRST: "Excel",
  TITLE_LAST: "Parser",
  DESCRIPTION:
    "Upload your spreadsheet for systematic analysis and validation.",
  SUPPORTED_FILES: "Supports .xlsx, .xls, .csv",
  UPLOAD_BUTTON: "Process File",
  UPLOADING_BUTTON: "Processing...",
  CHOOSE_FILE: "or click to browse from",
  CHOOSE_FILE_SUB: "your computer",
  DRAG_DROP_TITLE: "Drag & Drop your file here",
  INFO_NOTE:
    "Maximum file size is 5MB. Large files may take a few moments to process depending on complexity and macro content, and users can upload only one file at a time.",
} as const
