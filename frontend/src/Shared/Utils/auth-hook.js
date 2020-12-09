import {useCallback , useEffect , useState} from 'react'
import {useHistory} from 'react-router-dom'
let logoutTimer
let history
export default function useAuth(){
    const [token,setToken] = useState(null);
    const [userId,setUserId] = useState(null)
    const [tokenExpiration , setTokenExpiration ] = useState()
    history = useHistory()
    const logIn = useCallback((uid,token,expirydate)=>{
      setToken(token)
      setUserId(uid)
      const expiryDate =expirydate || new Date(new Date().getTime()+1000*60*60 )
      setTokenExpiration(expiryDate)
      localStorage.setItem('loginData',
                    JSON.stringify(
                      {userId:uid,
                        token:token,
                        expiryDate:expiryDate.toISOString()}
                        ))
    },[])
  
    const logOut = useCallback(()=>{
      setToken(null)
      setTokenExpiration(null)
      setUserId(null)
      localStorage.removeItem('loginData')
    },[])
  //checking for token in localstorage
  
    useEffect(()=>{
  
      const loginData= JSON.parse(localStorage.getItem('loginData'))
  
      if(loginData && 
        loginData.token && 
        new Date(loginData.expiryDate) > new Date() ){
        logIn(loginData.userId,loginData.token,new Date(loginData.expiryDate))
      }
  
    },[logIn])
    // setting a timer to check for expiration of token
  
    useEffect(()=>{
      if(tokenExpiration && token){
        let remainingTime = tokenExpiration.getTime() - new Date().getTime()
        logoutTimer = setTimeout(logOut,remainingTime)
        console.log('in if block '+ remainingTime)
      }
      else{
        console.log('in else block')
        clearTimeout(logoutTimer)
      }
    },[tokenExpiration,logOut,token])

    return [logIn , logOut , userId ,token]
}