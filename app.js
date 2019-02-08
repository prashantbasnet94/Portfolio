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
        
        




app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/portfolio");
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
var files = fs.readdirSync('public/images/skills');



app.get("/register",function(req, res) {
    
   

    res.render("Register.ejs")
    
    
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


app.get("/login",function(req,res){
    res.render("Login.ejs");
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



var portfolioName =files;


  var portfolioType = new mongoose.Schema({
        name: String
    });
    
    var portType;
    
    var PortfolioType=mongoose.model('PortfolioType',portfolioType);
    
    
var portfolioTypeDetail= mongoose.Schema({
    title:String,
    projectName:String,
    disciption:String,
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
    
    res.render("index.ejs",{aboutMe:about,portfolioName:portfolioName})
      
    
})



 
var fileName1;
//set storage engine
var storage = multer.diskStorage({
    destination: './public/images/portfolioFieldTypeSkills',
    filename:function(req,file,cb){
        cb(null, fileName1=file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

//initialize the upload variable

var upload=multer({
    storage:storage
}).single('myImage');




app.get("/try",function(req, res) {
    res.render("a.ejs");
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



app.get("/",function(req,res){ 
    
    
   // console.log(files)
    /*var aboutM;
    About.find({about},function(err,aboutMe){
        if(err){
            console.log(err);
        }else{
            console.log('===========================')
          
            aboutM=aboutMe;
              console.log(aboutM)
        }
    })
         res.render("index.ejs",{})*/
         
        
         
         
         
         PortfolioType.find({},function(err,portType){
             if(err){
                 console.log(err);
             }else{ 
                 
                 var firstPort=[],secondPort=[];
                  var dataName=[];
                                //  console.log('length'+portType.length);
                                  
                for(var a=0;a<portType.length;a++){
                  dataName.push(portType[a]);
                  // console.log(dataName)
               
                    /*if(a%2===0){
                      
                       firstPort.push( portType[a].name);
                    }else if(a%2===1){
                        
                         
                        secondPort.push(portType[a].name);
                        
                    }*/
                    
                };
                              res.render("index.ejs",{dataName:dataName,fileName:files});

                
/*               res.render("index.ejs",{firstPort:firstPort,secondPort:secondPort})
*/
             }
         })
         
         

}) ;


app.get ("/portfolioUpload", isLoggedIn,function(req,res){
    
         PortfolioType.find({},function(err,portType){
             if(err){
                 console.log(err);
                 
             }else{ 
                 res.render("portfolio.ejs",{portType:portType})

             }
         })
         
});

app.get("/portfolio/:id",function(req, res) {
    
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

 
    


//portfolio files are submitted here like webdevelopment graphics desgin etc

app.post('/:title/create/uploadText', isLoggedIn,function(req,res){
    
     
    PortfolioTypeDetail.create({
        title:req.params.title,
        projectName:req.body.projectName,
        disciption:req.body.disciption,
        image:fileName1
    },function(err, form) {
            if(err){
                console.log(err)
            }else{
             
              
              res.redirect("/a")
            }
        })

    
     
});





app.post('/:title/create/uploadImage', isLoggedIn,function(req,res){
    
  
                 
                 
                 upload(req,res,(err)=>{
                        if(err){
                            console.log("error found")
                        }else{
                           
                        }
                    })  
                    
});



 







 













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






app.get("/portfolio/:title/create/:id", isLoggedIn,function(req, res) {
    
    
    
    PortfolioType.findById(req.params.id,function(err,PortfolioFieldType){
        if(err){
            console.log(err)
        }else{
            res.render("PortfolioFieldTypeEdit2.ejs",{PortfolioFieldType:PortfolioFieldType})
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


app.post("/form", isLoggedIn,function(req,res){
  
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
            res.render("read.ejs",{data:data});
        }
    })
    
})

app.get("/read/:id", isLoggedIn,function(req, res) {
    Form.findById(req.params.id,function(err,found){
        if(err){
            res.redirect("/message")
        }else{
           res.render("show.ejs",{found:found})
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

















































/*
var github = require('octonode');

// Then we instantiate a client with or without a token (as show in a later section)

 
 

 

var client = github.client({
  username: 'prashantbasnet94',
  
});
 

var ghrepo         = client.repo('prashantbasnet94/portfolio');
 
client.get('/user', {}, function (err, status, body, headers) {
  console.log(body); //json object
});

 
 
*/

app.get("/*",function(req, res) {
    res.redirect("/");
})

 






app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Starting server");
})
 