const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const router = express.Router();
require('dotenv').config();

router.post('/send-email', (req, res) => {
    const { email, nombre, telefono, mensaje } = req.body

    const contentHtml = `
    <h2>Gracias por contactarse con nosotros, le damos un cordial saludo de parte de DavidVivancoWeb.com</h2></br>
    <h2>Esta es su copia de respaldo de su formulario de contacto:</h2>
        <h2>Nombre: ${nombre}</h2>
        <p>Email: ${email}</p>
        <p>Telefono: ${telefono}</p>
        <p>Mensaje: ${mensaje}</p></br>
        </br></br>
        <h2>En breve nos pondremos en contacto con ud para contestar su requerimiento.</h2><br>
        <h2>David Vivanco</h2>        
    `

    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    async function sendMail() {
        try {
            const accessToken = await oAuth2Client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.USER_MAIL,
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });
            const mailOptions = {
                from: nombre,
                to: email,
                bcc: process.env.BCC_MAIL,
                subject: "Info WEB DavidVivancoWeb- Confirm",
                html: contentHtml,
            };

            const result = await transporter.sendMail(mailOptions);
            return result

        } catch (err) {
            console.error(err)
        }
    }

    sendMail()
        .then(result => res.status(200).send({message: 'Formulario Enviado'}))
        .catch(console.error)
});

module.exports = router;