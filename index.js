import express from 'express';
import routes from './appRoute/routes.js'
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
const app  = express();
//Running on PORT
const port = process.env.PORT|5000
//DOTENV
dotenv.config({path:'./config.env'})

//JSON parser
app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 }))

//Middleware Routes
app.use(cors())
app.use(routes)

// Connection to DB
mongoose.connect(process.env.MONKEY,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Wait....\n Handshake confirmed.')
}).catch(e =>console.log(e))


if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
    const path = require("path");
    app.get('*',(NODE_ENV,res)=>{
        res.sendFile(path.resolve(__dirname,"client,build",'index.html'));
    })
}

app.listen(port,()=>console.log(`Application Running on port ${port}`))