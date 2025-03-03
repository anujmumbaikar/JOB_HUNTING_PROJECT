import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors({origin:true,credentials:true}))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static('public'))


import userRouter from "./routes/user.routes.js"
import companyRouter from "./routes/company.routes.js"
import jobRouter from "./routes/job.routes.js"
import applicationRouter from "./routes/application.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/companies",companyRouter)
app.use("/api/v1/jobs",jobRouter)
app.use("/api/v1/applications",applicationRouter)

export {app}