import type { ReactElement } from "react"

import { AlertTriangle, CheckCircle } from "lucide-react"

type ConfirmModalVariant = "danger" | "confirm"

interface ConfirmModalProps {
  title: string
  body: string
  detail?: string
  variant?: ConfirmModalVariant
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

const VARIANT_STYLES: Record<
  ConfirmModalVariant,
  { icon: ReactElement; confirmBtn: string }
> = {
  danger: {
    icon: (
      <div className="w-9 h-9 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle size={18} className="text-red-600" />
      </div>
    ),
    confirmBtn: "px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors",
  },
  confirm: {
    icon: (
      <div className="w-9 h-9 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle size={18} className="text-green-700" />
      </div>
    ),
    confirmBtn: "px-4 py-2 text-sm rounded-md bg-green-700 text-white hover:bg-green-800 transition-colors",
  },
}

export function ConfirmModal({
  title,
  body,
  detail,
  variant = "danger",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps): ReactElement {
  const styles = VARIANT_STYLES[variant]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          {styles.icon}
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>

        <p className="text-sm text-gray-500 mb-1">{body}</p>

        {detail && (
          <p className="text-sm font-medium text-gray-800 mb-5 truncate">{detail}</p>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
