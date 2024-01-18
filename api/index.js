import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const __dirname= path.resolve();

const app= express();

app.use(express.static(path.join(__dirname,'/client/dist')))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})
//username nazmussaqib
//password nazmussaqib2003
mongoose
.connect(process.env.URI)
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})


app.use(express.json())
app.use(cookieParser())


app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next)=>{
    const statusCode= err.statusCode || 500;
    const message= err.message || "internal server error";
    return res.status(statusCode).json({
        success: false,
        error : message,
        statusCode,
    })
})

app.listen(3000, ()=>{
    console.log("server listening on port 3000");
})
