import { useState ,useEffect ,useRef, useCallback } from "react"

const useHttpRequest = ()=>{
    console.log("http requster")

    const [error , setError] = useState()
    const [isLoading , setisLoading] = useState(false)
    const responseStatuscode= useRef()
    const abortControllers = useRef([])        
    const httpRequester =useCallback( 
        async (url,method='GET',body=null,headers={})=>{
            const httpAbortController = new AbortController();
            abortControllers.current.push(httpAbortController)

            try{
                setisLoading(true)
                const response =await fetch(url,
                                        {
                                            method,
                                            body,
                                            headers,
                                            signal:httpAbortController.signal
                                        })
                responseStatuscode.current = response.status
                if(!response.ok){
                    throw new Error('failed ,to fetch resources')
                }
                const responseData = await response.json()
                setisLoading(false)
                return responseData
            }
            catch(err){
                console.log(responseStatuscode.current)
                setisLoading(true)
                setError('something went wrong ...')
            }

    },[])

    const clearError = useCallback(()=>{
        setError(null)
    },[])

    useEffect(() => {
        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          abortControllers.current.forEach(abortCtrl => abortCtrl.abort());
        };
      }, []);
    return [httpRequester ,isLoading ,error , clearError,setisLoading,responseStatuscode.current]    
}

export default useHttpRequest
