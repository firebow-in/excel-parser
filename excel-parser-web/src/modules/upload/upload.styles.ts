export const UPLOAD_STYLES = {
  pageContainer: "max-w-5xl mx-auto px-4 py-4",
  cardContainer: "w-full max-w-2xl mx-auto mt-6",
  cardBase: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
  selectedFileName: "mt-4 text-sm text-gray-600 flex items-center gap-2",
  selectedFileNameSpan: "font-medium text-emerald-800",
  selectedFileIcon: "w-4 h-4 text-emerald-700 flex-shrink-0",
  uploadButton:
    "bg-green-700 hover:bg-green-800 text-white font-medium text-sm px-5 py-2.5 rounded-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
  playIcon: "w-2.5 h-2.5 fill-white text-white translate-y-[0.5px]",
  cardFooter: "mt-6 pt-4 border-t border-gray-200/80 flex justify-end",
  infoContainer:
    "mt-6 rounded-lg bg-gray-100/90 border border-gray-200/50 p-4 flex items-start gap-3 text-gray-600 text-xs sm:text-sm leading-relaxed",
  infoIcon: "w-5 h-5 text-green-700 flex-shrink-0 mt-0.5",
  successMessage: "mt-4 text-sm text-green-600 font-medium",
  errorMessage: "mt-4 text-sm text-red-600 font-medium",
  headerContainer: "mb-6",
  headerTitle: "text-3xl font-bold text-gray-900 tracking-tight",
  headerSpanContainer: "inline-flex gap-1.5",
  headerSpanGreen: "text-green-700",
  headerDescription: "mt-1.5 text-sm text-gray-500",
  dropzoneBase:
    "rounded-lg border-2 border-green-700 bg-green-50/30 py-10 px-6 text-center cursor-pointer transition-all relative flex flex-col items-center justify-center",
  dropzoneActive: "border-green-700 bg-emerald-100/30",
  dropzoneInactive: "hover:bg-emerald-50/20",
  dropzoneLabel: "cursor-pointer flex flex-col items-center justify-center w-full",
  dropzoneIconBox:
    "w-12 h-12 rounded-xl bg-emerald-100/80 text-green-700 flex items-center justify-center mb-3",
  dropzoneIcon: "w-6 h-6 stroke-[2.2]",
  dropzoneTitle: "text-lg font-bold text-gray-900 mb-1",
  dropzoneInput: "hidden",
  dropzoneText: "text-sm text-gray-500 mb-4",
  dropzoneBadge:
    "inline-block bg-emerald-50 text-green-700 text-xs font-semibold px-3.5 py-1 rounded-full border border-emerald-100",
} as const
