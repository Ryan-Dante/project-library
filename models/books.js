const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String],
    commentcount: { type: Number, default: 0 }
}, {
    strictQuery: 'throw'
});

const Books = mongoose.model('Issue', bookSchema);

module.exports = Books;