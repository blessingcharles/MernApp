const Forms = (props)=>{
    
    return(
    <div className="container ">
        <div class="card-panel hoverable blue lighten-4">
            <div className="row ">
                <form className="col s12 " onSubmit={props.onsubmit}>
                    {props.children}
                </form>
            </div>
        </div>
    </div>)

}

export default Forms ;