const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/test_lv1")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("MongoDB Connect Error", err);
});

module.exports = connect;