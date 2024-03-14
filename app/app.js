const express = require('express');
const path = require('path');
const createError = require('http-errors');
const userController = require('./controllers/userController');
const categoryController = require('./controllers/categoryController');
const transactionController = require('./controllers/transactionController');
const { getCategories } = require('./models/categoryModel');
const transactionModel = require('./models/transactionModel');

const app = express();

app.use(express.static('static'));
app.set('view engine', 'pug');
app.set('views', './app/views');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userController);
app.use('/categories', categoryController);
app.use('/transactions', transactionController);

app.get('/', (req, res) => {
  res.send('Hello world!');
});
app.get('/RecordExpenses', async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.render('expenses', { categories });
  } catch (error) {
    next(error);
  }
});
app.get('/EditExpenses', async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.render('editExpense', { categories });
  } catch (error) {
    next(error);
  }
});
// Define route for the home page
app.get('/homePage', async (req, res, next) => {
  try {
    const transactions = await transactionModel.getTransactions();
    res.render('home', { title: 'Transaction List', transactions });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`)
});
