import type { HTMLAttributes, ReactNode, ReactElement } from "react"

import { UPLOAD_STYLES } from "./upload.styles"

interface UploadCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function UploadCard({ children, className = "", ...props }: UploadCardProps): ReactElement {
  const cardClassName = [UPLOAD_STYLES.cardBase, className].filter(Boolean).join(" ")

  return (
    <div
      className={cardClassName}
      {...props}
    >
      {children}
    </div>
  )
}
