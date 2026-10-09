import type { Express } from "express"
import * as XLSX from "xlsx"

import prisma from "../../config/prisma"
import { Prisma } from "../../../../excel-db-model/generated/prisma/client"
import type { UploadResult } from "./upload.types"


export const uploadFileService = async (
  file: Express.Multer.File | undefined,
): Promise<UploadResult> => {
  if (!file) {
    throw new Error("No file uploaded.")
  }

  const workbook = XLSX.read(file.buffer, { type: "buffer" })
  const sheetNames = workbook.SheetNames

  return await prisma.$transaction(async tx => {
    const upload = await tx.upload.create({
      data: {
        fileName: file.originalname,
      },
    })

    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName]

      if (!worksheet) {
        continue
      }

      const rows = XLSX.utils.sheet_to_json<Prisma.InputJsonObject>(worksheet)

      const worksheetRecord = await tx.worksheet.create({
        data: {
          name: sheetName,
          uploadId: upload.id,
        },
      })

      const recordsData = rows.map(row => ({
        worksheetId: worksheetRecord.id,
        rowData: row,
      }))

      if (recordsData.length > 0) {
        await tx.record.createMany({
          data: recordsData,
        })
      }
    }

    return {
      success: true,
      uploadId: upload.id,
    }
  })
}

export const getUploadsService = async () => {
    return prisma.upload.findMany({
    orderBy: {
      id: "desc",
    },
  })
}

export const renameUploadService = async (
  id: number,
  fileName: string,
) => {
  return prisma.upload.update({
    where: {
      id,
    },
    data: {
      fileName,
    },
  })
}

export const deleteUploadService = async (
  id: number,
) => {
  return prisma.upload.delete({
    where: {
      id,
    },
  })
}