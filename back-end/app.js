const express = require('express');
const bodyparser =require('body-parser');
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const placeRouter = require('./routes/places-routes');
const userRouter = require('./routes/users-routes')

const app = express();

app.use(bodyparser.json())
app.use((req,res,next)=>{

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',  
                                    'Accept,Content-Type,X-Requested-With,Origin,Authorization');
    res.setHeader('Access-Control-Allow-Methods','*');

    next()
})
//REST API
app.use('/api/places',placeRouter)
app.use('/api/users',userRouter)
app.use('/uploads/images',express.static(path.join('uploads','images')))

//error handling
app.use((req,res,next)=>{
    const error = new Error('could not find this route')
    error.code = 400
    next(error)
})

app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,error =>{
            console.log(error)
        })
    }
    if(res.headerSent){
        return next(error)
    }
    res.status( error.code || 500 );
    res.json({message:error.message || 'something went wrong'})
})

mongoose
.connect('mongodb+srv://username:password@cluster0.xb2oh.mongodb.net/mernapp?retryWrites=true&w=majority',{ useNewUrlParser: true } )
.then(()=>{
    app.listen(5000);
    console.log('mongodb connected')}
)
.catch(
    (err)=>{
        console.log(err)
    }
)
