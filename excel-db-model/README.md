## Installation

Install dependencies:

## npm install

Environment Setup

Create a .env file:

DATABASE_URL="postgresql://<username>:<password>@localhost:<port>/excel_parser"

Example:(we are using in env)
DATABASE_URL="postgresql://neo_local:background-342_local@localhost:4432/excel_parser"

## Prisma Commands

Validate schema:

## npx prisma validate

Generate Prisma Client:

## npx prisma generate

Create migration:

## npx prisma migrate dev

Apply existing migrations:

npx prisma migrate deploy
