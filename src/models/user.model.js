const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required to create an user"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill a valid email address"],
        unique: [true, "email already exists"]
    },
    name: {
        type: String,
        required: [true, "name is required to create an user"]
    },
    password: {
        type: String,
        required: [true, "password is required to create an user"],
        minlength: [6, "password should have more than 6 characters"],
        select: false
    }
}, {
    timestamp: true
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return;
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return next();
});

userSchema.method.comparePassword = async function() {
    return await bcrypt.compare(password, this.password)
}