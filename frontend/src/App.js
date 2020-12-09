import './App.css';
import {BrowserRouter , Route,Redirect,Switch} from 'react-router-dom'

import useAuth from './Shared/Utils/auth-hook'
import Users from './Users/pages/Users'
import NewPlaces from './Places/Pages/AddNewPlaces'
import Navbar from './Shared/Components/Navbar';
import Footer from './Shared/Components/Footer' ;
import UserPlaces from './Places/Pages/Userplaces' ;
import  UpdatePlaces from './Places/Pages/UpdatePlaces' ;
import Auth from './Users/pages/Auth' ;
import AuthContext from './Shared/context/AuthContext'


const App = ()=> {

  const [logIn , logOut , userId , token] = useAuth()
 
  const Routes = ()=>{
    if(token){
      return (
        <Switch>
          <Route exact path='/'>
            <Users />
          </Route>
          <Route exact path='/places/new'>
            <NewPlaces />
          </Route>

          <Route path='/:userid/places' exact>
            <UserPlaces />
          </Route>
          <Route path="/places/:placeId" exact>
            <UpdatePlaces />
          </Route>
          <Redirect to= '/'/>

      </Switch>

      )
    }
    else{
      return(
        <Switch>
          <Route exact path='/'>
            <Users />
          </Route>
          <Route exact path='/auth'>
            <Auth />
          </Route>
          <Route path='/:userid/places' exact>
              <UserPlaces />
            </Route>
          <Redirect to= '/auth'/>
        </Switch>
      )
    }
  }
  return (
    <div className="App">
      <AuthContext.Provider value={{
        isLoggedIn:!!token,
        token:token,
        userId:userId,
        logIn:logIn,
        logOut:logOut
      }}>

        <BrowserRouter>
          <Navbar />
         {Routes()}
        </BrowserRouter>
        <br></br>
        <br></br>
        <br></br>
        <Footer />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
