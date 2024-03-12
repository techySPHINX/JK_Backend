import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
   cerdentials: true
}))
//specially we used body-parser in past but now it is not required as express contain body-parser

app.use(express.json({limit: "100kb"}))
app.use(express.urlencoded({extended: true, limit:"100kb"}))
app.use(express.static("public"))
app.use(cookieParser())


export {app}