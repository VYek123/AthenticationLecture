//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs"); 
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption"); 

const app = express(); 

app.use(express.static("public")); 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://admin-vorleak:Test123@cluster0.rifci.mongodb.net/usersDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
}); 


userSchema.plugin(encrypt, {secret: process.env.API_KEY, encryptedFields: ['password'] }); /// this line has to use before creating the mongoose model

const User = new mongoose.model("User", userSchema); 

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password; 

    //checking for the matching userName, then check for the correct password 
    User.findOne({email: username}, (err, foundUser) => {
       
       if(err) {
            console.log(err);
       } else {
            if(foundUser){
                if(foundUser.password === password) {
                    res.render('secrets');
                }
            } 
       }
    
    })
})

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(err => {
        if(err) {
            res.send(err);
        } else {
            res.render('secrets');
        }
    })
});


app.listen(3000, () => {
    console.log("Server started on port 3000."); 
});