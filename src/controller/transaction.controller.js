const accountModel = require('../models/account.model')
const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const mongoose = require('mongoose')
const emailService = require('../services/email.service')

/**
 * transaction flow:
    * 1. validate request
    * 2. validate idempotency key
    * 3. check account status
    * 4. derive senders balance from ledger
    * 5. create transaction- PENDING
    * 6. create debit ledger entry
    * 7. create credit ledger entry
    * 8. mark transaction COMPLETED
    * 9. commit mongodb session
    * 10. send email notification
 */

async function createTransaction(req,res){

    /**
     * validate inputs
     */
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        res.status(400).json({
            message:"fromAccount, toAccount, amount and idempotencyKey are required",
        });
        return;
    } 

    const fromUserAccount = await accountModel.findOne({_id: fromAccount});
    const toUserAccount = await accountModel.findOne({_id: toAccount});

    if(!fromUserAccount || !toUserAccount){
        res.status(400).json({
            message:"invalid fromAccount or toAccount"
        });
        return;
    }

    /**
     * check transaction status for requests with same idempotency key
     */

    const transactionAlreadyExists = await transactionModel.findOne({idempotencyKey});

    if(transactionAlreadyExists){
        if(transactionAlreadyExists.status === "COMPLETED"){
            res.status(200).json({
                message:"transaction already processed",
                transactionAlreadyExists
            });
            return;
        }

        if(transactionAlreadyExists.status === "PENDING"){
            res.status(200).json({
                message:"transaction is pending"
            });
            return;
        }

        if(transactionAlreadyExists.status === "FAILED"){
            res.status(500).json({
                message:"transaction failed, please retry"
            });
            return;
        }
        
        if(transactionAlreadyExists.status === "REVERSED"){
            res.status(500).json({
                message:"transaction is reversed, please retry"
            });
            return;
        }
    }

    /**
     * check account status
     */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        res.status(400).json({
            message:"Both formAccount and toAccount must be active"
        });
        return;
    }
    /**
     * derive sender balance
     */

    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        res.status(400).json({message:`Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`});
        return;
    }

    /**
     * create transaction - PENDING
     */

    const session = await mongoose.startSession();
    session.startTransaction();

    const transactionArray = await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
    }],{session});

    const transaction = transactionArray[0];

    /**
     * create debit ledger entry
     */

    const debitLedgerEntryArray = await ledgerModel.create([{
        account:fromAccount,
        amount,
        transaction: transaction._id,
        type:"DEBIT"
    }],{session});

    const debitLedgerEntry = debitLedgerEntryArray[0];
    
    /**
     * create credit ledger entry
    */
   
   const creditLedgerEntryArray = await ledgerModel.create([{
       account:toAccount,
       amount,
       transaction: transaction._id,
       type:"CREDIT"
    }],{session});
    
    const creditLedgerEntry = creditLedgerEntryArray[0];
    /**
     * mark transaction COMPLETED
     */

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    /**
     *  commit mongodb session
     */

    await session.commitTransaction();
    session.endSession();

    await emailService.sendTransactionSuccessEmail(req.user.email, req.user.name, amount, transaction._id, toAccount);
    
    res.status(201).json({
        message:"Transaction sucessful",
        transaction
    });
}

async function createInitialFunds(req,res){
    const {toAccount, amount, idempotencyKey} = req.body;

    if(!toAccount || !amount || !idempotencyKey){
        res.status(400).json({
            message:" toAccount, amount and idempotencyKey are required",
        });
        return;
    }

    const toUserAccount = await accountModel.findOne({_id: toAccount});

    if(!toUserAccount){
        return res.status(400).json({
            message:"invalid toAccount"
        });
    }
    
    const fromUserAccount = await accountModel.findOne({
        systemUser:true,
        user: req.user._id
    });
    
    if(!fromUserAccount){
        return res.status(400).json({
            message:"system account not found"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transactionArray = await transactionModel.create([{
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
    }],{session});

    const transaction = transactionArray[0];

    const debitLedgerEntryArray = await ledgerModel.create([{
        account:fromUserAccount._id,
        type:"DEBIT",
        amount,
        transaction:transaction._id
    }],{session});

    const debitLedgerEntry = debitLedgerEntryArray[0]; 
    
    const creditLedgerEntryArray = await ledgerModel.create([{
        account:toUserAccount._id,
        type:"CREDIT",
        amount,
        transaction:transaction._id
    }],{session});

    const creditLedgerEntry = creditLedgerEntryArray[0]; 

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();


    return res.status(201).json({
        message:"Transaction completed"
    });
}

module.exports = {createTransaction, createInitialFunds};