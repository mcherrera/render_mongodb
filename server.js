require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

const atlas = "mongodb+srv://ccapdev:" + process.env.ATLAS_PASSWORD + "@cluster0.gmy19i9.mongodb.net/crud"
mongoose.connect(atlas);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const usersSchema = {
    name: String,
    email: String,
    phone_no: String,
  };
  
const User = mongoose.model("User", usersSchema);

app.get('/',(req, res) => {

    User.find({}, function(err, rows) {
        if (err){
            console.log(err);
        } else {
            res.render('index', {
                title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
                users : rows
            });
        }
      });
});

app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});
 
app.post('/save',(req, res) => { 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
    });
  
    user.save( function(err) {
        if  (err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
  

});

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    User.find({ _id: userId}, function (err, result) {
        if (err){
            console.log(err);
        } else {
        res.render('user_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });            
        }
    });

});

app.post('/update',(req, res) => {
    const userId = req.body.id;
    const query = { _id: userId };
    const name = req.body.name;
    const email = req.body.email;
    const phone_no = req.body.phone_no;
    User.updateOne(query, { name: name, email: email, phone_no: phone_no }, function(err, result) {
        if(err){
            console.log(err);
          } else {
           res.redirect('/');
          }
    });
});

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    User.findByIdAndRemove(userId, function(err){
       if(err){
         console.log(err);
       } else {
        res.redirect("/");
       }

    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});