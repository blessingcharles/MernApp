import React , {useRef ,useState ,useEffect, useMemo}from 'react'

export default function ImageUploader(props) {
    const inputHandlerRef = useRef()
    const [isFileValid,setIsFileValid] = useState(false)
    const [previewFile,setPreviewFile] = useState()
    const [previewUrl , setPreviewUrl] = useState()

    useEffect(()=>{

        if(!previewFile) return

        let fileReader = new FileReader()
        fileReader.onload = ()=>{
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(previewFile)
    }
        ,[previewFile])
    const buttonOnClick = ()=>{
        inputHandlerRef.current.click()
    }
    const fileHandler = (e)=>{
        let fileValidity ;
        let fileData;
        if(e.target.files.length ===1 && e.target.files){
            fileData = e.target.files[0]
            console.log(fileData)
            setPreviewFile(fileData)
            setIsFileValid(true)
            fileValidity = true
        }
        else{
            setIsFileValid(false)
            fileValidity = false
        }
        props.onInput(props.id,fileData,fileValidity)
    }

    const imagedisplayer = ()=>{
        return (<>

            <div class="row valign-wrapper">
                <div class="col s12">
                {!isFileValid&&<img src='' alt='preview' className='circle responsive-image' />}
                {isFileValid&&<img src={previewUrl} 
                                    alt='preview' 
                                    className='circle responsive-image' 
                                    style={{height:"150px",width:"150px"}}/>}
                </div>
            </div>
        </>)
    }


    return (
        <div>
            <input
                id={props.id}
                type='file'
                style={{display:'none'}}
                ref={inputHandlerRef}
                accept='.jpeg,jpg,png'
                onChange={fileHandler}
            ></input>
                {imagedisplayer()}
                <button
                        type="button"
                        onClick={buttonOnClick}
                        className="btn waves-effect waves-light"
                    >PICK IMAGE</button>
                <br></br>
            
        </div>
    )
}
