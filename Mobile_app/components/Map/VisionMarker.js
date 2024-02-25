import { Marker } from "react-native-maps";
import { MaterialIcons  } from '@expo/vector-icons';
import Colors from "../../constants/Colors";
import { useRef } from "react";

const VisionMarker = ({userCoords}) => {
    const markerRef = useRef()
 
    return (
        <Marker.Animated
ref={markerRef}
coordinate={{latitude: userCoords.latitude, longitude: userCoords.longitude}}
tracksViewChanges={false}
>
<MaterialIcons name="person-pin-circle" size={40} color={Colors.three} />
</Marker.Animated>
    )
}

export default VisionMarker