import {useContext} from 'react'
import AuthContext from '../../Shared/context/AuthContext'

const LogOut = ()=>{
    const auth = useContext(AuthContext);
    return auth.logOut()
}

export default LogOut ;