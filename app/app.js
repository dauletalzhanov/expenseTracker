const express = require("express");
const path = require("path");
const createError = require("http-errors");
const cookieParser = require('cookie-parser')

const userController = require("./controllers/userController");
const categoryController = require("./controllers/categoryController");
const transactionController = require("./controllers/transactionController");
const signupandloginController = require("./controllers/signupandloginController");

const transactionModel = require("./models/transactionModel")
const userModel = require("./models/userModel")

const app = express();

app.use(express.static("static"));
app.set("view engine", "pug");
app.set("views", "./app/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

// setting up cookies
app.use(async (req, res, next) => {
  if(req.cookies.user == null){
    res.cookie('user', 'admin')
    console.log("admin mode")
  }
  
  if(req.cookies.user == 'admin' || req.cookies.user==null){
    res.locals.user = "admin"
  }
  else {
    res.locals.user = await userModel.getName(req.cookies.user)
  }
    
  next();
});

app.use("/users", userController);
app.use("/categories", categoryController);
app.use("/transactions", transactionController);
app.use("/auth", signupandloginController);

app.get("/landing_page", (req, res) => {
  res.render("landing_page");
});

app.get('/', (req, res) => {
  //req.cookies.user ? res.redirect("/home") : res.redirect("/landing_page")
  const user =  req.cookies.user 

  if(user && user != "admin")
    res.redirect("/home")
  else
    res.redirect("/landing_page")
    
});

app.get('/home', async (req, res, next)=> {
  const transactions = await transactionModel.getTransactions(req.cookies.user);
  const totalBalance = transactionModel.calculateTotalBalance(transactions);

  res.render('HomePage', {
    title: 'Home',
    transactions,
    totalBalance,
  })
})

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}/`);
});