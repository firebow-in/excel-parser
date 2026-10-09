import type { ReactElement } from "react"

import { History, Upload } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function AppSidebar(): ReactElement {
  return (
    <aside className="w-52 min-h-screen border-r border-gray-200 bg-white flex flex-col">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded bg-green-700 flex items-center justify-center text-white font-bold text-sm">
          BW
        </div>
        <span className="font-semibold text-gray-800">Binaried Workspace</span>
      </div>

      <nav className="flex flex-col gap-1 p-3 mt-2">
        <NavLink
          to="/uploads"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-700 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Upload size={16} />
          New Upload
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-100 text-green-800 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <History size={16} />
          Upload History
        </NavLink>
      </nav>
    </aside>
  )
}
