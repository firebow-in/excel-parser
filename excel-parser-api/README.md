Excel Parser API

Backend service for the Excel Parser POC.

Overview

The API is responsible for:

Accepting Excel file uploads (.xlsx, .xls, .csv)
Validating uploaded files
Parsing Excel workbooks and worksheets
Normalizing parsed data into a consistent structure
Persisting data into PostgreSQL using Prisma
Exposing APIs for retrieving stored records
Supporting search and filtering of parsed records

Tech Stack
Node.js
Express.js
TypeScript
PostgreSQL
Prisma ORM
SheetJS (xlsx)
Multer
Zod

Project Structure
src/
├── server.ts
├── config/
├── routes/
└── modules/
├── excel-upload/
└── excel-record/
