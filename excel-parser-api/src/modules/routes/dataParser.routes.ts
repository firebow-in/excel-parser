import { Router } from 'express';
import { DataParserController } from '../dataParser/dataParser.controller';
export const dataParserRouter = Router();

dataParserRouter .get('/uploads/:id', DataParserController.getUpload);
dataParserRouter .get('/worksheets/:worksheetId', DataParserController.getWorksheet);
dataParserRouter .get('/records', DataParserController.getRecords);

dataParserRouter.patch("/records/:id", DataParserController.updateRecord);
dataParserRouter.post("/worksheets/:worksheetId/records", DataParserController.addRecord);
dataParserRouter.delete("/records/:id", DataParserController.deleteRecord);

//
