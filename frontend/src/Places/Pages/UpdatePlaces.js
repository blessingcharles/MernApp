import {useParams ,useHistory} from 'react-router-dom';
import { useEffect , useState ,useContext} from 'react';

import Input from '../../Shared/Components/Input';
import Forms from '../../Shared/Components/Forms' ;
import {VALIDATOR_REQUIRE} from '../../Shared/Utils/Validator'
import useForms from '../../Shared/Utils/form-hook' ;
import useHttpRequester from '../../Shared/Utils/http-hook'
import authContext from '../../Shared/context/AuthContext'

const UpdatePlaces = (props)=>{

    //getting page id from params
    const placeId = useParams().placeId
    const auth = useContext(authContext)
    const history = useHistory()
    const [httpRequester , isLoading , error, clearError] = useHttpRequester()
    const [PlaceData,setPlaceData] = useState()
    
    // initial rending before fetching places 
    const [formState,inputHandler,setFormData] = useForms(
        {
            name:{
                value:'',
                isValid:false
            },
            description:{
                value: '',
                isValid:false
            }
        },
        false
    )

    //finding the place
    useEffect(()=>{
        const findPlace = async ()=>{
            try{
                const responsePlace =await httpRequester(`http://localhost:5000/api/places/${placeId}`)
                setPlaceData(responsePlace.place)
                if(PlaceData){
                    setFormData(
                        {
                            name:{
                                value:PlaceData.name,
                                isValid:true
                            },
                            description:{
                                value:PlaceData.description,
                                isValid:true
                            }
                        },
                        true
                        )}
            }
            catch{
                throw new Error('something went wrong...')
            }
        }
        findPlace()
    },[httpRequester,placeId,setFormData])

 

        //form submission handler
    const submitHandler =async (event)=>{
        let URL = `http://localhost:5000/api/places/${placeId}`
        event.preventDefault();
        console.log(formState.inputs)
        try{
            await httpRequester(URL,'PATCH',JSON.stringify({
                name:formState.inputs.name.value,
                description:formState.inputs.description.value
            }),
            {'Content-Type':'application/json',
            'Authorization':'Bearer '+auth.token}
            )
            clearError()
        }
        catch{
            throw new Error('failed to update....')
            }
        history.push('/')
        }
        

    //if place is found returning the update form
    return(
        <wrapper>
        <h2>UPDATE PLACES</h2>

        {isLoading&&<h4>{error}LOADING...</h4>}
        {!isLoading&&!PlaceData &&  <h2>PLACE IS NOT FOUND</h2> }

        {!isLoading&&PlaceData && (    
        <Forms onsubmit={submitHandler}>
            <Input 
                id="name"
                label="description"
                type="text"
                value={PlaceData.name}
                isValid={true}
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
            />
            <Input 
                id="description"
                label="description"
                type="text"
                value={PlaceData.description}
                isValid={true}
                onInput={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
            />
            <button disabled={!formState.isValid}>UPDATE</button>
        </Forms>)}
    
        </wrapper>
    )
}

export default UpdatePlaces ;