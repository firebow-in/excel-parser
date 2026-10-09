import { DataParserProvider } from "@/modules/dataParser/DataParserContext"
import AppRoutes from "@/modules/routes/AppRoutes"

export default function App() {
  return (
    <DataParserProvider>
      <AppRoutes />
    </DataParserProvider>
  )
}

