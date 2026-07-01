const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

async function createTransporter() {

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',

        auth: {
            type: 'OAuth2',

            user: process.env.EMAIL_USER,

            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,

            refreshToken: process.env.REFRESH_TOKEN,

            accessToken: accessToken.token
        },

        tls: {
            rejectUnauthorized: false
        }
    });

    return transporter;
}

const sendEmail = async(to, subject, text, html) => {

    try {

        const transporter = await createTransporter();

        const info = await transporter.sendMail({

            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            text,

            html
        });

        console.log("Message sent:", info.messageId);

    } catch (error) {

        console.error("Error sending email:", error);
    }
};

async function sendRegistrationEmail(userEmail, name) {

    const subject = "Welcome to Backend Ledger";

    const text = `
Hello ${name},

Your account has been created successfully.

You can now log in and start managing your transactions securely.

Thank you for joining us.

- Backend Ledger Team
`;

    const html = `
<div style="font-family: Arial, sans-serif; padding:20px;">

    <h2>Welcome, ${name}!</h2>

    <p>Your account has been created successfully.</p>

    <p>You can now log in and start managing your transactions securely.</p>

    <p>Thank you for joining us.</p>

    <br/>

    <p><strong>Backend Ledger Team</strong></p>

</div>
`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionSuccessEmail(userEmail,name,amount,transactionId, toAccount) {

    const subject = "Transaction Successful";

    const text = `
        Hello ${name},

        Your transaction has been completed successfully.

        Transaction Details:

        To: ${toAccount}
        Transaction ID: ${transactionId}
        Amount: ₹${amount}

        Thank you for using Backend Ledger.

        - Backend Ledger Team
    `;

    const html = `
        <div style="font-family: Arial, sans-serif; padding:20px;">

            <h2>Transaction Successful</h2>

            <p>Hello ${name},</p>

            <p>Your transaction has been completed successfully.</p>

            <div style="margin-top:20px; padding:15px; border:1px solid #ddd; border-radius:8px;">

                <p><strong>To:</strong> ${toAccount}</p>

                <p><strong>Transaction ID:</strong> ${transactionId}</p>

                <p><strong>Amount:</strong> ₹${amount}</p>

            </div>

            <br/>

            <p>Thank you for using Backend Ledger.</p>

            <br/>

            <p><strong>Backend Ledger Team</strong></p>

        </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail,name,amount,transactionId,toAccount) {

    const subject = "Transaction Failed";

    const text = `
        Hello ${name},

        We were unable to process your transaction.

        Transaction Details:

        To: ${toAccount}
        Transaction ID: ${transactionId}
        Amount: ₹${amount}

        Please try again later.

        If the issue continues, contact support.

        - Backend Ledger Team
    `;

    const html = `
        <div style="font-family: Arial, sans-serif; padding:20px;">

            <h2>Transaction Failed</h2>

            <p>Hello ${name},</p>

            <p>We were unable to process your transaction.</p>

            <div style="margin-top:20px; padding:15px; border:1px solid #ddd; border-radius:8px;">

                <p><strong>To:</strong> ${toAccount}</p>

                <p><strong>Transaction ID:</strong> ${transactionId}</p>

                <p><strong>Amount:</strong> ₹${amount}</p>

            </div>

            <br/>

            <p>Please try again later.</p>

            <p>If the issue continues, contact support.</p>

            <br/>

            <p><strong>Backend Ledger Team</strong></p>

        </div>
    `;

    await sendEmail(userEmail, subject, text, html);

}

module.exports = { sendRegistrationEmail, sendTransactionSuccessEmail, sendTransactionFailureEmail };