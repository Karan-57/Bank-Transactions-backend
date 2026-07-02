const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const accountRoutes = require('./routes/account.routes')
const transactionRoutes = require('./routes/transaction.routes')

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transaction', transactionRoutes);

app.get('/',(req,res)=>{
    res.send("Ledger service is up and running");
});

module.exports = app