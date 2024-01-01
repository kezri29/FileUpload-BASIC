const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
app.set('views',path.join(__dirname,"views"));
app.set('view engine',"ejs");

var storage = multer.diskStorage({
    destination : function(req,file,cb){     //A string or function that determines the destination path for uploaded files.
        //logical work
        //cb --> callback
        cb(null,'uploads')
    },
    filename : function(req,file,cb){       //A function that determines the name of the uploaded file
        cb(null, file.originalname.replace(/\.[^/.]+$/,"") + '_' + Date.now() + path.extname(file.originalname)) //path.extname(file.originalname) --> gives the extension of the file that is being uploaded
    }
})

let maxSize = 2 * 1000 * 1000  // maximum size allowed for file upload - 2mb

let upload = multer({
    storage : storage,  // var storage from above
    limits : {
        fileSize : maxSize
    },
    fileFilter : function(req,file,cb){  //filefilter is used to fileter the only format/file type that is allowed to be uploaded
        let filetypes = /jpeg|jpg|png/;  //allowed filetypes
        let mimetype = filetypes.test(file.mimetype);  //mimetype --> this is being used to check whther the file uploaded is of the same type of the allowed files
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase())  //extension of the file

        if(mimetype && extname){
            return cb(null,true);
        }
        cb("Error:Upload an image file and sort of that " + filetypes );
    }
}).single('mypic'); //Returns middleware that processes a single file associated with the given form field.

app.get('/',(req,res)=>{
    res.render('signup')
})

app.post('/upload',(req,res,next)=>{
    upload(req,res,function(err){    //here upload is the object recieved from using multer above
        if(err){
            if(err instanceof multer.MulterError && err.code == "LIMIT_FILE_SIZE"){  //this if is only to handle the file size error
                return res.send("File size maxmimum 2mb"); //return here so that no exception is thrown
            }
            res.send(err);
        }else{
            res.send("Success. Image Uploaded");
        }
    })
})

app.listen(8080, ()=>{
    console.log('Server is Running');
})

//file.originalname.replace(/\.[^/.]+$/,"") --> used to get the og name of the file uploaded without the extension