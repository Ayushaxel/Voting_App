const express =require('express');
require('dotenv').config();
const db = require('./db');
const cors = require("cors");
const app= express();
const bodyParser = require('body-parser')
app.use(cors());

app.use(bodyParser.json());
const PORT=process.env.PORT ||3000;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);
app.use('/admin', require('./routes/adminRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})