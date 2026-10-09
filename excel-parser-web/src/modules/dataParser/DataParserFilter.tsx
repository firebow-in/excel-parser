import { useParserFilterSlice } from "./DataParserContext"
import { FILTER, MESSAGES } from "./dataParser.constants"
import { dataParserStyles } from "./dataParser.styles"

export default function DataParserFilter() {
  const filterSlice = useParserFilterSlice()

  if (!filterSlice) return null

  const {
    upload,
    worksheets,
    selectedWorksheetId,
    search,
    handleWorksheetChange,
    handleSearchChange,
  } = filterSlice

  return (
    <div className={dataParserStyles.filterMainCard}>
      <h2 className={dataParserStyles.filterMainTitle}>{FILTER.HEADING}</h2>

      <div className={dataParserStyles.filterRowWrapper}>
        <div className={dataParserStyles.filterInputBlock}>
          <label className={dataParserStyles.filterLabelHeader}>{FILTER.CONTEXT}</label>
          <div className={dataParserStyles.filterFileDisplay}>
            {upload ? upload.fileName : MESSAGES.LOADING}
          </div>
        </div>

        <div className={dataParserStyles.filterInputBlock}>
          <label className={dataParserStyles.filterLabelHeader}>{FILTER.SELECT}</label>
          <select
            className={dataParserStyles.filterDropdownSelect}
            value={selectedWorksheetId}
            onChange={handleWorksheetChange}
          >
            {worksheets.map((sheet) => (
              <option key={sheet.id} value={sheet.id}>
                {sheet.name}
              </option>
            ))}
          </select>
        </div>

        <div className={dataParserStyles.filterSearchBlock}>
          <label className={dataParserStyles.filterLabelHeader}>{FILTER.SEARCH_LABEL}</label>
          <input
            type="text"
            placeholder={MESSAGES.PLACEHOLDER}
            className={dataParserStyles.filterSearchField}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
