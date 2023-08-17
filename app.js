require('dotenv').config();
const express =require("express");
const bodyParser =require("body-parser");
const ejs = require("ejs");
const mongoose =require("mongoose")
const app = express();
const encrypt = require("mongoose-encryption")

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.API_KEY,{useNewUrlParser:true});

const userSchema = new mongoose.Schema( {
    email:String,
    password:String,
});


userSchema.plugin(encrypt,{secret :process.env.SECRET, encryptedFields:["password"]})

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
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })

    newUser.save().then((data,err)=>{
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
           
        }
    })

})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}).then((foundUser,err)=>{
        if(err){
            console.log(err)
        }else{
         
            if(foundUser) {
                if(foundUser.password === password ){
                    res.render("secrets")
                    
                    
                }else{
                    res.send("pass or user incorerct")
                }
            }
        }
    })
})



app.listen(3000,()=>{
    console.log("server started on port 3000.")
})