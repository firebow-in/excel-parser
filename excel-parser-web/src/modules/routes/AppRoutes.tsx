import { Navigate, Route, Routes } from "react-router-dom"

import DataParserDashboard from "@/modules/dataParser/DataParserDashboard"
import MainLayout from "@/modules/layout/MainLayout"
import { Upload } from "@/modules/upload/Upload"
import { UploadHistoryPage } from "@/modules/uploadHistory/UploadHistoryPage"

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/uploads" replace />} />
        <Route path="/uploads" element={<Upload />} />
        <Route path="/history" element={<UploadHistoryPage />} />
        <Route path="/dashboard/:uploadId" element={<DataParserDashboard />} />
      </Route>
    </Routes>
  )
}
