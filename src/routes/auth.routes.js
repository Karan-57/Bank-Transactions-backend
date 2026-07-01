const {Router} = require('express')

const authController = require('../controller/auth.controller')

const authRouter = Router()

/**
 * - POST /api/auth/register
 * - user register api
 */
authRouter.post('/register', authController.registerUserController);
/**
 * - POST /api/auth/login
 * - user login api
 */
authRouter.post('/login', authController.loginUserController);

/**
 * - POST /api/auth/logout
 * - user logout api
 */
authRouter.post('/logout', authController.logoutUserController);

module.exports = authRouter;