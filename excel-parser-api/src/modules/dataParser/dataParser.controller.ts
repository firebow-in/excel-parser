import type { Request, Response } from "express";
import { DataParserService } from "./dataParser.service";
import { Prisma } from "../../../../excel-db-model/generated/prisma/client";
import type { UpdateRecordRequest, AddRecordRequest } from "./dataParser.types";

export class DataParserController {

  static async getUpload(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid upload ID" 
        });
      }

      const data = await DataParserService.getUploadById(id);

      
      if (!data) {
        return res.status(404).json({ success: false, message: "Upload not found" });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error in getUpload:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getWorksheet(req: Request, res: Response): Promise<Response> {
    try {
      
      const worksheetId = Number(req.params.worksheetId || req.params.id);

      if (Number.isNaN(worksheetId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid worksheet ID" 
        });
      }

      const data = await DataParserService.getWorksheetById(worksheetId);

      if (!data) {
        return res.status(404).json({ success: false, message: "Worksheet not found" });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error in getWorksheet:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  
  static async getRecords(req: Request, res: Response): Promise<Response> {
    try {
      const worksheetId = Number(req.query.worksheetId);
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const search = req.query.search ? String(req.query.search) : undefined;

      if (Number.isNaN(worksheetId)) {
        return res.status(400).json({ success: false, message: "Invalid worksheetId" });
      }

      const result = await DataParserService.getRecords(worksheetId, page, limit, search);

      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error("Error in getRecords:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  static async updateRecord(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid record ID" });
      }

      const { rowData } = req.body as UpdateRecordRequest;
      const data = await DataParserService.updateRecord(id, rowData as Prisma.InputJsonValue);
      
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Update failed" });
    }
  }

  static async addRecord(req: Request, res: Response): Promise<Response> {
    try {
      const worksheetId = Number(req.params.worksheetId);
      if (Number.isNaN(worksheetId)) {
        return res.status(400).json({ success: false, message: "Invalid worksheet ID" });
      }

      const { rowData } = req.body as AddRecordRequest;
      const data = await DataParserService.addRecord(worksheetId, rowData as Prisma.InputJsonValue);
      
      return res.status(201).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Add failed" });
    }
  }

  static async deleteRecord(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid record ID" });
      }

      await DataParserService.deleteRecord(id);
      return res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
  }
}
