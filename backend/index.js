//import express to route api calls
const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// need this because the api is different origin
const cors = require("cors");


const app = express();
app.use(
  cors({
    origin: "*",
  })
);

//for parsing json body in post requests
app.use( express.json() ); 

var endpoint = "https://gorest.co.in/public/v2/";

// we should put this in an .env file... but this is a demo :|
var posting_access_token = "3e0e28888d9b3cbe4173ac0ac6d05df94684e7cd62d2c01e9297374a428341bf";

// return list of users from:
// https://gorest.co.in/public/v2/users
app.get("/users", async (req, res) => {
  //get the users from the api
  let users_endpoint = endpoint + "users";
  let users = await fetch(users_endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  users = await users.json();

  res.send(users);
});

app.get("/users/:user_id/posts", async (req, res) => {
  //get posts by user_id
  let user_id = req.params.user_id;
  let posts_endpoint = endpoint + "users/" + user_id + "/posts";
  let posts = await fetch(posts_endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  posts = await posts.json();
  res.send(posts);
});

app.get("/posts/:post_id/comments", async (req, res) => {
    //get comments for each post
    let post_id = req.params.post_id;
    let comments_endpoint = endpoint + "posts/" + post_id + "/comments";
    let comments = await fetch(comments_endpoint, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    comments = await comments.json();
    res.send(comments);
});

app.post("/users/:user_id/posts", async (req, res) => {
    //create a post for a user
    let user_id = req.params.user_id;
    let post = {
        user_id: user_id,
        title: req.body.title,
        body: req.body.body,
    };
    let posts_endpoint = endpoint + "users/" + user_id + "/posts";
    let new_post = await fetch(posts_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + posting_access_token,
        },
        body: JSON.stringify(post),
    });
    new_post = await new_post.json();
    res.send(new_post);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
