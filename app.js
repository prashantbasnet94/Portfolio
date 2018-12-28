var express= require("express");
var app= express();
var multer= require("multer");
app.set("view engine","ejs");
var path=require('path');
 var fs = require('fs');

app.use(express.static("public"));
var files = fs.readdirSync('public/images/');
var portfolioName =files;



app.get("/",function(req,res){ 
         res.render("index.ejs",{portfolioName:portfolioName})

}) ;


app.get ("/portfolioUpload",function(req,res){
    res.render("portfolio.ejs",{portfolioName:portfolioName});
})


//set storage engine
var storage = multer.diskStorage({
    destination: './public/images/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

//initialize the upload variable

var upload=multer({
    storage:storage
}).single('myImage');


app.post('/upload',function(req,res){
    upload(req,res,(err)=>{
        if(err){
            console.log("error found")
        }else{
            console.log(req.file);
            res.redirect("/file");
        }
    })
    
});

app.get("/file",function(req, res) {
    
   
    res.render("index.ejs",{portfolioName:portfolioName})
;
})


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Starting server");
})
 