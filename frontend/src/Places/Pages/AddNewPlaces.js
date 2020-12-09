import useForms from '../../Shared/Utils/form-hook';
import Input from '../../Shared/Components/Input' ;
import {useContext} from 'react'

import useHttpRequest from '../../Shared/Utils/http-hook'
import Forms from '../../Shared/Components/Forms' ;
import{VALIDATOR_REQUIRE} from '../../Shared/Utils/Validator'
import authContext from '../../Shared/context/AuthContext'
import ImageUploader from '../../Shared/Components/ImageUploader'

const NewPlaces = (props)=>{
    const URL = 'http://localhost:5000/api/places'
    const auth = useContext(authContext)
    const [httpRequester ,isLoading ,error , clearError] = useHttpRequest()
    const [formState , inputHandler] = useForms({           
            name:{
                value:"",
                isValid:false
            },
            description:{
                value:"",
                isValid:false
             },
             image:{
                 value:null,
                 isValid:false
             }
       
            }
        ,false)

    const submitHandler =async (event)=>{
        event.preventDefault();
        console.log(formState.inputs)
        let formdata = new FormData()
        formdata.append('name',formState.inputs.name.value)
        formdata.append('description',formState.inputs.description.value)
        formdata.append('creator',auth.userId)
        formdata.append('image',formState.inputs.image.value)

        try{
            console.log('auth token ' + auth.token)
            await httpRequester(URL,'POST',formdata,{'Authorization':'Bearer '+auth.token})
        }
        catch(err){
            throw new Error('failed to create new place')
        }
        clearError()
    }

    return(
            <>
            {error && isLoading && <h3>{error} Loading....</h3>}
            {!isLoading && <Forms onsubmit={submitHandler}>
                <Input 
                    id="name"
                    label="NAME OF THE PLACE" 
                    type="text"
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                />
                <Input 
                    id="description"
                    label="DESCRIPTION " 
                    type="text"
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                />
                <ImageUploader
                    onInput={inputHandler}
                    id='image'
                />
                <br></br>
                <br></br>
                <button disabled={!formState.isValid} className="btn waves-effect waves-light btn-large">SUBMIT</button>
            </Forms>}
            </>
    )
}

export default NewPlaces ;