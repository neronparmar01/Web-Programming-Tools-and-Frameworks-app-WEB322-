const fs = require("fs"); // required at the top of your module

// declaring variables with arrays 
var posts = [];
var categories = [];

//initialization and reading of file 
initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', (err, data) => {
            if (err) {
                reject('unable to read file');  // will  be throwing error
            } else {
                posts = JSON.parse(data);
            }
        });



        // reading the file of categories division
        fs.readFile('./data/categories.json', (err, data) => {
            if (err) {
                reject('unable to read file');
            }
            else {
                categories = JSON.parse(data);
            }
        });
        resolve();
    })
};



// for the posts
getAllPosts = () => {
    return new Promise((resolve, reject) => {
        if (posts.length === 0) {
            reject("no results returned");
        }
        resolve(posts);


    });
};



// for the published posts
getPublishedPosts = () => {
    return new Promise((resolve, reject) => {

        const PublishedPosts = posts.filter(post => post.published == true);

        if (PublishedPosts.length == 0) {
            reject('no results returnefgd');
        }

        resolve(PublishedPosts);

    })
};


// getPublishedPostsByCategories(Assignment4)
module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post => post.published && post.category == category);
        (filteredPosts.length > 0) ? resolve(filteredPosts) : reject("no results returned");
    });
}

// for the categories
getCategories = () => {
    return new Promise((resolve, reject) => {
        if (categories.length == 0) {
            reject('no results returned');
        }
        else {
            resolve(categories);
        }
        postData.id = posts.length + 1;
        posts.push(postData);
        resolve(postData);
    })
};

//for addPosts
addPost = (postData)  => {
    if (postData.published === undefined) {
        postData.published = false;
    } else {
        postData.published = true;
    }
      postData.id = posts.length + 1;
      postData.published = boolean(postData.published);
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth()+1;
      let year = date.getFullYear();
      postData.postDate = `${year}-${month}-${day}`;
      posts.push(postData);
    return new Promise((resolve, reject) => {
        if(postData.length == 0){
            reject('No Data')
        }else{

            resolve(postData);
        }
     
    });
  };

// post by categories
getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        let categorizedPost = posts.filter(post => post.category == category);

        if (categorizedPost.length == 0) {
            reject('no result returned');
        } else {
            resolve(categorizedPost);
        }
    })
};

//minDate post function
getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        let filteredPost = posts.filter(post =>  (new Date(post.postDate)) >= (new Date(minDateStr)));
        if (filteredPost.length == 0) {
            reject('no result returned');
        } else {
            resolve(filteredPost);
        }
    })
};

//getting post by id
getPostById = (id) => {
    return new Promise((resolve, reject) => {
        let postById = posts.find(post => post.id == id);

        if (postById.length == 0) {
            reject('no result returned');
        } else {
            resolve(postById);
        }
    })
}

// exporting
module.exports = {
    initialize, getAllPosts, getCategories, getPublishedPosts, addPost, getPostsByCategory, getPostsByMinDate, getPostById
};
