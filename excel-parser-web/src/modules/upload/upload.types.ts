export interface UploadResponse {
  success: boolean
  uploadId: number
}

export interface UploadHistoryItem {
  id: number
  fileName: string
}

export interface UploadHistoryResponse {
  success: boolean
  data: UploadHistoryItem[]
}

export interface RenameUploadResponse {
  success: boolean
  data: UploadHistoryItem
}

export interface DeleteUploadResponse {
  success: boolean
  message: string
}