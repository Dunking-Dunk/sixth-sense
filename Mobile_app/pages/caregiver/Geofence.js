import {View , Text, StyleSheet} from 'react-native'
import MapView from '../../components/Map/MapView'
import {Circle, Marker, Polyline} from 'react-native-maps'
import * as TaskManager from 'expo-task-manager';

import useUserStore from '../../store/userStore'
import Colors from '../../constants/Colors'
import { useCallback, useEffect, useState } from 'react'
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import { db } from '../../firebaseConfig'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import Loader from '../../components/Loader'
import { calcDistAtoB } from '../../utils/calcCoordinate'


export const BACKGROUND_FETCH_TASK = 'monitor-sixthSense';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
        // fetch data here...
        const backendData = "Simulated fetch " + Math.random();
        console.log("myTask() ", backendData);
        setStateFn(backendData);
        return backendData
          ? BackgroundFetch.Result.NewData
          : BackgroundFetch.Result.NoData;
      } catch (err) {
        return BackgroundFetch.Result.Failed;
      }
  });

const GeoFence = () => {
    const currentUser = useUserStore((state) => state.currentUser)
    const sixthSenseUser = useUserStore((state) => state.sixthSenseUser)
    const [loading, setLoading] = useState(false)
    const [coord, setCoord] = useState({
        latitude: 0,
        longitude: 0
    })
    const [radius, setRadius] = useState(100)
    const [distance, setDistance] = useState(0)
    const [inBound, setInBound] = useState(null)
  
    useEffect(() => {
        const helperFunction = async () => {
            const user = await getDoc(doc(db,'users', currentUser.uid))
            const data = user.data()
            if (data.radius && data.coord) {
                setCoord(data.coord)
                setRadius(data.radius)
            }   
        }
     helperFunction()
    }, [currentUser])
   
    useEffect(() => {
        setDistance(calcDistAtoB(coord.latitude, coord.longitude, sixthSenseUser.coords.latitude, sixthSenseUser.coords.longitude))
    
    }, [coord, sixthSenseUser])

    useEffect(() => {
        if (distance > (radius / 1000)) {
            setInBound(false)
        } else {
            setInBound(true)
        }
    } , [distance, radius])

    const handleSubmit = useCallback(async() => {
        setLoading(true)
        await setDoc( doc(db, 'users', currentUser.uid), {radius, coord}, {merge: true})
        setLoading(false)
    }, [currentUser, radius, coord])

    return (
        <View style={style.container}>  
            <MapView onLongPress={(e) => {
                setCoord(e.nativeEvent.coordinate)
            }}>
                <Marker coordinate={coord}>
                <MaterialCommunityIcons name="map-marker-radius" size={34} color={Colors.three} />
                </Marker>
                <Circle radius={radius} center={coord} strokeWidth={2} strokeColor={Colors.three} fillColor="rgba(144, 210, 109, 0.5)"/>
                <Polyline coordinates={[{ latitude: coord?.latitude, longitude: coord?.longitude }, { latitude: sixthSenseUser?.coords.latitude, longitude: sixthSenseUser?.coords.longitude }]} strokeWidth={3} strokeColor={Colors.three} lineDashPattern={[1, 1]} style={{ position: 'relative' }} />
                <Marker coordinate={coord}>
            <Text style={{color: Colors.one, fontWeight: 600}}>{distance.toFixed(2)} km</Text>

                </Marker>
            </MapView>
            <View style={style.geofenceContainer}>
                <View style={{...style.statusContainer, backgroundColor: inBound? Colors.two : 'red'}}>
                    <View style={{paddingVertical: 4, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.one, borderRadius: 50}}>
                    <FontAwesome6 name="person" size={32} color={inBound? Colors.three : 'red'}/>
                    </View>
                    <Text style={{ ...style.text, color: Colors.one}}>{inBound ? 'In the safe zone' : 'Outside the safe zone '}</Text>
                </View>
                <Text style={{ color: Colors.two, fontSize: 18, fontWeight: 600}}>Long press in the map to change the position of the Circle Boundary</Text>
                <View style={{...style.row, gap: 8}}>
                <Text style={{...style.text, fontWeight: 500, color: Colors.three}}>Radius</Text>
                <Text style={style.text}>{radius}/Meter</Text>
                </View>
                <Slider
  style={{width: '100%', height: 30}}
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
            <View style={style.distanceContainer}>
            <Text style={{...style.text, color: Colors.one}}>{distance.toFixed(2)} Km</Text>
            </View>
        </View>
    )
}

export default GeoFence

const style = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    geofenceContainer: {
        height: '32%',
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
            width: '100%',
            color: Colors.four,
            backgroundColor: Colors.three,
            alignItems: 'center',
            justifyContent: 'center',
    },
    distanceContainer: {
        position: 'absolute',
        left: '50%',
        top: 30,
        backgroundColor: Colors.three,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10,
        transform: [{translateX: -50}]
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        gap: 20,
    }
})