import { Router } from "express"


import { getHealth } from "../health/health"
import V1Router from "./v1.routes.js"

const router = Router()

router.get("/health", getHealth)

router.use("/api/v1", V1Router)


export default router