const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    _postId: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    content: {
        type: String
    },
    createdAt: {
        type: String,
    }
});

module.exports = mongoose.model("Comments", commentsSchema);