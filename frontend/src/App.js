import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //get the users from the api located at localhost:3000/users

    const fetchData = async () => {
      let users = await fetch("http://localhost:3000/users", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      users = await users.json();
      setUsers(users);
    };
    fetchData();

    // set the user as the first in the list
    setSelectedUser(users[0]);
  }, []); // empty array means run only once


  async function handleSubmit(event) {
    event.preventDefault();
    // Very quick and dirty way to get the value of the input... would probably use a react form library if this weren't a demo
    let post = {
      user_id: selectedUser,
      title: document.querySelector("input[placeholder='title']")
        .value,
      body: document.querySelector("input[placeholder='body']")
        .value,
    };

      let new_post = await fetch(
        `http://localhost:3000/users/${selectedUser}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        }
      );
      new_post = await new_post.json();
      console.log(new_post);
      // console.log(posts);
      // setPosts(posts.concat(new_post));
      setPosts([...posts, new_post]);
    


  }


  // Since this is a small application, we aren't going to break the page into smaller components.

  // We return a dropdown list of users with selectedUser highlghted.

  // When the button labeled "Get Posts" is clicked, we get the posts for the selected user.

  // We return a list of posts for the selected user. We also return a list of comments for each post.

  // We also add a form for adding a new post. It will contain the Title and body of the post. Clicking the button labeled "Add Post" will add the post to the selected user (and create the post on the backend).

  return (
    <div className="App">
      <div className="container">
      <p> users: </p>
      <select onChange={(e) => setSelectedUser(e.target.value)}>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        onClick={async () => {
          let new_post = await fetch(
            `http://localhost:3000/users/${selectedUser}/posts`
          );
          new_post = await new_post.json();
          // for simplicity we clear out the comments, could be the case that the selected user is the same as before but I don't want to deal with that in this demo
          setPosts(new_post);
        }}
      >
        Get Posts
      </button>
      </div>

        

      <div className="container"  >
      <p> posts: </p>
      {
        // If the posts array is empty then we don't want to render anything
        posts.length === 0
          ? "No Posts"
          : posts.map((post) => (
              <div key={post.id}>
                <p>
                  <b>Posted By: </b>{" "}
                  {users.filter((user) => user.id === post.user_id)[0].name}
                </p>
                <p>
                  <b>Title:</b> {post.title}
                </p>
                <p>
                  <b>Body:</b> {post.body}
                </p>
                {/* <p>{post.user_id}</p>
          <p>{post.id}</p> */}
              </div>
            ))
      }
      </div>

      <div className="container">
      <p> new post: </p>
      <form>
        <input type="text" placeholder="title" />
        <input type="text" placeholder="body" />
        <button
          onClick={handleSubmit}
        >
          Add Post
        </button>
      </form>
      </div>
    </div>
  );
}

export default App;
