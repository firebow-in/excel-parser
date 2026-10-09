import { Prisma } from "../../../../excel-db-model/generated/prisma/client";

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export type UploadType = Prisma.UploadGetPayload<{
  include: {
    worksheets: true;
  };
}>;

export type WorksheetType = Prisma.WorksheetGetPayload<{}>;

export type RecordType = Prisma.RecordGetPayload<{
  select: {
    id: true;
    worksheetId: true;
    rowData: true;
  };
}>;

export interface UpdateRecordRequest {
  rowData: Prisma.JsonValue;
}

export interface AddRecordRequest {
  rowData: Prisma.JsonValue;
  worksheetId: number; 
}

//