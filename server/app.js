require('dotenv').config();

const express = require("express");

const app = express();
const port = process.env.PORT || 4000;
// const port = 'passenger';
const hostname = '127.0.0.1';
const nodemailer = require("nodemailer");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const path = require("path");
const public_path = path.join(__dirname,'/dist');
app.use('/',express.static(public_path));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://dyskredy-art.com');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

app.get("*",(req,res)=> {
    res.sendFile(path.join(public_path,'index.html'));
});

app.post("/app/check_captcha",(req,res)=> {
    fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "https://dyskredy-art.com/contact"
        },
        body: new URLSearchParams ({
            response: req.body['g-recaptcha-response'],
            secret: process.env.SECRET,
            remoteip: req.ip
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            res.status(200).json();
        } else {
            res.status(500).json();
        };
    })
});

app.post("/app/send_mail",(req,res)=> {
    
    let config = {
        host: 'node197-eu.n0c.com',
        port : 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        }
    }

    let transporter = nodemailer.createTransport(config);

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `message from ${req.body.userMail} - ${req.body.subject}`,
        text: req.body.messageContent
    };

    transporter.sendMail(mailOptions,(error)=> {
        if(error){
            res.status(500).json()
        } else {
            res.status(200).json()
        };
    });

});

app.listen(port, hostname,()=> {
    console.log('starting server on port : ',port);
})



