const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
require('dotenv').config();

const port = process.env.PORT || 4500;

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use(require("./routes/index"));


app.listen(port, () => {
    console.log("server on port", port);
})