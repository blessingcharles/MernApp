import {useCallback , useReducer} from 'react'

const formReducer = (state,action)=>{
    
    let formValid = true ;
    switch(action.type){
        case "INPUT_CHANGE":
            for(const inputId in state.inputs){
                
                //if the name is undefined
                if(!state.inputs[inputId]){
                    continue ;
                }

                if(inputId === action.inputId){
                    formValid = action.isValid && formValid ;
                }
                else{
                    formValid = formValid && state.inputs[inputId].isValid ;
                }
                return{
                        ...state,
                        inputs:{
                            ...state.inputs,
                            [action.inputId]:{value:action.value,isValid:action.isValid}
                        },
                        isValid:formValid
                    }
                
            }
        case "SET_DATA":
            return{
                inputs:action.inputs,
                isValid:action.IsValid
            }
        default:
            return state ;
    }

}

const useForms = (init_inputs,init_IsValid)=>{
    const [formState,dispatch] = useReducer(formReducer,{
        inputs:init_inputs,
        isValid:init_IsValid
    })

    const inputHandler = useCallback((id , value,isValid)=>{
        dispatch({
            type:"INPUT_CHANGE",
            inputId:id,
            value:value,
            isValid:isValid
            })
    },[])

    const setFormData = useCallback((set_inputs,set_IsValid)=>{

        dispatch({type:'SET_DATA',
                inputs:set_inputs,
                isValid:set_IsValid})
    },[])
    return [formState,inputHandler,setFormData] ;
}

export default useForms ;