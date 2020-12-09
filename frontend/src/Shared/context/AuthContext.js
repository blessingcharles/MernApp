import {createContext} from 'react'

const authContext = createContext({
            isLoggedIn:false,
            token:null,
            userId:null,
            logIn:()=>{},
            logOut: ()=>{}
        
        })

export default authContext ;
