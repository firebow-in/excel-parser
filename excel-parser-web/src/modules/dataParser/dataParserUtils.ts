import type { RecordRow, RowData } from "./dataParser.types";

export function getEditCellValue(
  row: RecordRow,
  editData: RowData,
  header: string
): string {
  if (row.isNew) {
    return String(editData[header] ?? "");
  }
  return String(editData[header] ?? row.rowData[header] ?? "");
}
