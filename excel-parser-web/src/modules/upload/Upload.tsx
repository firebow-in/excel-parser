import { useState, type ReactElement } from "react"

import { FileSpreadsheet, Info, Play } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useUploadDataSlice } from "@/modules/dataParser/DataParserContext"

import {
  ALLOWED_FILE_ACCEPT,
  ALLOWED_FILE_TYPES,
  UPLOAD_MESSAGES,
  UPLOAD_TEXT,
} from "./upload.constants"
import { UPLOAD_STYLES } from "./upload.styles"
import { uploadFile } from "./uploadApi"
import { UploadCard } from "./UploadCard"
import { UploadDropZone } from "./UploadDropZone"
import { UploadPageHeader } from "./UploadPageHeader"

export function Upload(): ReactElement {
  const navigate = useNavigate()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const uploadSlice = useUploadDataSlice()

  if (!uploadSlice) {
    return <div>Context not found</div>
  }

  const { handleUploadComplete } = uploadSlice

  const handleFileSelect = (file: File): void => {
    const lastDotIndex = file.name.lastIndexOf(".")
    const fileExtension =
      lastDotIndex !== -1 ? file.name.substring(lastDotIndex).toLowerCase() : ""

    if (!(ALLOWED_FILE_TYPES as readonly string[]).includes(fileExtension)) {
      setErrorMessage(UPLOAD_MESSAGES.INVALID_FILE_TYPE)
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setErrorMessage("")
    setSuccessMessage("")
  }

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      setErrorMessage(UPLOAD_MESSAGES.NO_FILE_SELECTED)
      return
    }

    setIsUploading(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const response = await uploadFile(selectedFile)

      handleUploadComplete({
        worksheets: [],
        id: response.uploadId,
        fileName: selectedFile.name,
      })

      setSuccessMessage(UPLOAD_MESSAGES.UPLOAD_SUCCESS)
      setSelectedFile(null)

      navigate(`/dashboard/${response.uploadId}`)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(UPLOAD_MESSAGES.UPLOAD_FAILED)
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={UPLOAD_STYLES.pageContainer}>
      <UploadPageHeader
        titleFirst={UPLOAD_TEXT.TITLE_FIRST}
        titleLast={UPLOAD_TEXT.TITLE_LAST}
        description={UPLOAD_TEXT.DESCRIPTION}
      />

      <div className={UPLOAD_STYLES.cardContainer}>
        <UploadCard>
          <UploadDropZone
            id="excel-file"
            accept={ALLOWED_FILE_ACCEPT}
            onFileSelect={handleFileSelect}
          />

          {selectedFile && (
            <div className={UPLOAD_STYLES.selectedFileName}>
              <FileSpreadsheet className={UPLOAD_STYLES.selectedFileIcon} />
              <span>Selected file:</span>
              <span className={UPLOAD_STYLES.selectedFileNameSpan}>
                {selectedFile.name}
              </span>
            </div>
          )}

          {successMessage && (
            <p className={UPLOAD_STYLES.successMessage}>{successMessage}</p>
          )}

          {errorMessage && (
            <p className={UPLOAD_STYLES.errorMessage}>{errorMessage}</p>
          )}

          <div className={UPLOAD_STYLES.cardFooter}>
            <button
              type="button"
              className={UPLOAD_STYLES.uploadButton}
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
            >
              <span>
                {isUploading ? UPLOAD_TEXT.UPLOADING_BUTTON : UPLOAD_TEXT.UPLOAD_BUTTON}
              </span>
              <Play className={UPLOAD_STYLES.playIcon} />
            </button>
          </div>
        </UploadCard>

        <div className={UPLOAD_STYLES.infoContainer}>
          <Info className={UPLOAD_STYLES.infoIcon} />
          <p>{UPLOAD_TEXT.INFO_NOTE}</p>
        </div>
      </div>
    </div>
  )
}
