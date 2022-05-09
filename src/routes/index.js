const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();
require('dotenv').config();

router.get('/miapiget', (req,res)=>{
    res.status(200).json({message: "get ok"})
})

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

   
    async function sendMail() {
        try {
     
            const transporter = nodemailer.createTransport({
                host: "mx.davidvivancowebapi.com",
                port: 465,
                secure: true, // use TLS
                auth: {
                  user: "otro@davidvivancowebapi.com",
                  pass: "Jav@1905",
                },
                tls: {
                  // do not fail on invalid certs
                //   servername: "mx.davidvivancowebapi.com",
                  rejectUnauthorized: true,
                },
            });
            const mailOptions = {
                from: nombre,
                to: email,
                bcc: process.env.BCC_MAIL,
                subject: "Solicitud recibida",
                html: contentHtml,
            };

            const result = await transporter.sendMail(mailOptions);
            return result

        } catch (err) {
            console.error("El error es:", err)
        }
    }

    sendMail()
        .then(result => res.status(200).send({message: 'Formulario Enviado'}))
        .catch(console.error)
});

module.exports = router;