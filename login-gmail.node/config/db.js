const mongoose = require("mongoose");

const db = process.env.MONGO_URI ;

const connect = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connect;
