# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 5
- **Component Library**: Material UI (MUI) v7
- **CSS Framework**: Tailwind CSS v4
- **Icons**: `lucide-react`
- **Routing**: React Router v7
- **API Calls**: Axios (using a shared instance configuration)
- **Toast Notifications**: `react-toastify`

---

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

| Route                        | Component          | Purpose                                                                                                      |
| ---------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `/`                          | `ExcelUpload.tsx`  | Landing area. Features the dropzone upload form and a table displaying upload history logs.                  |
| `/uploads/:uploadId/records` | `ExcelRecords.tsx` | Data Explorer. Opens a selected upload, provides sheet selection tabs, searches, and lists database records. |

---

## Core Frontend Rules (`rules_frontend.md` summary)

Keep these constraints in mind during implementation:

- **State Management**: Do not introduce heavy state engines (Redux, MobX, Zustand). Rely on local React component state or modular `React.createContext()` providers and hooks.
- **Component-Scoped Styles**: Write clean components. All custom MUI layout parameters and `sx` shapes must reside in a dedicated `<feature>.styles.ts` file, structured using helpers like `createStyles`. Do not place raw style blocks inline inside components.
- **Axios Calls**: Do not expose raw Axios configurations inside components. Encapsulate all requests into api modules (e.g. `excelUploadApi.ts`) returning unwrapped types.
- **Type Safety**: Avoid using `any` or cast operators. Assert precise schema typing for all API inputs and context values. Use `date-fns` for time formatting (never use `moment`).
