require('dotenv').config();

const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT || 3010
const nodemailer = require("nodemailer");

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const smtp_user = process.env.SMTP_USER || ''
const smtp_password = process.env.SMTP_PASSWORD || ''

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 25,
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: smtp_user,
        pass: smtp_password,
    },
});

app.use(cors({
    origin: ['http://localhost:3000', 'https://portfolio-sigma-orcin-13.vercel.app'],
    methods: ['GET', 'POST'],
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/sendMessage', async (req, res) => {
    const {
        data: {
            name, email, message
        }
    } = req.body

    try {
        let info = await transporter.sendMail({
            from: 'Portfolio',
            to: smtp_user,
            subject: "Portfolio",
            text: `
            Имя: ${name}
            Почта: ${email}
            Сообщение:${message}
            `,

            html: `<h1>Сообщение с портфолио</h1>
                   <div><b>Имя: </b>${name}</div>
                   <div><b>Почта: </b>${email}</div>
                   <div><b>Сообщение: </b>${message}</div>
`,
        })


    } catch (error) {
        console.log(error);
    }
    res.send('Email sent successfully')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
