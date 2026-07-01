const {Router} = require('express')

const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controller/account.controller')

const accountRouter = Router()

/**
 * - POST /api/accounts/
 * - Create new account
 * - Protected route
 */

accountRouter.post('/', authMiddleware.authMiddleware, accountController.createAccountController)

/**
 * - GET /api/accounts
 * - get all user's account
 * - Protected route
*/
accountRouter.get('/', authMiddleware.authMiddleware, accountController.getAllUserAccounts)
/**
 * - GET /api/accounts/balance/:accountId
 * - get user's specific account's balance
 * - Protected route
 */
accountRouter.get('/balance/:accountId', authMiddleware.authMiddleware, accountController.getUserBalance)

module.exports = accountRouter