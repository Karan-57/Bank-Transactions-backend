const jwt = require('jsonwebtoken')

const userModel = require('../models/user.model')
const blacklistModel = require('../models/blacklist.model')
const emailService = require('../services/email.service')

/**
 * - user register controller
 * - POST /api/auth/register
 */

async function registerUserController(req, res) {
    const { email, name, password } = req.body;

    const userExists = await userModel.findOne({ email: email });

    if (userExists) {
        res.status(409).json({
            message: "User with email already exists",
            status: "failed"
        });
        return;
    }

    const user = await userModel.create({
        email,
        name,
        password
    });

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("token", token);

    res.status(201).json({
        message:"user registered",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });

    await emailService.sendRegistrationEmail(user.email, user.name);

}

/**
 * - user login controller
 * - POST /api/auth/login
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email }).select("+password");

    if (!user) {
        res.status(401).json({
            message: "invalid credentials"
        });
        return;
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
        res.status(401).json({
            message: "invalid credentials"
        });
        return;
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("token", token);

    res.status(200).json({
        message: "user logged in successsfully",
        token
    });

}

/**
 * - user logout controller
 * - POST /api/auth/logout
 */

async function logoutUserController(req,res){ 
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if(!token){
        res.status(200).json({
            message:"user logged out successfully"
        });
        return;
    }

    res.clearCookie('token');

    await blacklistModel.create({
        token:token
    });

    res.status(200).json({
        message:"user logged out successfully"
    })
}

module.exports = { registerUserController, loginUserController }