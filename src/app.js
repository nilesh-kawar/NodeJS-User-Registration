const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 3000;
require('./db/conn');
const Register = require('./models/registers')

const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path)

app.get('/',(req, res)=>{
    res.render("index");
})
app.get('/register',(req,res) => {
    res.render("register");
})
app.get('/login',(req,res) => {
    res.render("login");
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
                // phone : req.body.phone,
                age : req.body.age,
                password : password,
                cpassword : cpassword
            })

            const registred = await registerEmployee.save();
            res.status(201).render("index");

        }else{
            res.send('Password and Confirm Password not match');
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post('/login', async(req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useEmail = await Register.findOne({email: email});
        if (useEmail.password === password) {
            res.render("index");
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