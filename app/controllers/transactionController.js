const express = require('express');
const router = express.Router();
const transactionModel = require('../models/transactionModel');
const categoryModel = require('../models/categoryModel')



// Reading transactions
router.get('/', async (req, res, next) => {
  try {
    const transactions = await transactionModel.getTransactions(req.cookies.user);
    res.render('transactions', { title: 'Transaction List', transactions });

  } catch (err) {
    next(err);
  }
});


// Creating transactions
router.get('/create', async (req, res, next) => {
  const categories = await categoryModel.getCategories()
  //console.log(categories)
  res.render('transaction_Form', {
    title: "Add a Transaction",
    categories,
    transaction: undefined,
  })
})

router.post('/create', async(req, res, next) => {
  console.log('req.cookies', req.cookies);
  try{
    let passingData = {
      ...req.body,
      UserID: req.cookies.user == 'admin' ? 0 : req.cookies.user,
    }
    console.log('passingData', passingData);
    const { Type, Amount, Date, CategoryID, Description, UserID } = passingData
    const transactionId = await transactionModel.createTransaction(Type, Amount, Date, CategoryID, Description, UserID);
    res.status(201).json({ newTransactionId: transactionId})
  res.redirect('/transactions')
  }catch (err) {
   next(err)
  }
 
})

// Deleting transactions
router.post('/', async(req, res, next) => {
  let id = req.body ['transaction_id']
  transactionModel.deleteTransaction(id)
  res.redirect('/transactions')
 })

// Updating transactions
router.get('/:id/update', async(req, res, next) => {
  transaction = await transactionModel.getSingleTransaction(req.params.id)
  
  const categories = await categoryModel.getCategories()
  res.render('transaction_Form', {
    title: `Update Transaction: ${transaction.Description}`,
    categories,
    transaction,
  })
})

router.post('/:id/update', async(req, res, next) => {
  let newTransaction = {
    ...req.body
  }

  newTransaction['Date'] = new Date(newTransaction['Date']).toISOString().slice(0, 10)

  if((newTransaction['Type'] == 'expense') && (Number(newTransaction['Amount']) > 0))
    newTransaction['Amount'] = "-" + newTransaction['Amount']

  if((newTransaction['Type'] == 'income') && (Number(newTransaction['Amount']) < 0))
    newTransaction['Amount'] = Number(newTransaction['Amount']) * -1

  await transactionModel.updateTransaction(req.params.id, newTransaction)

  res.redirect('/transactions');
})



module.exports = router;
