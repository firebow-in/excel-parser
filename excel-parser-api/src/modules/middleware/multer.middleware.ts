import type { Request } from "express"
import multer from "multer"
import path from "path"

import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES, INVALID_FILE_TYPE_MESSAGE } from "./multer.constants"

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },

  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ): void => {
    const extension = path.extname(file.originalname).toLowerCase()

    if ((ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
      cb(null, true)
    } else {
      cb(new Error(INVALID_FILE_TYPE_MESSAGE))
    }
  },
})

export default upload
