const   express = require('express'),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override'),
        expressSanitizer = require('express-sanitizer'),
        app = express();

// App config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Database initialization -- Mongoose

mongoose.connect("mongodb://localhost/blogApp",{
        useNewUrlParser:true, 
        useCreateIndex:true,
        useFindAndModify: false
    }, function(err){
    if(err){
        console.log(err);
    }else { console.log ("Connected to Mongo");}
});

// Create schema and model

const blogSchema = new mongoose.Schema(
    {
        title: String,
        image: String,
        body: String,
        created: {type: Date, default:Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

// Testing the db to create a blog

// Blog.create({
//     title:"Test post1",
//     image:"https://cdn.pixabay.com/photo/2018/10/30/16/06/water-lily-3784022__340.jpg",
//     body:"This is a sample blog to test"
// });


//Routes

app.get('/', (req,res)=>{
    res.redirect("/blogs");
    // console.log(blogs);
    
});

app.get("/blogs", (req,res)=>{
   Blog.find({}, function(err, result){
       if(!err){
           res.render('index', {blogs: result});
       }else{ 
           console.log ("Error! : ", err);
       }
   }); 
});

app.get("/blogs/new", (req,res)=>{
    res.render('new');
});

// Create Route

app.post('/blogs',(req,res)=>{
    // create blog
        req.body.blog.body = req.santize(req.body.blog.body);
        Blog.create(req.body.blog, function(err, newBlog){
            if(!err){
                res.redirect('/blogs')
            }else{
                res.render('new');
                console.log("Error!", err);
            }
        });
});

app.get("/blogs/:id", (req,res)=>{
    Blog.findById(req.params.id, function(err, result){
        if(!err){
            res.render("show", {blog: result});
        }else{res.redirect("/blogs");}
    });
    // res.render("show");
});

// Edit route

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, result){
        if(err){ res.redirect("/blogs");}else{
         res.render("edit", {blog: result});   
        }
    })
    // res.render("edit");
})


//Update Route
app.put("/blogs/:id", function(req,res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
   }); 
});

//Delete Route
app.delete("/blogs/:id", function (req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
        console.log(err);
        res.redirect("/blogs");
        }
    });
    res.redirect("/blogs");
});



// Default route handler

app.get('*', (req,res)=>{
    res.send("404: Not Found");
});

// Listener

app.listen(3000, function(){
    console.log("Server Started");
});