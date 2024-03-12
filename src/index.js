// require('dotenv').config({path:'./env'});  //for loading all environment varibles at main page reloading
//lets write an imporoved version of importing for maintaining consistency

import dotenv from "dotenv";
import connectDB from "./db/index.js";

//error handling important concep

dotenv.config({ //it's just a configuration
    path:'./env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000,  () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO DB connection fail", err);
})

//then method is for successful call whereas catch method is for error call


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




