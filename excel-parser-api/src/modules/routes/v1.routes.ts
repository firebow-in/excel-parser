import { Router } from "express"
import { dataParserRouter } from "./dataParser.routes.js"
import { uploadRouter } from "./upload.routes"

const router = Router()
router.use(uploadRouter)
router.use(dataParserRouter)

export default router

