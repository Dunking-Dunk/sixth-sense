import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import MapViewDirections from 'react-native-maps-directions';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs()

import { FontAwesome6, FontAwesome5 } from '@expo/vector-icons';
import VisionMarker from '../../components/Map/VisionMarker'
import { db } from "../../firebaseConfig";
import MapView from '../../components/Map/MapView'
import { doc, onSnapshot } from "firebase/firestore";
import useUserStore from "../../store/userStore";
import Loader from "../../components/Loader";
import Colors from "../../constants/Colors";
import useMapContext from "../../components/Map/useMapContext";
import { LATITUDE_DELTA, LONGITUDE_DELTA } from "../../components/Map/MapView";


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const GOOGLE_MAPS_APIKEY ='AIzaSyAaCWjzUJ1XziqSuWycOTNorOmfe2swDIc';

const Home = () => {
    const currentUser = useUserStore((state) => state.currentUser)
    const userCoords = useUserStore((state) => state.userCoords)
    const { map, setMap } = useMapContext()

    const [distanceTime, setDistanceTime] = useState({
        distance: null,
        duration: null
    })
    const [navigate,setNavigate] = useState(false)
    const [visionUser, setVisionUser] = useState(null)
 
    useEffect(() => {
        if (currentUser)
 onSnapshot(doc(db, "visionUser", currentUser.visionUser), (doc) => {
    setVisionUser(doc.data())
});
    }, [currentUser])
    
    function visionCenter() {
        if (map)
        map.animateToRegion({
            latitude: visionUser.coords.latitude,
            longitude: visionUser.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
          });
    }

    function navigationCenter() { 
        setNavigate((state) => !state)
    }

    print(distanceTime)

    if (visionUser) {
        return (
            <View style={{flex: 1}}>
                <MapView>
                    <VisionMarker userCoords={visionUser.coords} />
                    {navigate && (
                    <MapViewDirections
                    origin={userCoords}
                    destination={visionUser.coords}
                            apikey={GOOGLE_MAPS_APIKEY}
                            onReady={result => {
                                setDistanceTime({
                                    distance: result.distance,
                                    duration: result.duration
                                })
                                if (map)
                                map.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                      right: (width / 20),
                                      bottom: (height / 20),
                                      left: (width / 20),
                                      top: (height / 20),
                                    }
                                  });
                        
                              }}
                    strokeWidth={3}
                                        strokeColor={Colors.three}
                                        
                  />
                    )}

                </MapView>
                {navigate && (
                    <View style={styles.dataContainer}>
                        <Text style={styles.dataText}>{distanceTime.distance} Km</Text>
                        <Text style={styles.dataText}>{distanceTime.duration} Min</Text>
                        </View>
                )}
                <TouchableOpacity style={styles.visionCenter} onPress={visionCenter} >
                    <FontAwesome6 name="person" size={32} color={Colors.two}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationCenter} onPress={navigationCenter} >
                <FontAwesome5 name="route" size={32} color={Colors.two} />
                </TouchableOpacity>
            </View>
        )
    } else {
        return <Loader/>
    }

}

export default Home

const styles = StyleSheet.create({
    visionCenter: {
        position: 'absolute',
        bottom: 15,
        right: 80,
        zIndex: 2,
    },
    navigationCenter: {
        position: 'absolute',
        bottom: 15,
        right: 130,
        zIndex: 2,
    },
    dataContainer: {
        position: 'absolute',
        top: 30,
        left: '50%',
        backgroundColor: Colors.two,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        gap: 15,
        transform: [{translateX: -90}]
    },
    dataText: {
        color: Colors.one,
        fontSize: 18,
    }
})