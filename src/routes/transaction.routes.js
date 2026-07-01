const {Router} = require('express')

const authMiddleware = require('../middleware/auth.middleware')

const transactionRouter = Router();


/**
 * - POST /api/transaction/
 * - Create new transaction
 */
transactionRouter.post('/',authMiddleware)

module.exports = transactionRouter;