import type { Request, Response } from "express"

export const getHealth = (_req: Request, res: Response): Response => {
  return res.status(200).json({ status: "ok" })
}
