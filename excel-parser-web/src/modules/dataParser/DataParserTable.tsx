import { useState } from "react"

import { ConfirmModal } from "@/modules/ui-components/ConfirmModal/ConfirmModal"

import { MESSAGES, PAGE, TABLE } from "./dataParser.constants"
import { dataParserStyles } from "./dataParser.styles"
import { useParserRecordsSlice } from "./DataParserContext"
import { getEditCellValue } from "./dataParserUtils"

export default function DataParserTable() {
  const recordsSlice = useParserRecordsSlice()
  const [confirmDeleteRowId, setConfirmDeleteRowId] = useState<number | null>(null)
  const [confirmSaveRow, setConfirmSaveRow] = useState<{ id: number; isNew: boolean } | null>(null)

  if (!recordsSlice) return null

  const {
    records,
    loading,
    deleteRow,
    editingRowId,
    editData,
    refreshData,
    saveEdit,
    handleSave,
    handleAddRow,
    handleDoubleClick,
    cancelEdit,
    cancelAddRow,
    updateEditData,
  } = recordsSlice

  const visibleRecords = records.filter(
    row =>
      row.isNew ||
      Object.values(row.rowData).some(
        value => value !== null && value !== undefined && String(value).trim() !== "",
      ),
  )

  const firstRecordWithData = records.find(
    r => r.rowData && Object.keys(r.rowData).length > 0,
  )
  const headers = firstRecordWithData ? Object.keys(firstRecordWithData.rowData) : []

  return (
    <div className={dataParserStyles.tableMainWrapper}>
      <div className={dataParserStyles.headerButton}>
        <button type="button" className={dataParserStyles.saveBtnClass} onClick={handleAddRow}>
          {PAGE.ADDROW}
        </button>
        <button type="button" className={dataParserStyles.cancelBtnClass} onClick={refreshData}>
          {PAGE.REFRESH}
        </button>
      </div>

      {loading && (
        <div className={dataParserStyles.tableLoadingText}>{MESSAGES.LOADING_SETUP}</div>
      )}

      <table className={dataParserStyles.tableElement}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header} className={dataParserStyles.tableHeaderCell}>
                {header}
              </th>
            ))}
            {visibleRecords.length > 0 && (
              <th className={dataParserStyles.tableHeaderCell}>{TABLE.ACTIONS_HEADER}</th>
            )}
          </tr>
        </thead>

        <tbody className={dataParserStyles.tableBodySection}>
          {visibleRecords.length > 0 ? (
            visibleRecords.map(row => (
              <tr
                key={row.id}
                className={dataParserStyles.tableDataRow}
                onDoubleClick={() => handleDoubleClick(row)}
              >
                {headers.map(header => (
                  <td key={header} className={dataParserStyles.editHeader}>
                    {row.isNew || editingRowId === row.id ? (
                      <input
                        className={dataParserStyles.editInput}
                        value={getEditCellValue(row, editData, header)}
                        onChange={e => updateEditData(header, e.target.value)}
                      />
                    ) : (
                      <span className={dataParserStyles.tableSpan}>
                        {String(row.rowData[header] ?? "-")}
                      </span>
                    )}
                  </td>
                ))}

                <td className={dataParserStyles.tableEditData}>
                  {row.isNew || editingRowId === row.id ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={dataParserStyles.saveBtnClass}
                        onClick={() =>
                          setConfirmSaveRow({ id: row.id, isNew: row.isNew ?? false })
                        }
                      >
                        {PAGE.SAVE}
                      </button>
                      <button
                        type="button"
                        className={dataParserStyles.cancelBtnClass}
                        onClick={() => {
                          if (row.isNew) {
                            cancelAddRow(row.id)
                          } else {
                            cancelEdit()
                          }
                        }}
                      >
                        {PAGE.CANCEL}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={dataParserStyles.deleteBtnClass}
                      onClick={() => setConfirmDeleteRowId(row.id)}
                    >
                      {PAGE.DELETE}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className={dataParserStyles.data}>
                {MESSAGES.DATA_NO_FOUND}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {confirmDeleteRowId !== null && (
        <ConfirmModal
          title={TABLE.DELETE_CONFIRM_TITLE}
          body={TABLE.DELETE_CONFIRM_BODY}
          confirmLabel={TABLE.DELETE_CONFIRM_LABEL}
          onConfirm={() => {
            void deleteRow(confirmDeleteRowId)
            setConfirmDeleteRowId(null)
          }}
          onCancel={() => setConfirmDeleteRowId(null)}
        />
      )}

      {confirmSaveRow !== null && (
        <ConfirmModal
          variant="confirm"
          title={TABLE.SAVE_CONFIRM_TITLE}
          body={TABLE.SAVE_CONFIRM_BODY}
          confirmLabel={TABLE.SAVE_CONFIRM_LABEL}
          onConfirm={() => {
            const { id, isNew } = confirmSaveRow
            void (isNew ? handleSave(id) : saveEdit(id))
            setConfirmSaveRow(null)
          }}
          onCancel={() => setConfirmSaveRow(null)}
        />
      )}
    </div>
  )
}
