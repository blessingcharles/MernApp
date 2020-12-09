import UserItems from './UserItems'

const UsersList = (props)=>{

    if (props.USERS.length === 0){
        return (
            <div>
                <h3>NO USERS FOUND</h3>
            </div>
        )
    }

    return(
    <ul>{
        props.USERS.map(            
            (user)=>{
                console.log(user.id);
                return(
                            <UserItems 
                                key = {user.id}                    
                                id = {user.id} 
                                name = {user.name} 
                                image={user.image} 
                                places = {user.places} 
                            />
                    )   
                }
            )
        }
        </ul>
        )
    }

export default UsersList ;