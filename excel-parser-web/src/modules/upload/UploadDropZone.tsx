import {
  useState,
  type DragEvent,
  type ChangeEvent,
  type ReactElement,
} from "react"

import { FileUp } from "lucide-react"

import { UPLOAD_STYLES } from "./upload.styles"
import { UPLOAD_TEXT } from "./upload.constants"

interface UploadDropZoneProps {
  id: string
  accept: string
  onFileSelect: (file: File) => void
}

export function UploadDropZone({
  id,
  accept,
  onFileSelect,
}: UploadDropZoneProps): ReactElement {
  const [isDragActive, setIsDragActive] = useState<boolean>(false)

  const handleDrag = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  const activeClass = isDragActive
    ? UPLOAD_STYLES.dropzoneActive
    : UPLOAD_STYLES.dropzoneInactive
  const dropzoneClassName = [UPLOAD_STYLES.dropzoneBase, activeClass].join(" ")

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={dropzoneClassName}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        value=""
        className={UPLOAD_STYLES.dropzoneInput}
      />

      <label htmlFor={id} className={UPLOAD_STYLES.dropzoneLabel}>
        <div className={UPLOAD_STYLES.dropzoneIconBox}>
          <FileUp className={UPLOAD_STYLES.dropzoneIcon} />
        </div>

        <h3 className={UPLOAD_STYLES.dropzoneTitle}>
          {UPLOAD_TEXT.DRAG_DROP_TITLE}
        </h3>

        <p className={UPLOAD_STYLES.dropzoneText}>
          {UPLOAD_TEXT.CHOOSE_FILE}
          <br />
          {UPLOAD_TEXT.CHOOSE_FILE_SUB}
        </p>

        <span className={UPLOAD_STYLES.dropzoneBadge}>
          {UPLOAD_TEXT.SUPPORTED_FILES}
        </span>
      </label>
    </div>
  )
}
