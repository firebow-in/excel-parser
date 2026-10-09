# Excel Parser Monorepo

Welcome to the **Excel Parser** monorepo. This project is a full-stack system built to accept Excel uploads, parse their sheets/rows dynamically, persist them to a PostgreSQL database via Prisma, and render them in a clean, paginated, and filterable UI.

## Repository Architecture

This repository is organized as a monorepo split into three core modules:

1. **[excel-db-model](file:///d:/Workspace/tech-pocs/excel-parser/excel-db-model/README.md)**: Contains the database schema definitions and migration configurations using Prisma ORM.
2. **[excel-parser-api](file:///d:/Workspace/tech-pocs/excel-parser/excel-parser-api/README.md)**: Node.js + Express + TypeScript backend application handling the ingestion parser engine (via SheetJS) and records queries.
3. **[excel-parser-web](file:///d:/Workspace/tech-pocs/excel-parser/excel-parser-web/README.md)**: React 19 + Vite 8 + TypeScript frontend application providing drag-and-drop file upload, processing progress tracking, and dynamic grid rendering.

Refer to the master project plan: [excel-parser-project-plan.md](file:///d:/Workspace/tech-pocs/excel-parser/excel-parser-project-plan.md) for detailed descriptions, architectural constraints, and open questions.

---

## Parallel Development Plan

To facilitate parallel development before the local execution setup is complete, the work has been divided into distinct modules with mock contracts:

### 1. Database Model (`excel-db-model`)
* **Focus**: Schema schema files (`.prisma`) and migrations.
* **Key Tasks**: Model design for uploads, worksheets metadata, and raw/parsed dynamic row stores.
* **Go to**: [DB Model README](file:///d:/Workspace/tech-pocs/excel-parser/excel-db-model/README.md)

### 2. Backend Service (`excel-parser-api`)
* **Focus**: Multipart file ingestion, SheetJS parser logic, transactional DB operations, API endpoints.
* **Key Tasks**: Implement routing under `/api/v1/excel`, logic in `excel-upload.parser.ts`, service logic, and Zod validator schemas.
* **Go to**: [Backend API README](file:///d:/Workspace/tech-pocs/excel-parser/excel-parser-api/README.md)

### 3. Frontend App (`excel-parser-web`)
* **Focus**: UI layout, MUI theme incorporation, React Context providers, state, components.
* **Key Tasks**: Custom drag-drop dropzone, upload progress tracking, worksheet tabs, dynamic columns table, and row details drawer.
* **Go to**: [Frontend Web README](file:///d:/Workspace/tech-pocs/excel-parser/excel-parser-web/README.md)

---

## Design and Development Standards
All development must adhere strictly to the guidelines defined in:
* **[rules_backend.md](file:///d:/Workspace/tech-pocs/excel-parser/rules_backend.md)**: File organization, type definitions (no `any`), controllers/services pattern, result objects, error handling.
* **[rules_frontend.md](file:///d:/Workspace/tech-pocs/excel-parser/rules_frontend.md)**: Directory layout, state management (no Redux/Zustand), styling conventions (strictly `sx` styles in `<component>.styles.ts`), API interfaces.
