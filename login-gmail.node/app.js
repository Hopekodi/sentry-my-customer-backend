const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo")(session);
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Method overide
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
//passport config
require("./config/passport")(passport);
connectDB();
//session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
//passport middeleware
app.use(passport.initialize());

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const port = process.env.PORT;
// Static assets
app.use(express.static(path.join(__dirname, "/public")));
//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

//helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
