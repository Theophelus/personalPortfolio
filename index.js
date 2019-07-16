'use strict';
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const nodemailer = require('nodemailer');
const creds = require('./services/credentials')
const smtpTransport = require('nodemailer-smtp-transport');

//define instances
let app = express();
//Configure Transport
// Pass Credentials to the SMTP Transport
var transport = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: creds.USER,
        pass: creds.PASS
    }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));
// // initialise the flash middleware
app.use(flash());
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

// configure express handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: false
}));


function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', {
        error: err
    });
}
// parse application/json
app.use(bodyParser.json());
//configure public for=lder for static files
app.use(express.static('public'));

//Add a post route to be able to send form info 
app.post('/send', (req, res) => {

    let username = req.body.username;
    let email = req.body.email;
    let phone = req.body.phone;
    let messages = req.body.messages;
    let content = `You have a new contact request\n\n CONTACT DETAILS \n\n name: ${username} \n email: ${email} \n phone: ${phone} \n\n MESSAGE \n\n ${messages}`
    var mail = {
        from:username,
        to: 'aneletom10@gmail.com',
        subject: 'Interested In Your Services',
        text: content
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                msg: 'fail'
            })
        } else {
            res.json({
                msg: 'success'
            })
        }
    })
})
let PORT = process.env.PORT || 3007;

app.listen(PORT, function () {
    console.log(`App starting on port ${PORT}`);
});