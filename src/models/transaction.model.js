const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"A transaction must be associated with an from account"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"A transaction must be associated with an to account"],
        index:true
    },
    status:{
        type:String,
        enum:["PENDING","COMPLETED","FAILED","REVERSED"],
        message:"status must be either PENDING, COMPLETED, FAILED or REVERSED",
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true, "Amount is required to create a transaction"],
        min:[0,"Amount should not be negative"] 
    },
    idempotencyKey:{
        type:String,
        required:[true,"An idempotenc key is required to create a transaction"],
        index:true,
        unique:true
    }
},{
    timestamps:true
});

const transactionModel = mongoose.model('transaction',transactionSchema);

module.exports = transactionModel;