export const UPLOAD_HISTORY_STYLES = {
  pageContainer: "max-w-5xl mx-auto px-4 py-4",
  contentContainer: "max-w-2xl mx-auto mt-6",
  searchInput:
    "w-full border border-gray-200 rounded-md px-4 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-600",
  emptyState: "text-sm text-gray-500",
  list: "space-y-3",
  itemBase:
    "flex items-center justify-between border rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors",
  itemActive: "border-green-600 bg-green-50",
  itemInactive: "border-gray-200 bg-white",
  itemIconBox:
    "w-8 h-8 flex-shrink-0 rounded bg-green-100 flex items-center justify-center",
  itemIcon: "text-green-700",
  editInput: "border rounded px-2 py-1 text-sm min-w-0 flex-1",
  fileName: "text-sm truncate",
  itemActions: "flex items-center gap-2 ml-4 flex-shrink-0",
  actionSave:
    "rounded p-1 hover:bg-green-100 hover:text-green-700 transition-colors",
  actionCancel:
    "rounded p-1 hover:bg-red-100 hover:text-red-600 transition-colors",
  actionEdit:
    "rounded p-1 hover:bg-gray-200 transition-colors text-gray-500",
  actionDelete:
    "rounded p-1 hover:bg-red-100 hover:text-red-600 transition-colors text-gray-500",
  paginationContainer:
    "mt-8 pt-6 border-t border-gray-200 flex flex-col items-center gap-3",
  showingText: "text-xs text-gray-500 text-center",
  loadMoreButton:
    "border border-green-700 text-green-700 hover:bg-emerald-50 px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
} as const
