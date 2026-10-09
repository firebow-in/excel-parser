import { DataParserRepository } from "./dataParser.repository.js";
import { Prisma } from "../../../../excel-db-model/generated/prisma/client.js";
import type {
  UploadType,
  WorksheetType,
  RecordType,
  PaginatedResponse,
} from "./dataParser.types.js";

export class DataParserService {
  static async getUploadById(id: number): Promise<UploadType | null> {
    return DataParserRepository.findUploadById(id);
  }

  static async getWorksheetById(id: number): Promise<WorksheetType | null> {
    return DataParserRepository.findWorksheetById(id);
  }

  static async getRecords(
    worksheetId: number,
    page: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResponse<RecordType>> {
    const skip = (page - 1) * limit;

    const { records, totalRecords } =
      await DataParserRepository.findRecordsAndCount(
        worksheetId,
        skip,
        limit,
        search,
      );

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: records,
      currentPage: page,
      limit,
      totalRecords,
      totalPages,
    };
  }

  static async updateRecord(id: number, rowData: Prisma.InputJsonValue): Promise<RecordType> {
    return DataParserRepository.updateRecord(id, rowData);
  }

  static async addRecord(worksheetId: number, rowData: Prisma.InputJsonValue): Promise<RecordType> {
    return DataParserRepository.createRecord(worksheetId, rowData);
  }

  static async deleteRecord(id: number): Promise<void> {
    await DataParserRepository.deleteRecord(id);
  }
}

//