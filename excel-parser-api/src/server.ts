import express from "express"
import cors from "cors"
import apiRouter from "./modules/routes/api.routes"

const app = express()

app.use(cors())
app.use(express.json())

app.use(apiRouter)

app.listen(3000, () => {
  console.log("Server running on port 3000")
})
