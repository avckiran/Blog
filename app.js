const   express = require('express'),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        cfg = require('./config/config.js'),
        mysql = require('mysql'),
        app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// Database initialization -- MySQL

const db = mysql.createConnection(cfg.dbCreds);

db.connect(err=>{
    if(err){console.log("ERROR!"+err);}else{console.log("Connected MySQL Successfully!")}
})

// Database has been setup
blogs = [];
db.query("SELECT * FROM X_BLOG", (err,result)=>{
    if(!err){blogs.push(result);}
})


//Routes

app.get('/', (req,res)=>{
    res.redirect("/blogs");
    // console.log(blogs);
    
});

app.get("/blogs", (req,res)=>{
    res.render('blogs', {blogs:blogs});
    console.log(blogs);
});




// Default route handler

app.get('*', (req,res)=>{
    res.send("404: Not Found");
});

// Listener

app.listen(3000, function(){
    console.log("Server Started");
});