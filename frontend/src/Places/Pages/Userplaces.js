import PlaceLists from '../Components/PlaceLists' ;
import { useState, useEffect} from 'react'

import useHttpRequest from '../../Shared/Utils/http-hook';
import { useParams } from 'react-router-dom';

const UserPlaces =(props)=> {
    const [Places,setPlaces] = useState()
    const userId = useParams().userid
    console.log(userId)
    const URL = `http://localhost:5000/api/places/user/${userId}`
    const [httpRequester,isLoading,error,clearError,setIsLoading,responseStatusCode] = useHttpRequest()

    useEffect(()=>{
        const fetchPlaces =async ()=>{
            try{            const responseData =await httpRequester(URL)
                setPlaces(responseData.places)
                clearError()}
            catch(err){
                setIsLoading(true)
                }
            }  
        fetchPlaces()
    },[httpRequester,URL,clearError])

    const onDeleteHandler = (deletePlaceId)=>{
        setPlaces(prevPlaces =>{
            prevPlaces.filter(place => {
                return place.id !== deletePlaceId
            })
        })
    }
    if(responseStatusCode === 404){
        return <h3>NO PLACES FOUND </h3>
    }
    return (
    <>
        {isLoading && error && <h3>{error} something went wrong</h3>}
        {!isLoading && Places && <PlaceLists PLACES={Places} onDelete={onDeleteHandler} />}
    </>)

}

export default UserPlaces ;