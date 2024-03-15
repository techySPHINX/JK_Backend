import multer from "multer";
//multer is used basically for file uploading in backend part
//here i am using diskStorage  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //here i am keeping every single file after uploading in public folder 
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname)
    }
  })
  
 export const upload = multer({ 
    storage,
})

