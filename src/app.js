import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
   cerdentials: true
}))
//specially we used body-parser in past but now it is not required as express contain body-parser

// specifically we use app.use() when we have setup middleware

app.use(express.json({limit: "100kb"}))
app.use(express.urlencoded({extended: true, limit:"100kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register
export {app}