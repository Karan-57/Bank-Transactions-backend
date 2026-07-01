const mongoose = require('mongoose')

const accountModel = require('../models/account.model')

async function createAccountController(req, res) {
    const user = req.user;


    const account = await accountModel.create({ user: user._id });

    res.status(201).json({
        message: "account created",
        account
    });
}

async function getAllUserAccounts(req,res){
    const accounts = await accountModel.find({user: req.user._id});

    if(accounts.length === 0){
        res.status(200).json({
            message:"no accounts found"
        });
        return;
    }

    res.status(200).json({
        message:"accounts fetched sucessfully",
        accounts
    });
}

async function getUserBalance(req,res){
    const account = await accountModel.findOne({
        _id:req.params.accountId,
        user: req.user._id
        });


    if(!account){
        return res.status(404).json({
            message: "account not found"
        });
    }

    const balance = await account.getBalance();

    res.status(200).json({
        message:"balance fetched sucessfully",
        balance
    });
}

module.exports = { createAccountController, getAllUserAccounts, getUserBalance };