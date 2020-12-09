import PlaceItems from './PlaceItems'
import Button from '../../Shared/Components/Button'

const PlaceLists = (props)=>{

    //getting places from userplaces page

    if (props.PLACES.length === 0){
        return (<div>
                    <h3>NO PLACES TO DISPLAY</h3>
                    <Button to='/places/new'>ADD-PLACES</Button>
                </div>
             )
    }
    let PLACES = props.PLACES

    //returning places via placeitems components

    return ( <div>
        <ul>{
            PLACES.map(
                (place)=>{
                    return (
                        <PlaceItems 
                            description={place.description} 
                            id={place.id} 
                            image={place.image} 
                            name={place.name}
                            key = {place.id}
                            creatorId = {place.creator}
                            onDelete={props.onDelete}
                        />
                    )
                }
            )   
        }
        </ul>
        <Button to='/places/new'>ADD-PLACES</Button>
    </div>)
}

export default PlaceLists ;