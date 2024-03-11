import mongoose from "mongoose";
import {DB_NAME} from "./constants";






//MY FIRST APPROACH WHICH I WOULD NOT PREFER

// import express from "express";
// const app = express()

// (async () => {
//    try{
//      await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`);
//      app.on("error", (error) => {
//         console.log("ERROR:", error);
//         throw error     
//     })

//     app.listen(process.env.PORT, () => {
//         console.log(`App is listening on port ${process.env.PORT}`);
//     })
//    }
//    catch(error){
//     console.error("ERROR: ", error)
//     throw err
//    }
// })()