const {Router} = require('express')

const authMiddleware = require('../middleware/auth.middleware')
const transactionController = require('../controller/transaction.controller')

const transactionRouter = Router();


/**
 * - POST /api/transaction/
 * - Create new transaction
 */
transactionRouter.post('/',authMiddleware.authMiddleware ,transactionController.createTransaction);

/**
 * - POST /api/transaction/system/intial-funds
 * - create initial funds from system account 
 */
transactionRouter.post('/system/initial-funds',authMiddleware.systemAuthMiddleware, transactionController.createInitialFunds);

module.exports = transactionRouter;