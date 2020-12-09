const {validationResult} = require('express-validator');
const httpError = require('../Models/http-error')
const Place = require('../Models/placeSchema');
const User = require('../Models/userSchema');
const mongoose = require('mongoose');

const errorHandler = (msg,code)=>{

    let error = new Error(msg);
    error.code = code ;
    return error

}

//handling get request
const getPlaceById =async (req,res,next)=>{
    let place ;
    let placeId = req.params.pid ;
    try{
        place = await Place.findById(placeId)
    }
    catch(err){
        return next(err);
    }
    if(!place){

        return next(errorHandler('coudnot find the place',404))
    }

    res.json({place:place.toObject({getters:true})})

}

const getPlaceByCreatorId =async (req,res,next)=>{

    let userId = req.params.uid ;
    let places ;

    try{
     places = await Place.find({creator:userId})
     console.log(places)
    }
    catch(err){
        return next(errorHandler('failed to find the place',500))
    }
    if(!places || places.length === 0){
        return next(errorHandler('coudnot find the place',404))
    }
    //returning the response
    res.json({places:
                    places.map(place => 
                        place.toObject({getters:true})
                        )
                    })

}

// handling post request
const createPlace = async (req,res,next)=>{

    const {name,description} = req.body;

    //validating the request
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(errorHandler('enter valid data',404))
    }
    // checking if creator exists
    let identifyUser ;
    try{
        identifyUser = await User.findById(req.userData.userId)
    }
    catch(err){
        const error = new httpError('creator id is wrong',400)
        return next(error)
    }
    if(!identifyUser){
        const error = new httpError('creator id is wrong',400)
        return next(error)
    }

    //creating input place model via mongoose
    const createdPlace = new Place( {
        name,
        description,
        creator:req.userData.userId,
        image:"http://localhost:5000/"+req.file.path
    });

    //saving to database
    try{
        const ses = await mongoose.startSession();
        ses.startTransaction();
        await createdPlace.save({session:ses});
        identifyUser.places.push(createdPlace)
        await identifyUser.save({session:ses})
        await ses.commitTransaction()
    }
    catch(err){
        return next(errorHandler('failed to save',500))
    }

    res.status(201);
    res.json({place:createdPlace.toObject({getters:true})})
}

const updatePlace =async (req,res,next)=>{
    const {name,description} = req.body;
    const placeId = req.params.pid;

    //validating request
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(errorHandler('enter valid data',404))

    }
    let place ;
    //finding the place in database
    try{
        place = await Place.findById(placeId)
    }
    catch(err){
        return next(err);
    }
    //updating it
    place.name = name ;
    place.description = description;
    //saving it 
    try{
        await place.save()
    }
    catch(err){
        return next(err);
    }

    res.json({
        message:"place updated",
        place:place.toObject({getters:true})
    })

}

const deletePlace = async (req,res,next)=>{

    const placeId = req.params.pid;

    let place ;
    //finding the place in database
    try{
        place = await Place.findById(placeId).populate('creator')
    }
    catch(err){
        return next(errorHandler('coudnot find the place',404))
    }
    console.log(place)
    if(!place){
        const error = new httpError('failed to find the place',500)
        return next(error)
    }
    // deleting the place
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    }
    catch(err){
        return next(errorHandler('couldnot delete the place',500))
    }
    res.json({message:"place deleted"})
}

module.exports = {
    getPlaceByCreatorId,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
}