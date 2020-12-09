import {NavLink} from 'react-router-dom'
import {useContext} from 'react'
import React from 'react'
import AuthContext from '../context/AuthContext'
const Navbar = (props)=>{
    const auth = useContext(AuthContext)
    const userId =auth.userId
    const isLoggedInNav = ()=>{
        if(auth.isLoggedIn){
            return(
                <ul>
                     <li>
                        <NavLink to='/'>Home</NavLink>
                    </li>
                    <li> 
                        <NavLink to={`${userId}/places`}>My Places</NavLink> 
                    </li>
                    <li>
                        <NavLink to='/places/new'>Add places</NavLink>
                    </li>
                    <li>
                        <button onClick={auth.logOut} className='red darken-5'>logout</button>
                    </li>
                </ul>

            )
        }
        else{
            return(
                <ul>
                    <li>
                        <NavLink to='/'>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to='/auth'>Authenticate</NavLink>
                    </li>
                </ul>
            )
        }
    }
    return(
        <nav>
            <div className='nav-wrapper red darken-3' >
                    {isLoggedInNav()}
            </div>
        </nav>)

}

export default Navbar ;