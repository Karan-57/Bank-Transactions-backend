const accountModel = require('../models/account.model')

async function createAccountController(req, res) {
    const user = req.user;

    const account = await accountModel.create({ user: user.user_id });

    res.status(201).json({
        message: "account created",
        account
    });
}

module.exports = { createAccountController };