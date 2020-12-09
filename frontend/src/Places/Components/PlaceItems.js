import './PlaceItems.css';
import Button from '../../Shared/Components/Button';
import authContext from '../../Shared/context/AuthContext'
import {useContext} from 'react'
import useHttpRequestHandler from '../../Shared/Utils/http-hook'
const PlaceItems = (props)=>{
    const auth = useContext(authContext)
    const [httpRequester,isLoading,error,clearError]= useHttpRequestHandler()
    //displaying individual items 

    async function deleteHandler(){
        try{
            await httpRequester(`http://localhost:5000/api/places/${props.id}`,
            'DELETE',
            null,
            {'Authorization':'Bearer '+auth.token})
            props.onDelete(props.id)
        }
        catch(err){
            throw new Error(err)
        }
        clearError()
    }
    return(<>
    {isLoading&&error &&<h4>{error} LOADING...</h4>}
    {!isLoading&& !error &&
     <div className='blue lighten-4'>
     <li>
         <img src={props.image} alt=""/>
         <h5 className="flow-text">name : {props.name }</h5>
         <h5>description : {props.description}</h5>
         {auth.isLoggedIn &&auth.userId === props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
         {auth.isLoggedIn  &&auth.userId === props.creatorId&& <Button danger onClick={deleteHandler}>DELETE</Button> }
         <br></br>
         <br></br>
     </li>
 </div>}
    </>)

}

export default PlaceItems ;