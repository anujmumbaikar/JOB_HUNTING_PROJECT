import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static('public'))


import userRouter from "./routes/user.routes.js"
import companyRouter from "./routes/company.route.js"
app.use("/api/v1/users",userRouter)
app.use("/api/v1/companies",companyRouter)

export {app}