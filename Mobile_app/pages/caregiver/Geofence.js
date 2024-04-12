import {View , Text, StyleSheet} from 'react-native'
import MapView from '../../components/Map/MapView'
import {Circle, Marker, Polyline} from 'react-native-maps'

import useUserStore from '../../store/userStore'
import Colors from '../../constants/Colors'
import { useEffect, useState } from 'react'
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import { db } from '../../firebaseConfig'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import Loader from '../../components/Loader'

const GeoFence = () => {
    const currentUser = useUserStore((state) => state.currentUser)
    const sixthSenseUser = useUserStore((state) => state.sixthSenseUser)
    const [loading ,setLoading] = useState(false)
    const [coord, setCoord] = useState( {
        latitude: 0,
        longitude: 0
    })
    const [radius, setRadius] = useState(100)
  
    useEffect(() => {
        const helperFunction  = async() => {
            const user = await getDoc(doc(db,'users', currentUser.uid))
            const data =  user.data()
            if (data.radius && data.coord) {
                setCoord(data.coord)
                setRadius(data.radius)
            }   
        }
     helperFunction()
    }, [currentUser])

    const handleSubmit = async() => {
        setLoading(true)
        await setDoc( doc(db, 'users', currentUser.uid), {radius, coord}, {merge: true})
        setLoading(false)
    }
    
    return (
        <View style={style.container}>  
            <MapView onLongPress={(e) => {
                setCoord(e.nativeEvent.coordinate)
            }}>
                <Marker coordinate={coord}>
                <MaterialCommunityIcons name="map-marker-radius" size={34} color={Colors.three} />
                </Marker>
                <Circle radius={radius} center={coord} strokeWidth={2} strokeColor={Colors.three} fillColor="rgba(144, 210, 109, 0.5)"/>
                <Polyline coordinates={[{latitude: coord?.latitude, longitude: coord?.longitude}, {latitude: sixthSenseUser?.coord.latitude, longitude: sixthSenseUser?.coord.longitude}]}/>
            </MapView>
            <View style={style.geofenceContainer}>
                <Text style={{ color: Colors.two, fontSize: 18, fontWeight: 500}}>Long press in the map to change the position of the Circle Boundary</Text>
                {/* <View >
                <Text>Latitude: {coord.latitude}</Text>
                    <Text>longitude: {coord.longitude}</Text>
                </View> */}
                <View style={{...style.row, gap: 8}}>
                <Text style={{...style.text, fontWeight: 600, color: Colors.three}}>Radius</Text>
                <Text style={style.text}>{radius}/Meter</Text>
                </View>
                <Slider
  style={{width: '100%', height: 40}}
  minimumValue={0}
  maximumValue={10000}
  step={100}
  minimumTrackTintColor={Colors.three}
  maximumTrackTintColor="#000000"
  thumbTintColor={Colors.three}
  value={radius}
  onValueChange={(e) => {
    setRadius(e)
  }}
/>
<CustomButton style={style.button} onPress={handleSubmit}>
{
                        loading ? <Loader style={{width: 250, height: 250}}/> :   <Text style={{color: Colors.one}}>Add</Text>
                    }
</CustomButton>
            </View>
        </View>
    )
}

export default GeoFence

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    geofenceContainer: {
        height: '30%',
        backgroundColor: Colors.one,
        paddingHorizontal: 15,
        paddingVertical:10,
        flexDirection: 'column',
        gap: 4
    },
    text: {
        fontSize: 20,
        color: Colors.two
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: 4
    },
    button: {
            height: 50,
            width: 120,
            color: Colors.four,
            backgroundColor: Colors.three,
            alignItems: 'center',
            justifyContent: 'center',
    
    }
})