var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const productRoutes = require("./app/product/router");
const categoryRoutes = require("./app/category/router");
const tagRoutes = require("./app/tags/router");
const authRoutes = require("./app/auth/router");
const deliveryAddressRoutes = require("./app/deliveryAddress/router");
const cartRoutes = require("./app/cart/router");
const orderRoutes = require("./app/order/router");
const invoiceRoutes = require("./app/invoice/router");
const { secretKey } = require("./app/config");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const store = new MongoDBStore({
  uri: "mongodb://localhost:27017/foodstore",
  collection: "session",
});
// Set Session
app.use(
  session({
    name: "kepo",
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: "auto",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 Day
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:4173"],
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/auth", authRoutes);
app.use("/api", deliveryAddressRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", invoiceRoutes);
// Home
app.use("/", function (req, res) {
  res.render("index", {
    title: "Food Server",
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
