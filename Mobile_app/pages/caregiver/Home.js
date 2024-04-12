import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import MapViewDirections from 'react-native-maps-directions';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs()

import { FontAwesome5 } from '@expo/vector-icons';
import { db } from "../../firebaseConfig";
import MapView from '../../components/Map/MapView'
import { doc, onSnapshot } from "firebase/firestore";
import useUserStore from "../../store/userStore";
import Loader from "../../components/Loader";
import Colors from "../../constants/Colors";
import useMapContext from "../../components/Map/useMapContext";

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY ='AIzaSyAaCWjzUJ1XziqSuWycOTNorOmfe2swDIc';

const Home = ({navigation}) => {
    const currentUser = useUserStore((state) => state.currentUser)
    const userCoords = useUserStore((state) => state.userCoords)
    const { map, setMap } = useMapContext()

    const [distanceTime, setDistanceTime] = useState({
        distance: null,
        duration: null
    })
    const [direction,setDirection] = useState(false)
    const visionUser = useUserStore((state) => state.sixthSenseUser)
 
    function navigationCenter() { 
        setDirection((state) => !state)
    }

    print(distanceTime)

    if (visionUser) {
        return (
            <View style={{flex: 1}}>
                <MapView>
                    {/* <VisionMarker userCoords={visionUser.coords} /> */}
                    {direction && (
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
                {direction && (
                    <View style={styles.dataContainer}>
                        <Text style={styles.dataText}>{distanceTime.distance?.toFixed(2)} Km</Text>
                        <Text style={styles.dataText}>{distanceTime.duration?.toFixed(2)} Min</Text>
                        </View>
                )}
                <TouchableOpacity style={styles.navigationCenter} onPress={navigationCenter} >
                <FontAwesome5 name="route" size={32} color={Colors.three} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.geoFence} onPress={() => {
                    navigation.navigate('GeoFence')
                }} >
                <FontAwesome5 name="route" size={32} color={Colors.three} />
                </TouchableOpacity>
            </View>
        )
    } else {
        return <Loader/>
    }

}

export default Home

const styles = StyleSheet.create({
    navigationCenter: {
        position: 'absolute',
        bottom: 15,
        right: 130,
        zIndex: 2,
    },
    geoFence: {
        position: 'absolute',
        bottom: 15,
        left: 20
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