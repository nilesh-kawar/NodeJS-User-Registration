require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 3000;
require('./db/conn');
const Register = require('./models/registers');
const  cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path)

app.get('/',(req, res)=>{
    res.render("index");
})
app.get('/secret',auth, (req, res)=>{
    console.log(`Login Cookie: ${req.cookies.jwt}`);
    res.render("secret");
})
app.get('/register',(req,res) => {
    res.render("register");
})
app.get('/login',(req,res) => {
    res.render("login");
})
app.get('/logout',auth, async(req,res) => {
    try {
        console.log(req.user);

        // For Single Logout 
        // req.user.tokens = req.user.tokens. filter((currentElem)=>{
        //     return currentElem.token !== req.token;
        // })
        // Logout from all devices 
        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("Logout Successfully!!");
        await req.user.save();
        res.render("login");
    } catch (err) {
        res.status(500).send(err)
    }
})
// Create new user in db 
app.post('/register',async(req,res) => {
    try {
        password = req.body.password;
        cpassword = req.body.cpassword;
        if(password===cpassword){
            const registerEmployee = new Register({
                firstName : req.body.firstName,
                lastname : req.body.lastName,
                email : req.body.email,
                gender : req.body.gender,
                age : req.body.age,
                password : password,
                cpassword : cpassword
            })
            console.log("The Success part: "+registerEmployee);
            const token = await registerEmployee.generateAuthToken();
            console.log("User Register Token : "+token);
            //Cookies
            res.cookie("jwt",token,{
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            })
            const registred = await registerEmployee.save();
            res.status(201).render("index");

        }else{
            res.send('Password and Confirm Password not match');
        }
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})

app.post('/login', async(req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useEmail = await Register.findOne({email: email});
        // const isMatch = await bcrypt.compare(password, useEmail.password)
        const token = await useEmail.generateAuthToken();
        console.log("User Login Token : "+token);
        // Cookies 
        res.cookie("jwt",token,{
            expires: new Date(Date.now() + 500000),
            httpOnly: true,
            // secure: true 
        })
        if (useEmail.password === password) {
            res.redirect("/");
        }else{
            res.status(404).send("Password and email not match")
        }
    } catch (error) {
        res.status(400).send("Invalid Credentials");
    }
})
app.listen(port, () => {
    console.log(`Server running at PORT ${port}`);
})