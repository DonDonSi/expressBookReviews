const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
 const { username, password } = req.body;
  if (username && password && isValid(username)) {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  } else {
    return res.status(404).json({ message: "User already exists or missing credentials!" });
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const { isbn } = req.params;
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found!" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const { author } = req.params;
    let filteredBooks = Object.values(books).filter((book) => book.author === author);
    res.send(JSON.stringify({filteredBooks}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  let filteredBooks = Object.values(books).filter((book) => book.title === title);
    res.send(JSON.stringify({filteredBooks}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];

 if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = book.reviews;
  return res.status(200).json({ reviews });
});

// Tasks 10-13

const exampleUrl= "http://localhost:5000";

// Task 10
public_users.get('/async-get-books', async function (req, res) {
    try {
        await new Promise(resolve => setTimeout(resolve, 100)); 
    res.send(JSON.stringify({ books }, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error getting books" });
  }
});

// Task 11
public_users.get('/async-isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
 axios.get(`${exampleUrl}/${isbn}`)
    .then(response => {
      const book = response.data;

      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error getting book" });
    });
});


// Task 12
public_users.get('/async-author/:author', async function (req, res) {
    const { author } = req.params;

    try {
      await new Promise(resolve => setTimeout(resolve, 100)); 
      
      const filteredBooks = Object.values(books).filter(book => book.author === author);
  
      if (filteredBooks.length > 0) {
        res.status(200).send(JSON.stringify({ filteredBooks }, null, 4));
      } else {
        res.status(404).json({ message: "Books not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error getting books" });
    }
  });

// Task 13
public_users.get('/async-title/:title', async function (req, res) {

    const { title } = req.params;

    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async operation
      
      const filteredBooks = Object.values(books).filter(book => book.title === title);
  
      if (filteredBooks.length > 0) {
        res.status(200).send(JSON.stringify({ filteredBooks }, null, 4));
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error getting book" });
    }
});

module.exports.general = public_users;

