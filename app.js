const express = require('express');
const app = express();
const port = 3000;

const postsRouter = require('./routes/posts.js');
const connect = require('./schemas');
connect();

app.use(express.json());

app.use("/", [postsRouter]);

app.listen(port, () => {
    console.log('Server open on port', port);
});