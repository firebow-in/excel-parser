import { Router } from "express"

import upload from "../middleware/multer.middleware"

import {
  deleteUploadController,
  getUploadsController,
  renameUploadController,
  uploadFileController,
} from "../upload/upload.controller"

export const uploadRouter = Router()

uploadRouter.post("/upload", upload.single("file"), uploadFileController)
uploadRouter.get("/upload", getUploadsController)
uploadRouter.patch("/upload/:id", renameUploadController)
uploadRouter.delete("/upload/:id", deleteUploadController)