const express = require('express')
const {check} = require('express-validator');
const imageUploader = require('../middlewares/ImageUploader')
const verifyJWT = require('../middlewares/verify-jwt')
const {getPlaceById , 
      getPlaceByCreatorId, 
      createPlace ,
      updatePlace,
      deletePlace} = require('../controllers/places-countrollers')

const placerouter = express.Router()

placerouter.get('/:pid',getPlaceById)
placerouter.get('/user/:uid',getPlaceByCreatorId)

placerouter.use(verifyJWT)

placerouter.post('/',
    imageUploader.single('image'),[
    check('name').not().isEmpty(),
    check('description').isLength({min:5})
],createPlace)

placerouter.patch('/:pid',[
    check('name').not().isEmpty(),
    check('description').isLength({min:5})
],updatePlace)

placerouter.delete('/:pid',deletePlace)
module.exports = placerouter ;