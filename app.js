require('dotenv').config();
const express =require("express");
const bodyParser =require("body-parser");
const ejs = require("ejs");
const mongoose =require("mongoose")
const app = express();
const bcrypt = require("bcrypt")

const saltRounds = 10;


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));


mongoose.connect(process.env.API_KEY,{useNewUrlParser:true});

const userSchema = new mongoose.Schema( {
    email:String,
    password:String,
});




const User = new mongoose.model("User",userSchema)

app.get("/",(req,res)=>{
    res.render("home")
    

})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
   
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        
    const newUser = new User({
        email:req.body.username,
        password:hash
    })

    newUser.save().then((data,err)=>{
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
           
        }
    })
    });


})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}).then((foundUser,err)=>{
        if(err){
            console.log(err)
        }else{
         
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                   if (result){
                    res.render("secrets")
                 
                   }else{
                    res.send("incorrect password and username")
                   }
                });
            }
        }
    })
})



app.listen(3000,()=>{
    console.log("server started on port 3000.")
})