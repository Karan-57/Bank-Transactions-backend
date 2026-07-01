const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,"Ledgrer must be associated with account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"An amount is required to create a ledger"],
        immutable:true,
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaction',
        immutable:true,
        required:[true,"transaction is required to create a leader"],
        index:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"type can be either CREDIT or DEBIT"
        },
        required:[true,"type is required to create a leader"],
        immutable:true
    }
});


function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('updateOne', preventLedgerModification);

ledgerSchema.pre('updateMany', preventLedgerModification);

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);

ledgerSchema.pre('findByIdAndUpdate', preventLedgerModification);

ledgerSchema.pre('replaceOne', preventLedgerModification);

ledgerSchema.pre('findOneAndReplace', preventLedgerModification);

ledgerSchema.pre('deleteOne', preventLedgerModification);

ledgerSchema.pre('deleteMany', preventLedgerModification);

ledgerSchema.pre('findOneAndDelete', preventLedgerModification);

ledgerSchema.pre('findByIdAndDelete', preventLedgerModification);

ledgerSchema.pre('remove', preventLedgerModification);


const ledgerModel = mongoose.model('ledger',ledgerSchema);

module.exports = ledgerModel;   
