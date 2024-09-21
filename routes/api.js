/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

let mongoose = require('mongoose');
let mongodb = require('mongodb');
const connectDB = require('../db.js');

const Books = require('../models/books.js');

module.exports = function (app) {

  connectDB();

  // GET array of book objects
  app.route('/api/books')
    .get(async function (req, res){
      
      try {
        const books = await Books.find({});

        if (!books) {
          return res.json([]);
        }

        res.json(books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        })));
      } 
      catch (error) {
        res.json([{ error: 'could not retrieve books' }]);
      }
    })
    
    // POST new book to db
    .post( async function (req, res){
      let title = req.body.title;
      
      // Check if title is not provided
      if (!title) {
        return res.send('missing required field title')
      }

      // Create a new book
      const newBook = new Books({ title });

      try {
        const book = await newBook.save();
        res.json({ _id: book._id, title: book.title });
      } catch (error) {
        res.json({ error: 'book could not be created' });
      }

    })

    //DELETE all books in database
    .delete(async function(req, res){
      console.log(req.body + 'delete all books');

      try {
        const deletedBooks = await Books.deleteMany();
        console.log(deletedBooks);
        res.send('complete delete successful');
      } catch (error) {
        res.send('could not delete books');
      }
    });

  //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      
      try {
        const book = await Books.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (error) {
        res.json({ error: 'no book exists' });
      }
    })

     //POST request to /api/books/{_id} to add a comment.
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
     
      try {
        const book = await Books.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }

        if(!comment) {
          return res.send('missing required field comment');
        }
        
        book.comments.push(comment);
        book.commentCount = book.comments.length;
        await book.save();
        res.json(book);
      } catch (error) {
        res.send( 'no book exists' );
      }
    })
    
    //DELETE book by id
    .delete(async function(req, res){
      let bookid = req.params.id;

      try {
        const deletedBook = await Books.findByIdAndDelete(bookid);

        if(!deletedBook) throw new Error('no book exists');
        res.send('delete successful');
      } catch (error) {
        res.send('no book exists');
      }
    }); 
};
