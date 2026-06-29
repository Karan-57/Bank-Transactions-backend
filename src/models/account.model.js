const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "an account must associated by user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "INACTIVE"],
            message: "Status can be either ACTIVE, FROZEN or INACTIVE"
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "currency is required to create an account"],
        default: "INR"
    }
}, {
    timestamps: true
});

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;