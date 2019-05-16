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
});


//Routes

app.get('/', (req,res)=>{
    res.redirect("/blogs");
    // console.log(blogs);
    
});

app.get("/blogs", (req,res)=>{
    res.render('blogs', {blogs:blogs});
    // console.log(blogs);
});

app.get("/blogs/new", (req,res)=>{
    res.render('new');
});

app.get("/blogs/:id", (req,res)=>{
    // sql="SELECT * FROM X_BLOG WHERE ID='?'";
    // value=req.params.id;
    // db.query(sql,value,(err,result)=>{
    //     if(err){
    //         res.redirect("/blogs");
    //         console.log(err);
    //     }else{
    //         res.render("show",{result: result});
    //         console.log(result);
    //     }
    // });
    res.render("show", {blogs:blogs});
});

app.post('/blogs',(req,res)=>{
    let sql="INSERT INTO X_BLOG(title, image, text) VALUES(?,?,?)";
    let values=[req.body.blog['title'],req.body.blog['image'],req.body.blog['desc']];
    db.query(sql,values,(err,result)=>{
        if(err){
            console.log("ERROR!", err);
        }else{
            console.log("Row inserted");
        }
    });
    res.redirect('/blogs');
});



// Default route handler

app.get('*', (req,res)=>{
    res.send("404: Not Found");
});

// Listener

app.listen(3000, function(){
    console.log("Server Started");
});