import {Link} from 'react-router-dom'
import './UserItems.css'

const UserItems = (props)=>{

    return(
      <>
         <h4 class="header">{props.name}</h4>
        <div class="card-panel hoverable blue darken-5">
        <div class="col s12 m7 ">
        <div class="card horizontal hoverable blue lighten-3">
          <div class="card-image">
            <img src={props.image} alt=""/>
          </div>
          <div class="card-stacked">
            <div class="card-content">
    <p>Visit my favourite places</p>
    <p>{props.places.length}</p>

            </div>
            <div class="card-action">
              <Link to ={`/${props.id}/places`} >Read about my journey</Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>           
)
}

export default UserItems ;