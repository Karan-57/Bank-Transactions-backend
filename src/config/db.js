const mongoose = require('mongoose')

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Server connected to database");
        })
        .catch((err) => {
            console.log("error connecting to database", err);
            process.exit(1);
        })
}

module.exports = connectDB;