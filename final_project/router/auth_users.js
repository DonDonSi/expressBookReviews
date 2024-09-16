const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usernameExists = users.filter((user) => user.username === username);  
    return usernameExists.length === 0;
};

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.find((user)=> user.username === username && user.password === password);
};


//only registered users can login
regd_users.post("/login", (req,res) => {
 const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in: missing username or password" });
    }
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: '1h' });
  
      req.session.authorization = { username, accessToken };
  
      return res.status(200).json({ message: "User successfully logged in", accessToken });
    } 
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn  } = req.params;
  const { review } = req.query;
  const username = req.session.authorization.username;

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added or updated successfully!", review: books[isbn].reviews[username], username: username });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.session.authorization.username;

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully!" });
  } else {
    return res.status(404).json({ message: "Review not found for this user." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
