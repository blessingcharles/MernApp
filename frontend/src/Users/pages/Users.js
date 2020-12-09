import UsersList from '../Components/UsersList';
import useHttpRequest from '../../Shared/Utils/http-hook'
import { useEffect, useState } from 'react';

const Users = ()=>{

    const [httpRequester , isLoading , error , clearError] = useHttpRequest()
    const [loadedUsers,setLoadedUsers] = useState([])

    const URL = "http://localhost:5000/api/users"


    useEffect(()=>{
        const fetchUsers = async()=>{
            try{           
                const responseData = await httpRequester(URL)
                setLoadedUsers(responseData.users)
                console.log(responseData)
                clearError()
            }
            catch(err){
                throw new Error('fetching users failed')
            }
        }
        fetchUsers()

    },[httpRequester,clearError])
  

    return(
    <>
    {isLoading && <h4 className='center yellow lighten-2'>LOADING USERS ...</h4>}
    {error && <p>{error}</p>}
    {!isLoading && loadedUsers && <UsersList USERS={loadedUsers} /> }
    
    </>)

}

export default Users ;