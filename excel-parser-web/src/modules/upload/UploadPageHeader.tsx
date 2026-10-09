import type { ReactElement } from "react"

import { UPLOAD_STYLES } from "./upload.styles"

interface UploadPageHeaderProps {
  titleFirst?: string
  titleLast?: string
  description?: string
}

export function UploadPageHeader({ titleFirst, titleLast, description }: UploadPageHeaderProps): ReactElement {
  return (
    <div className={UPLOAD_STYLES.headerContainer}>
      <h1 className={UPLOAD_STYLES.headerTitle}>
        {(titleFirst || titleLast) && (
          <span className={UPLOAD_STYLES.headerSpanContainer}>
            <span className={UPLOAD_STYLES.headerSpanGreen}>{titleFirst}</span>
            <span>{titleLast}</span>
          </span>
        )}
      </h1>
      {description && <p className={UPLOAD_STYLES.headerDescription}>{description}</p>}
    </div>
  )
}
