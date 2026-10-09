import type { Request, Response } from "express"
import {
  deleteUploadService,
  getUploadsService,
  renameUploadService,
  uploadFileService,
} from "./upload.service"

export const uploadFileController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const result = await uploadFileService(req.file)

    return res.status(200).json(result)
  } catch (error) {
    console.error("Error in uploadFileController:", error)

    const message =
      error instanceof Error ? error.message : "Something went wrong."

    return res.status(500).json({
      success: false,
      message,
    })
  }
}

export const getUploadsController = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const uploads = await getUploadsService()

    return res.status(200).json({
      success: true,
      data: uploads,
    })
  } catch (error) {
    console.error("Error in getUploadsController:", error)

    const message =
      error instanceof Error ? error.message : "Something went wrong."

    return res.status(500).json({
      success: false,
      message,
    })
  }
}

export const renameUploadController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid upload id.",
      })
    }

    const { fileName } = req.body

    if (!fileName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "File name is required.",
      })
    }

    const upload = await renameUploadService(id, fileName.trim())

    return res.status(200).json({
      success: true,
      data: upload,
    })
  } catch (error) {
    console.error("Error in renameUploadController:", error)

    const message =
      error instanceof Error ? error.message : "Something went wrong."

    return res.status(500).json({
      success: false,
      message,
    })
  }
}

export const deleteUploadController = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid upload id.",
      })
    }

    await deleteUploadService(id)

    return res.status(200).json({
      success: true,
      message: "Upload deleted successfully.",
    })
  } catch (error) {
    console.error("Error in deleteUploadController:", error)

    const message =
      error instanceof Error ? error.message : "Something went wrong."

    return res.status(500).json({
      success: false,
      message,
    })
  }
}