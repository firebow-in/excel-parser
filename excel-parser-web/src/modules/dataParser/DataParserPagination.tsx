import { useParserRecordsSlice } from "./DataParserContext"
import { PAGE } from "./dataParser.constants"
import { dataParserStyles } from "./dataParser.styles"

export default function DataParserPagination() {
  const recordsSlice = useParserRecordsSlice()

  if (!recordsSlice) return null

  const { page, totalPages, totalRecords, handlePageChange, records } = recordsSlice

  if (records.length === 0) return null

  return (
    <div className={dataParserStyles.pageMainContainer}>
      <div className={dataParserStyles.pageCountSummary}>
        {PAGE.HEAD}{" "}
        <strong className={dataParserStyles.pageCountHighlight}>{totalRecords}</strong>{" "}
        {PAGE.STRONG}
      </div>
      <span className={dataParserStyles.pageNumberText}>
        {PAGE.SPAN} <strong className={dataParserStyles.pageNumberBold}>{page}</strong>{" "}
        {PAGE.STRONG_OF}{" "}
        <strong className={dataParserStyles.pageNumberBold}>{totalPages}</strong>
      </span>

      <div className={dataParserStyles.pageButtonWrapper}>
        <button
          type="button"
          className={dataParserStyles.pageActionBtn}
          onClick={() => handlePageChange("prev")}
          disabled={page === 1}
        >
          {PAGE.BTN_PREV}
        </button>
        <button
          type="button"
          className={dataParserStyles.pageActionBtn}
          onClick={() => handlePageChange("next")}
          disabled={page === totalPages}
        >
          {PAGE.BTN_NEXT}
        </button>
      </div>
    </div>
  )
}
