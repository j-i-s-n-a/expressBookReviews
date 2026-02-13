const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
exports.public_users = public_users;
const axios = require('axios');


public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
  
    const userExists = users.find(user => user.username === username);
  
    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }
  
    users.push({ username: username, password: password });
  
    return res.status(200).json({ message: "User successfully registered" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const response = await axios.get(`http://localhost:5000/books`);
  
      const books = response.data;
  
      if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book details" });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    const result = [];

    const keys = Object.keys(books);

    keys.forEach((key) => {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    });

    return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
public_users.get('/books-async', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });

public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;
  
    try {
  
      const response = await axios.get('http://localhost:5000/books');
  
      const books = response.data;
      let result = [];
  
      for (let key in books) {
        if (books[key].author === author) {
          result.push(books[key]);
        }
      }
  
      if (result.length > 0) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: "No books found for this author" });
      }
  
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  
  });
  

module.exports.general = public_users;
