var     express                   =      require("express"),
        app                       =      express(),
        methodOverride            =      require("method-override"),
        multer                    =      require("multer"),
        path                      =      require('path'),
        fs                        =      require('fs'),
        mongoose                  =      require("mongoose"),
        passportLocalMongoose     =      require("passport-local-mongoose"),
        passport                  =      require("passport"),
        localStrategy             =      require("passport-local"),
        bodyParser                =      require("body-parser"),
        User                      =     require("./models/User");
        
        
var quote = require('fetch-quote');

 

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


//mongoose.connect("mongodb://localhost:27017/portfolio");
mongoose.connect("mongodb+srv://prashantbasnet:prashantbasnet94@portfolio-aejnr.mongodb.net/test?retryWrites=true");
//mongodb+srv://prashantbasnet94:<PASSWORD>@portfolio-aejnr.mongodb.net/test?retryWrites=true
app.use(express.static("public"));

app.use(require("express-session")({
    secret:"prashant basnet",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//gets all the images name in images dir





var destinyVar;
var storage ;
var fileName1;
  var upload;
     



//set storage engine
 storage= multer.diskStorage({
    destination: './public/images/portfolioFieldTypeSkills',
    filename:function(req,file,cb){
        cb(null, fileName1=file.fieldname+'-'+Date.now()+path.extname(file.originalname));
     //   console.log(destinyVar);
    }
});


//set storage engine
 var storageSkill= multer.diskStorage({
    destination: './public/images/skills',
    filename:function(req,file,cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
     //   console.log(destinyVar);
    }
});


//set storage engine
 var storageUpdate= multer.diskStorage({
    destination: './public/images/portfolioFieldTypeSkills',
    filename:function(req,file,cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
     //   console.log(destinyVar);
    }
});

 


//initialize the upload variable
function destiny(){
    
    
    if(arguments[0]==='createProject'){
         upload=multer({
   
         storage:storage
    }).single('myImage');

        
    }else if(arguments[0]==='skills'){
         upload=multer({
   
         storage:storageSkill
    }).single('myImage');

    }else if(arguments[0]==='updateProject'){
         upload=multer({
   
         storage:storageSkill
    }).single('myImage');

    }
  
}


/*
app.get("/register",function(req, res) {
    
   

    res.render("Register.ejs",{req:req})
    
    
})

app.post("/register",function(req, res) {
     console.log(req.body.username);
    console.log(req.body.password);
    
    
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
           return res.render("Register.ej")
        }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/portfolioUpload");
            })
        
    })
    
});

*/
app.get("/login",function(req,res){
    res.render("Login.ejs",{req:req});
});


app.post("/login",passport.authenticate("local",{
    successRedirect:"/portfolioUpload",
    failureRedirect:"/register"
}),function(req,res){
    
});

 app.get("/logout",function(req, res) {
     req.logout();
     res.redirect("/");
 })



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

 

  var portfolioType = new mongoose.Schema({
        name: String
    });
    
    var portType;
    
    var PortfolioType=mongoose.model('PortfolioType',portfolioType);
    
    
var portfolioTypeDetail= mongoose.Schema({
    title:String,
    projectName:String,
    disciption:String,
    repo:String,
    image:String
})

var PortfolioTypeDetail=mongoose.model("PortfolioTypeDetail",portfolioTypeDetail);

var about;
 var about = mongoose.Schema({
        about:String
    });
    
    var About =mongoose.model("About",about);
    
app.post("/aboutMe",function(req,res){
    
   
    About.create({
        about:req.body.aboutMe
    },function(err,about){
        if(err){
            console.log(err);
        }else{
            //console.log(about);
        }
    })
    //console.log(req.body.aboutMe);
    about=req.body.aboutMe;
    
    res.render("index.ejs",{aboutMe:about,portfolioName:fs.readdirSync('public/images/skills')})
      
    
})









 
var aboutMe=new mongoose.Schema({
    
    details: String
});

// var AboutMe=mongoose.model("AboutMe",aboutMe)

// var about=new AboutMe({
//     details:'what the hell i am supposed to do here?'
// });


// AboutMe.create({
//     details:'prashant basnet is don'
// },function(err,about){
//     if(err){
//         console.log(err);
        
//     }else{
//         console.log(about);
//     }
// })

// about.save(function(err,about){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(about);
//     }
// });



//retriving the data from about me
// AboutMe.find({},function(err,aboutMe){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(aboutMe);
//     }
// })


var fileName;
app.get("/",function(req,res){ 
     PortfolioType.find({},function(err,portType){
             if(err){
                 console.log(err);
             }else{ 
                 var firstPort=[],secondPort=[];
                  var dataName=[];
                for(var a=0;a<portType.length;a++){
                  dataName.push(portType[a]);
                 
                  };
                   
                    fileName=fs.readdirSync('public/images/skills');
                   //giving the name of files inside image/skills
                   res.render("index.ejs",{dataName:dataName,fileName:fileName,req:req})
             }
         })
}) ;


//render dashboard file for portfolio to edit 
app.get ("/dashboard", isLoggedIn,function(req,res){
    
         PortfolioType.find({},function(err,portType){
             if(err){
                 console.log(err);
                 
             }else{ 
                 res.render("portfolio.ejs",{portType:portType,req:req})

             }
         })
         
});

app.get("/portfolio/:id",function(req, res) {
    
   // var datas;
    
            PortfolioTypeDetail.find({},function(err, data) {
        if(err){
            console.log(err);
        }else{
           
    PortfolioType.findById(req.params.id,function(err, portfolioFieldType) {
        if(err){
            console.log(err);
        }else{
            
            //Gives Everything in the database From Respective 
             
            console.log(portfolioFieldType);
            res.render("PortfolioFieldType",{PortfolioFieldType:portfolioFieldType,data:data})
        }
        
    })
        }
    })
    
    
    
})



app.get("/portfolio/Edit/:id",function(req, res) {
    
    var datas;
    
            PortfolioTypeDetail.find({},function(err, data) {
        if(err){
            console.log(err);
        }else{
            datas=data;
        }
    })
    
    
    
    PortfolioType.findById(req.params.id,function(err, portfolioFieldType) {
        if(err){
            console.log(err);
        }else{
            
            //Gives Everything in the database From Respective 
             
            console.log(portfolioFieldType);
            res.render("PortfolioFieldType",{PortfolioFieldType:portfolioFieldType,data:datas})
        }
        
    })
})

 
    


//portfolio project files are submitted here like webdevelopment graphics desgin etc
app.post('/:title/create/uploadText', isLoggedIn,function(req,res){
    
     
    PortfolioTypeDetail.create({
        title:req.params.title,
        projectName:req.body.projectName,
        disciption:req.body.disciption,
        repo:req.body.repo,
        image:fileName1
    },function(err, form) {
            if(err){
                console.log(err)
            }else{
             
              
              res.redirect("/a")
            }
        })

    
     
});




//portfolio project files are updated on edit here like webdevelopment graphics desgin etc
app.put('/:title/update/updatedText/:id', isLoggedIn,function(req,res){
    
     
    PortfolioTypeDetail.findByIdAndUpdate(
        req.params.id,req.body.data,function(err, updatedData) {
            if(err){
                console.log(err)
            }else{
             
              
              res.redirect("/")
            }
        })
        
       

    
     
});


//portfolio project files are deleted on edit here like webdevelopment graphics desgin etc
app.delete('/project/delete/:id', isLoggedIn,function(req,res){
    
    
     
     
    PortfolioTypeDetail.findByIdAndRemove(
        req.params.id,function(err) {
            if(err){
                console.log(err)
            }else{
             
              
              res.redirect("/")
            }
        })
        
       

    
     
});




app.post('/:title/create/uploadImage', isLoggedIn,function(req,res){
    
  
            destiny('createProject')
                 
                 upload(req,res,(err)=>{
                        if(err){
                            console.log("error found")
                        }else{
                           
                        }
                    })  
                    
});

/*

app.put('/:title/update/uploadImage/:id', isLoggedIn,function(req,res){
    
    
     PortfolioTypeDetail.findByIdAndUpdate(
        req.params.id,req.body.data,function(err, updatedData) {
            if(err){
                console.log(err)
            }else{
             
              
              res.redirect("/")
            }
        })
  
            destiny('updateProject')
                 
                 upload(req,res,(err)=>{
                        if(err){
                            console.log("error found")
                        }else{
                           
                        }
                    })  
                    
});
*/



 
app.post("/skills/uploadImage",function(req, res) {
    
  destiny('skills');
    
   
    upload(req,res,(err)=>{
                        if(err){
                            console.log("error found")
                        }else{
                           
                           res.redirect("/portfolioUpload");
                        }
                    })  
})














//WebDevelopment,Blockchain development are submitted here
app.post('/uploadPortfolio', isLoggedIn,function(req,res){
    
    
  
    var portType= req.body.field;
    
     
    PortfolioType.create({name:portType},function(err,save){
        if(err){
            console.log(err)
        }else{
           res.redirect("/")
        }
    })
    
    
    
    
     
});


 

//rendering a page where you can edit portfoliofieltype or insert new projects in the field
app.get("/PortfolioEditSection", isLoggedIn,function(req, res) {
    PortfolioType.find({},function(err, portType) {
        if(err){
            console.log(err)
        }else{ 
                 
                 
                  var dataName=[];
                                //  console.log('length'+portType.length);
                                  
                for(var a=0;a<portType.length;a++){
                  dataName.push(portType[a]);
                    
                    
                }
        }
        
        res.render("PortfolioFieldTypeEdit1.ejs",{dataName:dataName})
                
    })
    
   
});



app.get("/portfolio/:title/edit/:id", isLoggedIn,function(req, res) {
    
    
    
            PortfolioTypeDetail.find({},function(err, data) {
        if(err){
            console.log(err);
        }else{
           PortfolioType.findById(req.params.id,function(err,PortfolioFieldType){
        if(err){
            console.log(err)
        }else{
            //will render the projects inside the portfoliofield in dashboard
            res.render("PortfolioFieldTypeEdit.ejs",{PortfolioFieldType:PortfolioFieldType,req:req,data:data})
        }
    })
  
        }
    })
    
   
})




app.get("/portfolio/:title/create/:id", isLoggedIn,function(req, res) {
    
    
    
    
    PortfolioType.findById(req.params.id,function(err,PortfolioFieldType){
        if(err){
            console.log(err)
        }else{
            res.render("PortfolioFieldTypeCreate.ejs",{PortfolioFieldType:PortfolioFieldType,req:req})
        }
    })
  
})





var form =mongoose.Schema({
    name:String,
    email:String,
    subject:String,
    message:String
});

var Form =mongoose.model("Form",form);


app.post("/form",function(req,res){
  
    Form.create({
    name:req.body.name,
     email:req.body.email,
    subject:req.body.subject,
    message:req.body.message
    },function(err,form){
        if(err){
            console.log(err)
        }else{
            res.redirect("/")
        }
    })
   
    
    Form.create({})
})


 

app.get("/message", isLoggedIn,function(req, res) {
    
    Form.find({},function(err,data){
        if(err){
            console.log(err);
        }else{
            
          //  console.log(data);
            res.render("read.ejs",{data:data,req:req});
        }
    })
    
})

app.get("/read/:id", isLoggedIn,function(req, res) {
    Form.findById(req.params.id,function(err,found){
        if(err){
            res.redirect("/message")
        }else{
           res.render("show.ejs",{found:found,req:req})
;        }
    })
})

app.delete("/read/delete/:id", isLoggedIn,function(req,res){
    Form.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/message");
        }
    })
  
})

app.get("/quote",function(req, res) {
    var Gquote;
    quote.get('funny', function (err, result) {

    if (err) {
        console.log(err);

    }
    if (result) {
Gquote=result;
        //console.log(result.quote );  // the quote content
}});

res.send(Gquote.quote);
    
})















//for editing
app.get("/portfolio/projectEdit/:id",function(req, res) {
    
    
    //console.log(req.params.id);
     //sends data
    var datas;
    
    
            PortfolioTypeDetail.findById(req.params.id,function(err, data) {
        if(err){
            console.log(err);
        }else{
            datas=data;
             console.log(data);
              res.render("PortfolioFieldTypeProjectEdit.ejs",{data:data});
        }
    })
    
   
    
    
   
    
    
})






app.get("/*",function(req, res) {
    res.redirect("/");
})




 






app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Starting server");
})
// app.listen(3000);
