import { useState, type ReactElement } from "react"

import { Check, FileSpreadsheet, Pencil, Trash2, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useUploadDataSlice } from "@/modules/dataParser/DataParserContext"
import { ConfirmModal } from "@/modules/ui-components/ConfirmModal/ConfirmModal"
import { UploadPageHeader } from "@/modules/upload/UploadPageHeader"

import {
  UPLOAD_HISTORY_CONFIRM,
  UPLOAD_HISTORY_MESSAGES,
  UPLOAD_HISTORY_PAGINATION,
  UPLOAD_HISTORY_TEXT,
} from "./uploadHistory.constants"
import { UPLOAD_HISTORY_STYLES } from "./uploadHistory.styles"

export function UploadHistoryPage(): ReactElement {
  const navigate = useNavigate()
  const uploadSlice = useUploadDataSlice()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedFileName, setEditedFileName] = useState("")
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [confirmRenameId, setConfirmRenameId] = useState<number | null>(null)

  if (!uploadSlice) {
    return <div>Context not found</div>
  }

  const { allUploads, loading, upload, renameUpload, deleteUpload } = uploadSlice

  const filtered = allUploads.filter(item =>
    item.fileName.toLowerCase().includes(search.toLowerCase()),
  )

  const visibleItems = filtered.slice(0, visibleCount)

  const confirmDeleteItem = allUploads.find(item => item.id === confirmDeleteId)
  const confirmRenameItem = allUploads.find(item => item.id === confirmRenameId)

  const handleConfirmDelete = async (): Promise<void> => {
    if (confirmDeleteId !== null) {
      await deleteUpload(confirmDeleteId)
      setConfirmDeleteId(null)
    }
  }

  const handleConfirmRename = async (): Promise<void> => {
    if (confirmRenameId !== null) {
      await renameUpload(confirmRenameId, editedFileName)
      setEditingId(null)
      setConfirmRenameId(null)
    }
  }

  const isInitialLoading = allUploads.length === 0 && loading
  const isFilterEmpty = filtered.length === 0

  const uploadListContent = (() => {
    if (isInitialLoading) {
      return <p className={UPLOAD_HISTORY_STYLES.emptyState}>{UPLOAD_HISTORY_TEXT.LOADING}</p>
    }
    if (isFilterEmpty) {
      return <p className={UPLOAD_HISTORY_STYLES.emptyState}>{UPLOAD_HISTORY_TEXT.EMPTY}</p>
    }
    return (
      <>
        <ul className={UPLOAD_HISTORY_STYLES.list}>
          {visibleItems.map(item => (
            <li
              key={item.id}
              className={`${UPLOAD_HISTORY_STYLES.itemBase} ${
                upload?.id === item.id
                  ? UPLOAD_HISTORY_STYLES.itemActive
                  : UPLOAD_HISTORY_STYLES.itemInactive
              }`}
              onClick={() => navigate(`/dashboard/${item.id}`)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={UPLOAD_HISTORY_STYLES.itemIconBox}>
                  <FileSpreadsheet size={16} className={UPLOAD_HISTORY_STYLES.itemIcon} />
                </div>

                {editingId === item.id ? (
                  <input
                    value={editedFileName}
                    onChange={e => setEditedFileName(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className={UPLOAD_HISTORY_STYLES.editInput}
                  />
                ) : (
                  <span className={UPLOAD_HISTORY_STYLES.fileName}>{item.fileName}</span>
                )}
              </div>

              <div
                className={UPLOAD_HISTORY_STYLES.itemActions}
                onClick={e => e.stopPropagation()}
              >
                {editingId === item.id ? (
                  <>
                    <button
                      type="button"
                      aria-label="Save rename"
                      className={UPLOAD_HISTORY_STYLES.actionSave}
                      onClick={() => setConfirmRenameId(item.id)}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Cancel rename"
                      className={UPLOAD_HISTORY_STYLES.actionCancel}
                      onClick={() => setEditingId(null)}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="Rename upload"
                      className={UPLOAD_HISTORY_STYLES.actionEdit}
                      onClick={() => {
                        setEditingId(item.id)
                        setEditedFileName(item.fileName)
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete upload"
                      className={UPLOAD_HISTORY_STYLES.actionDelete}
                      onClick={() => setConfirmDeleteId(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className={UPLOAD_HISTORY_STYLES.paginationContainer}>
          <p className={UPLOAD_HISTORY_STYLES.showingText}>
            {UPLOAD_HISTORY_PAGINATION.SHOWING_PREFIX} {visibleItems.length}{" "}
            {UPLOAD_HISTORY_PAGINATION.SHOWING_OF} {filtered.length}{" "}
            {UPLOAD_HISTORY_PAGINATION.SHOWING_SUFFIX}
          </p>

          {visibleCount < filtered.length && (
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 10)}
              className={UPLOAD_HISTORY_STYLES.loadMoreButton}
            >
              {UPLOAD_HISTORY_PAGINATION.LOAD_MORE}
            </button>
          )}
        </div>
      </>
    )
  })()

  return (
    <div className={UPLOAD_HISTORY_STYLES.pageContainer}>
      <UploadPageHeader
        titleFirst={UPLOAD_HISTORY_TEXT.TITLE_FIRST}
        titleLast={UPLOAD_HISTORY_TEXT.TITLE_LAST}
        description={UPLOAD_HISTORY_TEXT.PAGE_DESCRIPTION}
      />

      <div className={UPLOAD_HISTORY_STYLES.contentContainer}>
        <input
          type="text"
          placeholder={UPLOAD_HISTORY_TEXT.SEARCH_PLACEHOLDER}
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setVisibleCount(10)
          }}
          className={UPLOAD_HISTORY_STYLES.searchInput}
        />

        {uploadListContent}

        {confirmDeleteId !== null && (
          <ConfirmModal
            title={UPLOAD_HISTORY_MESSAGES.DELETE_CONFIRM_TITLE}
            body={UPLOAD_HISTORY_MESSAGES.DELETE_CONFIRM_BODY}
            detail={confirmDeleteItem?.fileName}
            confirmLabel={UPLOAD_HISTORY_CONFIRM.DELETE_LABEL}
            onConfirm={() => void handleConfirmDelete()}
            onCancel={() => setConfirmDeleteId(null)}
          />
        )}

        {confirmRenameId !== null && (
          <ConfirmModal
            variant="confirm"
            title={UPLOAD_HISTORY_MESSAGES.RENAME_CONFIRM_TITLE}
            body={UPLOAD_HISTORY_MESSAGES.RENAME_CONFIRM_BODY}
            detail={`${confirmRenameItem?.fileName} → ${editedFileName}`}
            confirmLabel={UPLOAD_HISTORY_CONFIRM.SAVE_LABEL}
            onConfirm={() => void handleConfirmRename()}
            onCancel={() => setConfirmRenameId(null)}
          />
        )}
      </div>
    </div>
  )
}
