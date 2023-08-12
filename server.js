const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/userRoutes')
const path = require('path')
const mongoose = require('mongoose')
const adminRouter = require('./routes/adminRoutes')

const app = express();

app.enable('trust proxy')
app.use(bodyParser());
app.use(express.static(path.join(__dirname,"public")))
app.use(cors());
app.options('*',cors());

let DB = `mongodb+srv://cms:<password>@cluster0.ibisiwq.mongodb.net/?retryWrites=true&w=majority`
password = 'b9yq4d8FZPNGzIqy'

DB = DB.replace('<password>',password)


mongoose.connect(DB,{}).then(()=>{
    console.log('Connection Successfull')
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)

const PORT = 4000;
app.listen(4000,()=>{
    console.log('Server is Runing')
})