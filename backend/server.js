const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const articlesRouter = require('./routes/articles');
const usersRouter = require('./routes/users');

app.use('/articles', articlesRouter);
app.use('/users', usersRouter);

//static files
// app.use(express.static(path.join(__dirname, "../build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});