const {Router} = require('express')

const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controller/account.controller')

const accountRouter = Router()

/**
 * - POST /api/accounts/
 * - Create new account
 * - Protected route
 */

accountRouter.post('/', authMiddleware, accountController.createAccountController)

module.exports = accountRouter