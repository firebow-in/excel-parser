import prisma from "../../config/prisma";
import { Prisma } from "../../../../excel-db-model/generated/prisma/client";
import type { UploadType, WorksheetType, RecordType } from "./dataParser.types";

export class DataParserRepository {
  static async findUploadById(id: number): Promise<UploadType | null> {
    return prisma.upload.findUnique({
      where: { id },
      include: { worksheets: true },
    });
  }

  static async findWorksheetById(id: number): Promise<WorksheetType | null> {
    return prisma.worksheet.findUnique({
      where: { id },
    });
  }

  static async findRecordsAndCount(
    worksheetId: number,
    skip: number,
    limit: number,
    search?: string,
  ): Promise<{
    records: RecordType[];
    totalRecords: number;
  }> {
    const allRecords = await prisma.record.findMany({
      where: { worksheetId },
      orderBy: { id: "asc" },
    });

    let filteredRecords: RecordType[] = allRecords;

    if (search) {
      const cleanSearch = search.toLowerCase().trim();

      filteredRecords = allRecords.filter((record: RecordType): boolean => {
        if (!record.rowData) {
          return false;
        }

        const rowString = JSON.stringify(record.rowData).toLowerCase();

        return rowString.includes(cleanSearch);
      });
    }

    const records = filteredRecords.slice(skip, skip + limit);

    return {
      records,
      totalRecords: filteredRecords.length,
    };
  }

  static async updateRecord(
    id: number,
    rowData: Prisma.InputJsonValue,
  ): Promise<RecordType> {
    return prisma.record.update({
      where: { id },
      data: { rowData },
      select: { id: true, worksheetId: true, rowData: true },
    });
  }

  static async createRecord(
    worksheetId: number,
    rowData: Prisma.InputJsonValue,
  ): Promise<RecordType> {
    return prisma.record.create({
      data: { worksheetId, rowData },
      select: { id: true, worksheetId: true, rowData: true },
    });
  }

  static async deleteRecord(id: number): Promise<void> {
    await prisma.record.delete({ where: { id } });
  }
}

//