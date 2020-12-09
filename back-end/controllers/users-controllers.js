const {validationResult} = require('express-validator')
const httpError = require('../Models/http-error')
const User = require('../Models/userSchema');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getUsers =async (req,res,next)=>{
    let users;
    // fetching all users info excluding password from db
    try{
        users = await User.find({},'-password') 
    }
    catch(err){
        const error = new httpError('failed to fetch users',500)
        return next(error);
    }
    if(!users){
        const error = new httpError('no users',500)
        return next(error);
    }
    console.log(users);
    res.json({users: users.map(user => user.toObject({ getters: true }))});
 
}

const userSignUp =async (req,res,next)=>{
    const {name,email,password} = req.body;

    //validating user input 
    const error = validationResult(req);
    if(!error.isEmpty()){
        const error = new httpError('enter valid data',422)
        return next(error);
    }

    let identifyUser 
    try {
        //checking if email already exists
         identifyUser = await User.findOne({email:email})
    }
    catch(err){
        const error = new httpError('try again later',400)
        return next(error);
    }
   // returning error if email already exists
   console.log(identifyUser)
    if(identifyUser){
        let error = new Error('email already exists');
        error.code = 400
        return next(error);
    }

    let hashedPassword
    try{
        hashedPassword = await bcrypt.hash(password,12)
    }catch(err){
        let error = new Error('failed to register user');
        error.code = 400
        return next(error)
    }
    // creating user
    const newUser = new User({
        name,
        email,
        password:hashedPassword,
        image:'http://localhost:5000/'+req.file.path,
        places:[]
    });
    console.log(newUser)
    //saving to db
    try{
        await newUser.save()
    }
    catch(err){
        const error = new httpError('try again later',400)
        return next(error);
    }

    //generating jwt token
    let token
    try{
        token = jwt.sign({email:email,userId:newUser.id},'secretkey',{expiresIn:'1h'})
    }
    catch(err){
        const error = new httpError('try again later',400)
        return next(error)
    }

    res
    .status(201)
    .json({email:email,userId:newUser.id,token:token});

}

const userLogIn = async (req,res,next)=>{

    const {email , password} = req.body
        //validating user input 
    const error = validationResult(req);
    if(!error.isEmpty()){
        const error = new httpError('invalid credentials',401)
        return next(error)
    }
    let identifyUser;
    try{
        identifyUser = await User.findOne({email:email})
    }
    catch(err){
        const error = new httpError('try again later',500)
        return next(error);
    }
    //decoding the password and comparing
    let isPasswordValid = false
    try{
       isPasswordValid= await bcrypt.compare(password,identifyUser.password)
    }catch(err){
        let error = new Error('failed to login user');
        error.code = 400
        return next(error)
    }

    if(!identifyUser || !isPasswordValid){
        let error = new Error('invalid credentials');
        error.code = 401
        return next(error);
    }
     //generating jwt token
     let token
     try{
         token = jwt.sign({email:email,userId:identifyUser.id},'secretkey',{expiresIn:'1h'})
     }
     catch(err){
         const error = new httpError('try again later',400)
         return next(error)
     }
     
    res
    .status(200)
    .json({email:email,userId:identifyUser.id,token:token});

}

module.exports = {
    getUsers,
    userSignUp,
    userLogIn
}