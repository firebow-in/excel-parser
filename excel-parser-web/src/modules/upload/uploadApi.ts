import { UPLOAD_MESSAGES } from "./upload.constants"
import type {
  DeleteUploadResponse,
  RenameUploadResponse,
  UploadHistoryResponse,
  UploadResponse,
} from "./upload.types"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1"
const UPLOAD_BASE = `${VITE_API_BASE_URL}/upload`

export const UPLOAD_ENDPOINTS = {
  UPLOAD: UPLOAD_BASE,
  GET_UPLOADS: UPLOAD_BASE,
  RENAME: (id: number) => `${UPLOAD_BASE}/${id}`,
  DELETE: (id: number) => `${UPLOAD_BASE}/${id}`,
} as const

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()

  formData.append("file", file)

  const response = await fetch(UPLOAD_ENDPOINTS.UPLOAD, {
    method: "POST",
    body: formData,
  })

  let result: (UploadResponse & { message?: string }) | null = null
  const contentType = response.headers.get("content-type")

  if (contentType && contentType.includes("application/json")) {
    try {
      result = await response.json()
    } catch (error) {
      console.error("Failed to parse JSON response:", error)
    }
  }


  if (!response.ok) {
    throw new Error(result?.message ?? UPLOAD_MESSAGES.UPLOAD_FAILED)
  }

  if (!result) {
    throw new Error(UPLOAD_MESSAGES.UPLOAD_FAILED)
  }

  return result
}

export const getUploads = async (): Promise<UploadHistoryResponse> => {
  const response = await fetch(UPLOAD_ENDPOINTS.UPLOAD)

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message ?? UPLOAD_MESSAGES.UPLOAD_FAILED)
  }

  return result
}

export const renameUpload = async (
  id: number,
  fileName: string,
): Promise<RenameUploadResponse> => {
  const response = await fetch(UPLOAD_ENDPOINTS.RENAME(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message ?? UPLOAD_MESSAGES.UPLOAD_FAILED)
  }

  return result
}

export const deleteUpload = async (
  id: number,
): Promise<DeleteUploadResponse> => {
  const response = await fetch(UPLOAD_ENDPOINTS.DELETE(id), {
    method: "DELETE",
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message ?? UPLOAD_MESSAGES.UPLOAD_FAILED)
  }

  return result
}