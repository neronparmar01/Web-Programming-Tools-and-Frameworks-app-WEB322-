/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _____Neron Nelson Parmar_____ Student ID: __171690217__ Date: __2/5/23__
*
* Cyclic Web App URL: _____________https://easy-plum-tadpole-kit.cyclic.app/____________
*
* GitHub Repository URL: __________https://github.com/neronparmar01/web322-app.git__________
*
********************************************************************************/ 
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
var express = require("express");
var app = express();
var blogservice = require("./blog-service.js");
var path = require("path");

//setting up the cloudinary config
cloudinary.config({
    cloud_name: 'dmkx6jl7u',
    api_key: '331761398114722',
    api_secret: 'LS-rG40AfPN5m0ObEgWfLxTVBi0',
    secure: true
   });
   

//creating an upload variable
const upload = multer(); // no { storage: storage }


var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public')); // using static middleware for files

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/",(req,res)=> {
    res.redirect('/about');
});

// setup another route to listen on /about
app.get("/about", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/about.html"));
});


// new routes using then 
// for published posts
app.get("/post", (req, res) => {
    getAllPosts().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

// for categories
app.get("/categories", (req, res) => {
    getCategories().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

// for blogs
app.get("/blog", (req,res) =>{
    getPublishedPosts().then((data) => {
        res.json({data});
    }).catch((err)=>{
        res.json({message: err});
    })
}); 

//for posts
app.get("/posts/add", (req,res)=>{
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});

//adding the post route
app.post('/posts/add', upload.single('featureImage'), async (req, res) => {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
  
      async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      }
  
      upload(req).then((uploaded) => {
        processPost(uploaded.url);
      });
    } else {
      processPost('');
    }
  
    function processPost(imageUrl) {
      req.body.featureImage = imageUrl;
  
      // Process the req.body and add it as a new Blog Post before redirecting to /posts
      const postData = {
        id: 0,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        featured: req.body.featured === 'on',
        published: req.body.published === 'on',
        featureImage: req.body.featureImage,
        date: new Date().toDateString(),
      };
      addPost(postData);
  }
  getAllPosts().then((data) => {
    res.json({data});
}).catch((err) => {
    res.json({message: err});
})
  });
  
  module.exports = app;

//for the posts

app.get('/posts', (req, res) => {
  const category = req.query.category;
  const minDateStr = req.query.minDate;

  if (category) {
    // filter by category
    const posts = getPostsByCategory(category);
    res.json(posts);
  } else if (minDateStr) {
    // filter by minimum date
    const minDate = new Date(minDateStr);
    const posts = getPostsByMinDate(minDate);
    res.json(posts);
  } else {
    // no filter
    const posts = getPosts();
    res.json(posts);
  }
});


// step 2
// new route to get a single post by ID
app.get('/post/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = getPostById(postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({message: `Post with id ${postId} not found`});
  }
});







// setup http server to listen on HTTP_PORT
//app.listen(HTTP_PORT, onHttpStart);

// initialize the blog-service module
initialize()
  .then(() => {
    // start the server if the initialization is successful
    app.listen(8080, () => {
      console.log('Server started on port 8080');
    });
  })
  .catch((error) => {
    // output the error message to the console if initialization failed
    console.error('Error during initialization: ', error);
  });

// for error not found (404)
app.get('/error', (req, res) => {
  res.status(404).send('Page not found');
});