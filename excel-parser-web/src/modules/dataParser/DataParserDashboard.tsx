import { useEffect } from "react"

import { useParams } from "react-router-dom"

import {
  useUploadDataSlice,
} from "./DataParserContext"
import { dataParserStyles } from "./dataParser.styles"
import DataParserFilter from "./DataParserFilter"
import DataParserPagination from "./DataParserPagination"
import DataParserTable from "./DataParserTable"

function DashboardContent() {
  const { uploadId } = useParams()
  const uploadSlice = useUploadDataSlice()

  useEffect(() => {
    if (uploadId && uploadSlice) {
      void uploadSlice.selectUpload(Number(uploadId))
    }
  }, [uploadId, uploadSlice])

  if (!uploadSlice) return null

  const { upload, error } = uploadSlice

  if (!upload) {
    return <div>Loading...</div>
  }

  return (
    <>
      {error && <p className={dataParserStyles.errorBanner}>{error}</p>}
      <DataParserFilter />
      <DataParserTable />
      <DataParserPagination />
    </>
  )
}

export default function DataParserDashboard() {
  return <DashboardContent />
}
