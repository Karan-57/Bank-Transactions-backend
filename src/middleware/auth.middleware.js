const jwt = require('jsonwebtoken')


const userModel = require('../models/user.model')

async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "unauthorized user, token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.user_id);

        req.user = user;

        return next();
    } catch (err) {
        res.status(401).json({
            message: "unauthorized user, token is invalid"
        });
    }
}

async function systemAuthMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"unauthorized user, token missing"
        });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.user_id).select("+systemUser");

        if(!user.systemUser){
            return res.status(403).json({
                message:"forbidden, not a system user"
            });
        }

        req.user = user;

        return next();
    }catch(err){
        res.status(401).json({
            message:"unauthorized user, invalid token"
        });
    }
}


module.exports = {authMiddleware, systemAuthMiddleware};