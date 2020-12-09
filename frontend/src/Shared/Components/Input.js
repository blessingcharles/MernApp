import {useReducer} from 'react' ;
import {useEffect} from 'react';
import {validate} from '../../Shared/Utils/Validator';

const inputReducer = (state,action)=>{        
    switch(action.type){
        case "CHANGE":
            return(
                {...state,
                value:action.value,
                isValid:validate(action.value,action.validators)
                }) ;

        case "BLUR":
            return(
                {
                    ...state,
                    isTouched:true
                }
            );
        default:
            return state ;

    }
}

const Input = props =>{

    const [inputState,dispatch] = useReducer(
                                            inputReducer,{
                                                value:props.value || "",
                                                isValid:props.isValid || false,
                                                isTouched:false
                                                }
                                            );

    const {id , onInput} = props ;
    const {value,isValid} = inputState;

    useEffect(
        ()=>{
            onInput(id,value,isValid)
        },
        [id,onInput,value,isValid])

    const inputHandler = (e)=>{
        dispatch({type:"CHANGE",value:e.target.value,validators:props.validators});
    }

    const inputBlurEvent = ()=>{
        dispatch({type:"BLUR",isTouched:true})
    }
    const element = (props.element === 'text-area')?
                        (   <textarea 
                                id={props.id} 
                                rows={`${props.id} || 3`}
                                onChange={inputHandler} 
                                value={inputState.value}
                                onBlur={inputBlurEvent}
                            />   ):
                        ( <input 
                                id={props.id} 
                                placeholder={props.placeholeder} 
                                type={props.type}
                                onChange={inputHandler}
                                value={inputState.value}
                                onBlur={inputBlurEvent}
                                />    
                        ) ;

    return (
        <div>

            <label htmlFor={props.id}>{props.label}</label>
            {element}
            { /*showing warnings  */}
            {inputState.isTouched && 
             !inputState.isValid && 
             <p className='red-text darken-3'>
                  *Please enter a valid {props.label}
             </p>}

        </div>
        
    )
}

export default Input ;