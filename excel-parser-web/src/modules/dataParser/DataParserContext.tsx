import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactElement,
  type ReactNode,
} from "react"

import type { UploadHistoryItem } from "@/modules/upload/upload.types"
import {
  deleteUpload as deleteUploadApi,
  getUploads,
  renameUpload as renameUploadApi,
} from "@/modules/upload/uploadApi"

import { DATA_PARSER_ERRORS, DEBOUNCE_DELAY } from "./dataParser.constants"
import type {
  CellValue,
  DataParserContextType,
  RecordRow,
  RecordsSubModuleProps,
  RowData,
  UploadData,
  Worksheet,
  WorksheetSubModuleProps,
} from "./dataParser.types"
import { dataParserApi } from "./dataParserApi"

export const DataParserContext = createContext<DataParserContextType | null>(
  null,
)

function useUploadSubModule() {
  const [upload, setUpload] = useState<UploadData | null>(null)
  const [allUploads, setAllUploads] = useState<UploadHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUploadHistory = useCallback(async (): Promise<void> => {
    try {
      setError(null)
      setLoading(true)
      const result = await getUploads()
      if (result.success) {
        setAllUploads(result.data)
      }
    } catch {
      setError(DATA_PARSER_ERRORS.FETCH_UPLOAD_HISTORY)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleUploadComplete = useCallback(
    (newUpload: UploadData): void => {
      setUpload(newUpload)
      void fetchUploadHistory()
    },
    [fetchUploadHistory],
  )

  const deleteUpload = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null)
      setLoading(true)
      const result = await deleteUploadApi(id)
      if (result.success) {
        setAllUploads(prev => prev.filter(item => item.id !== id))
        setUpload(current => (current && current.id === id ? null : current))
      }
    } catch {
      setError(DATA_PARSER_ERRORS.DELETE_UPLOAD)
    } finally {
      setLoading(false)
    }
  }, [])

  const renameUpload = useCallback(
    async (id: number, newName: string): Promise<void> => {
      try {
        setError(null)
        setLoading(true)
        const result = await renameUploadApi(id, newName.trim())
        if (result.success) {
          setAllUploads(prev =>
            prev.map(item =>
              item.id === id
                ? { ...item, fileName: result.data.fileName }
                : item,
            ),
          )
          setUpload(current =>
            current && current.id === id
              ? { ...current, fileName: result.data.fileName }
              : current,
          )
        }
      } catch {
        setError(DATA_PARSER_ERRORS.RENAME_UPLOAD)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const selectUpload = useCallback(
    async (uploadId: number): Promise<void> => {
      if (upload?.id === uploadId) return

      const found = allUploads.find(item => item.id === uploadId)
      if (!found) return

      setError(null)

      setUpload({
        id: found.id,
        fileName: found.fileName,
        worksheets: [],
      })
    },
    [allUploads, upload?.id],
  )

  useEffect(() => {
    void fetchUploadHistory()
  }, [fetchUploadHistory])

  return {
    upload,
    setUpload,
    allUploads,
    loading,
    setLoading,
    error,
    setError,
    fetchUploadHistory,
    handleUploadComplete,
    deleteUpload,
    renameUpload,
    selectUpload,
  }
}

function useWorksheetSubModule({
  upload,
  setLoading,
  setError,
}: WorksheetSubModuleProps) {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([])
  const [selectedWorksheetId, setSelectedWorksheetId] = useState("")

  const handleWorksheetChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>): void => {
      setSelectedWorksheetId(e.target.value)
    },
    [],
  )

  useEffect(() => {
    if (!upload?.id) {
      setWorksheets([])
      setSelectedWorksheetId("")
      return
    }

    const loadWorksheets = async (): Promise<void> => {
      try {
        setError(null)
        setLoading(true)
        const result = await dataParserApi.getUploadById(upload.id)
        if (result.success && result.data) {
          setWorksheets(result.data.worksheets ?? [])
          if (result.data.worksheets && result.data.worksheets.length > 0) {
            setSelectedWorksheetId(String(result.data.worksheets[0].id))
          } else {
            setSelectedWorksheetId("")
          }
        }
      } catch {
        setError(DATA_PARSER_ERRORS.LOAD_WORKSHEETS)
      } finally {
        setLoading(false)
      }
    }

    void loadWorksheets()
  }, [upload, setLoading, setError])

  return {
    worksheets,
    setWorksheets,
    selectedWorksheetId,
    setSelectedWorksheetId,
    handleWorksheetChange,
  }
}

function useRecordsSubModule({
  selectedWorksheetId,
  setLoading,
  setError,
}: RecordsSubModuleProps) {
  const [records, setRecords] = useState<RecordRow[]>([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [editData, setEditData] = useState<RowData>({})
  const [editingRowId, setEditingRowId] = useState<number | null>(null)

  const handleSearchChange = useCallback((value: string): void => {
    setSearch(value)
    setPage(1)
  }, [])

  const handlePageChange = useCallback(
    (action: "prev" | "next"): void => {
      if (action === "prev") {
        setPage(prev => Math.max(prev - 1, 1))
      } else {
        setPage(prev => Math.min(prev + 1, totalPages))
      }
    },
    [totalPages],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, DEBOUNCE_DELAY)
    return () => clearTimeout(timer)
  }, [search])

  const fetchRecords = useCallback(async (): Promise<void> => {
    if (!selectedWorksheetId) return
    setLoading(true)
    try {
      const result = await dataParserApi.getRecords(
        selectedWorksheetId,
        page,
        debouncedSearch,
      )
      if (result.success) {
        setRecords(result.data ?? [])
        setTotalPages(result.totalPages ?? 1)
        setTotalRecords(result.totalRecords ?? 0)
      }
    } catch {
      setError(DATA_PARSER_ERRORS.FETCH_RECORDS)
    } finally {
      setLoading(false)
    }
  }, [selectedWorksheetId, page, debouncedSearch, setLoading, setError])

  useEffect(() => {
    void fetchRecords()
  }, [fetchRecords])

  const updateCell = useCallback(
    async (
      recordId: number,
      updatedRowData: RecordRow["rowData"],
    ): Promise<void> => {
      try {
        const result = await dataParserApi.updateRecord(
          recordId,
          updatedRowData,
        )
        if (result.success && result.data) {
          setRecords(prev =>
            prev.map(record =>
              record.id === recordId
                ? { ...record, rowData: updatedRowData }
                : record,
            ),
          )
        } else {
          setError(result.message ?? DATA_PARSER_ERRORS.UPDATE_CELL_FAILED)
        }
      } catch {
        setError(DATA_PARSER_ERRORS.UPDATE_CELL)
      }
    },
    [setError],
  )

  const deleteRow = useCallback(
    async (recordId: number): Promise<void> => {
      try {
        const result = await dataParserApi.deleteRecord(recordId)
        if (result.success) {
          setRecords(prev => prev.filter(record => record.id !== recordId))
          setTotalRecords(prev => prev - 1)
        } else {
          setError(result.message ?? DATA_PARSER_ERRORS.DELETE_ROW_FAILED)
        }
      } catch {
        setError(DATA_PARSER_ERRORS.DELETE_ROW)
      }
    },
    [setError],
  )

  const addRow = useCallback(async (): Promise<void> => {
    const newRow: RecordRow = {
      id: Date.now(),
      rowData: {},
      isNew: true,
    }
    setRecords(prev => [...prev, newRow])
    setEditData({})
  }, [])

  const refreshData = useCallback(() => {
    void fetchRecords()
  }, [fetchRecords])

  const saveEdit = useCallback(
    async (id: number) => {
      await updateCell(id, editData)
      setEditingRowId(null)
      setEditData({})
    },
    [editData, updateCell],
  )

  const handleSave = useCallback(
    async (tempId: number) => {
      try {
        const result = await dataParserApi.addRecord(
          Number(selectedWorksheetId),
          editData,
        )
        if (result.success) {
          setRecords(prev =>
            prev.map(row =>
              row.id === tempId
                ? ({ ...result.data, isNew: false } as RecordRow)
                : row,
            ),
          )
          setEditData({})
          setEditingRowId(null)
        }
      } catch {
        setError(DATA_PARSER_ERRORS.SAVE_ROW)
      }
    },
    [editData, selectedWorksheetId],
  )

  const handleAddRow = useCallback(() => {
    setEditData({})
    setEditingRowId(null)
    void addRow()
  }, [addRow])

  const handleDoubleClick = useCallback((row: RecordRow) => {
    setEditingRowId(row.id)
    setEditData(row.rowData)
  }, [])

  const cancelEdit = useCallback((): void => {
    setEditingRowId(null)
    setEditData({})
  }, [])

  const cancelAddRow = useCallback((rowId: number): void => {
    setRecords(prev => prev.filter(r => r.id !== rowId))
    setEditingRowId(null)
    setEditData({})
  }, [])

  const updateEditData = useCallback((header: string, value: CellValue): void => {
    setEditData(prev => ({ ...prev, [header]: value }))
  }, [])

  return {
    records,
    setRecords,
    search,
    setSearch,
    setDebouncedSearch,
    page,
    setPage,
    totalPages,
    totalRecords,
    editData,
    editingRowId,
    handleSearchChange,
    handlePageChange,
    fetchRecords,
    updateCell,
    deleteRow,
    addRow,
    refreshData,
    saveEdit,
    handleSave,
    handleAddRow,
    handleDoubleClick,
    cancelEdit,
    cancelAddRow,
    updateEditData,
  }
}

export const DataParserProvider = ({
  children,
}: {
  children: ReactNode
}): ReactElement => {
  const {
    upload,
    allUploads,
    loading,
    error,
    fetchUploadHistory,
    handleUploadComplete,
    deleteUpload,
    renameUpload,
    selectUpload,
    setLoading,
    setError,
  } = useUploadSubModule()

  const { worksheets, selectedWorksheetId, handleWorksheetChange } =
    useWorksheetSubModule({
      upload,
      setLoading,
      setError,
    })

  const {
    records,
    search,
    page,
    totalPages,
    totalRecords,
    editData,
    editingRowId,
    handleSearchChange,
    handlePageChange,
    fetchRecords,
    updateCell,
    deleteRow,
    addRow,
    refreshData,
    saveEdit,
    handleSave,
    handleAddRow,
    handleDoubleClick,
    cancelEdit,
    cancelAddRow,
    updateEditData,
    setPage,
    setSearch,
    setDebouncedSearch,
    setRecords,
  } = useRecordsSubModule({
    selectedWorksheetId,
    setLoading,
    setError,
  })

  useEffect(() => {
    setPage(1)
    setSearch("")
    setDebouncedSearch("")
    setRecords([])
  }, [upload?.id, setPage, setSearch, setDebouncedSearch, setRecords])

  const value = useMemo<DataParserContextType>(
    () => ({
      upload,
      handleUploadComplete,
      worksheets,
      selectedWorksheetId,
      records,
      search,
      page,
      totalPages,
      totalRecords,
      loading,
      error,
      editingRowId,
      editData,
      allUploads,
      handleWorksheetChange,
      handleSearchChange,
      selectUpload,
      handlePageChange,
      fetchUploadHistory,
      deleteUpload,
      renameUpload,
      updateCell,
      addRow,
      deleteRow,
      fetchRecords,
      refreshData,
      saveEdit,
      handleSave,
      handleAddRow,
      handleDoubleClick,
      cancelEdit,
      cancelAddRow,
      updateEditData,
    }),
    [
      upload,
      handleUploadComplete,
      worksheets,
      selectedWorksheetId,
      records,
      search,
      page,
      totalPages,
      totalRecords,
      loading,
      error,
      editingRowId,
      editData,
      allUploads,
      handleWorksheetChange,
      handleSearchChange,
      selectUpload,
      handlePageChange,
      fetchUploadHistory,
      deleteUpload,
      renameUpload,
      updateCell,
      addRow,
      deleteRow,
      fetchRecords,
      refreshData,
      saveEdit,
      handleSave,
      handleAddRow,
      handleDoubleClick,
      cancelEdit,
      cancelAddRow,
      updateEditData,
    ],
  )

  return (
    <DataParserContext.Provider value={value}>
      {children}
    </DataParserContext.Provider>
  )
}

export const useDataParser = (): DataParserContextType | null => {
  return useContext(DataParserContext)
}

export function useUploadDataSlice() {
  const ctx = useDataParser()
  if (!ctx) return null
  const {
    upload,
    allUploads,
    loading,
    error,
    fetchUploadHistory,
    handleUploadComplete,
    deleteUpload,
    renameUpload,
    selectUpload,
  } = ctx
  return {
    upload,
    allUploads,
    loading,
    error,
    fetchUploadHistory,
    handleUploadComplete,
    deleteUpload,
    renameUpload,
    selectUpload,
  }
}

export function useParserFilterSlice() {
  const ctx = useDataParser()
  if (!ctx) return null
  const {
    upload,
    worksheets,
    selectedWorksheetId,
    search,
    handleWorksheetChange,
    handleSearchChange,
  } = ctx
  return { upload, worksheets, selectedWorksheetId, search, handleWorksheetChange, handleSearchChange }
}

export function useParserRecordsSlice() {
  const ctx = useDataParser()
  if (!ctx) return null
  const {
    records,
    loading,
    page,
    totalPages,
    totalRecords,
    editingRowId,
    editData,
    deleteRow,
    refreshData,
    saveEdit,
    handleSave,
    handleAddRow,
    handleDoubleClick,
    cancelEdit,
    cancelAddRow,
    updateEditData,
    handlePageChange,
  } = ctx
  return {
    records,
    loading,
    page,
    totalPages,
    totalRecords,
    editingRowId,
    editData,
    deleteRow,
    refreshData,
    saveEdit,
    handleSave,
    handleAddRow,
    handleDoubleClick,
    cancelEdit,
    cancelAddRow,
    updateEditData,
    handlePageChange,
  }
}
