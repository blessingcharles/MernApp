import {useState,useContext} from 'react'

import Forms from '../../Shared/Components/Forms'
import Inputs from '../../Shared/Components/Input'
import useForms from '../../Shared/Utils/form-hook'
import {VALIDATOR_EMAIL,VALIDATOR_MINLENGTH,VALIDATOR_REQUIRE} from '../../Shared/Utils/Validator'
import AuthContext from '../../Shared/context/AuthContext'
import ImageUploader from '../../Shared/Components/ImageUploader'

const Auth =()=>{
    //Auth context 
    const [errormsg,setError] = useState(null)
    const [isLoading,setLoading] = useState(false)
    const Auth = useContext(AuthContext);

    //setting login mode
    const[isLoginMode,setLoginMode] = useState(true)
    //form state handling
    const [formState,inputHandler,setFormdata] = useForms({
        email:{
            value:"",
            isValid:false
        },
        password:{
            value:"",
            isValid:false
        }
    },false)

    const submitHandler =async (events)=>{
        events.preventDefault()
        console.log(formState.inputs)
        //hitting the login route 
        if(isLoginMode){
            try{
                setLoading(true)
                const result= await fetch('http://localhost:5000/api/users/login',{
                        method:'POST',
                        headers:{
                        'Content-Type':'application/json'
                            },
                        body:JSON.stringify({
                            email:formState.inputs.email.value,
                            password:formState.inputs.password.value
                            })
                    })
                const jsonResult = await result.json()
                console.log(jsonResult)
                if(!result.ok){
                    throw new Error(jsonResult.message)
                }
                setLoading(false)
                console.log(jsonResult)
                Auth.logIn(jsonResult.userId,jsonResult.token)
                }
            catch(err){
                setLoading(false)
                setError(err.message || 'something went wrong ')
                console.log(err)
            }
        }
        //hitting the signup route
        else{
            try{
                setLoading(true)
                const formdata = new FormData()
                formdata.append('name',formState.inputs.name.value)
                formdata.append('email',formState.inputs.email.value)
                formdata.append('password',formState.inputs.password.value)
                formdata.append('image',formState.inputs.image.value)

                const result= await fetch('http://localhost:5000/api/users/signup',{
                    method:'POST',
                    headers:{},
                    body:formdata
                    })
                const jsonResult = await result.json()
                if(!result.ok){
                    throw new Error(jsonResult.message)
                }
                setLoading(false)
                console.log(jsonResult)
                Auth.logIn(jsonResult.userId,jsonResult.token)
                }
            catch(err){
                setLoading(false)
                setError(err.message || 'something went wrong ')
                console.log(err)
            }
        }

    }

    //Switching Register and Login mode handler
    const modeHandler = ()=>{
        setError(null)
        //set form for register mode
        if(isLoginMode){
            setFormdata({
                ...formState.inputs,
                name:{
                    value:"",
                    isValid:false
                },
                image:{
                    value:null,
                    isValid:false
                }
            },false)
        }
        
        //set form for login mode
        else{
            setFormdata({
                ...formState.inputs,
                name:undefined,
                image:undefined
            },formState.inputs["email"].isValid && formState.inputs["password"].isValid)
        }

        //changing the mode
        setLoginMode(prevState => !prevState)
    }

    return(
        <div>
            <h2>{isLoginMode? "SIGNIN PAGE":"REGISTER PAGE"}</h2>
            <p className="green lighten-2">{isLoading && "loading data....."}</p>
            <h5 className="red darken-2">{(errormsg)?errormsg:'' }</h5>
            <Forms onsubmit={submitHandler}>
                {//renders the name input for register mode
                !isLoginMode &&
                    <Inputs 
                        label="name"
                        id='name'
                        type='text'
                        value=''
                        onInput={inputHandler}
                        validators={[VALIDATOR_REQUIRE()]}
                    />
                }
                 {//renders the image uploader for register mode
                !isLoginMode &&
                <ImageUploader
                    onInput={inputHandler}
                    id='image'
                />
                }
                <Inputs 
                    label="email"
                    id='email'
                    type='text'
                    value={formState.email}
                    onInput={inputHandler}
                    validators={[VALIDATOR_EMAIL()]}
                />
                <Inputs 
                    label="password"
                    id='password'
                    type='password'
                    value={formState.password}
                    onInput={inputHandler}
                    validators={[VALIDATOR_MINLENGTH(5)]}
                />
                 
                <button className="btn waves-effect waves-light" type="submit" disabled={!formState.isValid}>{isLoginMode?"LOGIN":"REGISTER"}</button>
            </Forms>
            {!isLoginMode?<p>ALREADY HAVE AN ACCOUNT ?</p>:<p>REGISTER A NEW ACCOUNT</p>}

            <button onClick={modeHandler} className="btn waves-effect waves-light btn-large">{!isLoginMode?"LOGIN":"REGISTER"}</button>

        </div>

    )
}

export default Auth ;