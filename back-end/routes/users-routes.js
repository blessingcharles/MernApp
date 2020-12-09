const express = require('express');
const {check} = require('express-validator')
const { userSignUp, userLogIn ,getUsers} = require('../controllers/users-controllers');
const imageUploader = require('../middlewares/ImageUploader');

const userrouter = express.Router()

userrouter.get('/',getUsers)

userrouter.post('/signup',
    imageUploader.single('image')
    ,[
    check('name').not().isEmpty(),
    check('password').isLength({min:5}),
    check('email').isEmail()
],userSignUp)

userrouter.post('/login',[
    check('password').isLength({min:5}),
    check('email').isEmail()
],userLogIn)

module.exports = userrouter ;