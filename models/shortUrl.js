/* The code `const mongoose = require('mongoose')` is importing the Mongoose library, which is an
Object Data Modeling (ODM) library for MongoDB and Node.js. It allows you to define schemas and
models for your data and provides an interface for interacting with MongoDB. */
const mongoose = require('mongoose')
const shortId = require('shortid')

/* The code `const shortUrlSchema = new mongoose.Schema({ ... })` is defining a schema for a short URL
in the Mongoose library. */
const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true,
        unique: true,
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate,
        unique: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});
/* The code `module.exports = mongoose.model('ShortUrl', shortUrlSchema);` is exporting a Mongoose
model named 'ShortUrl'. This allows other parts of the application to import and use this model to
interact with the MongoDB database. */

module.exports = mongoose.model('ShortUrl', shortUrlSchema);