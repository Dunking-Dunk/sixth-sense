import React, {useState, useRef, useEffect, useCallback} from 'react';
import MapView, {
    Marker,
    Circle,
    AnimatedRegion,
    PROVIDER_GOOGLE,
  } from "react-native-maps";
  import { FontAwesome, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, View, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { doc, onSnapshot } from "firebase/firestore";

import { db } from '../../firebaseConfig';
import VisionMarker from '../../components/Map/VisionMarker'
import Colors from '../../constants/Colors';
import useLocation from '../../hooks/use-location';
import useMapContext from './useMapContext';
import useUserStore from '../../store/userStore'; 


const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0122;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Map({ children, onPress, onLongPress }) {
  const {map, setMap} = useMapContext()
  const markerRef = useRef();
  const currentUser = useUserStore((state) => state.currentUser)
  const userCoords =  useUserStore((state) => state.userCoords)
  const setUserCoords =  useUserStore((state) => state.setUserCoords)
  const sixthSenseUser = useUserStore((state) => state.sixthSenseUser)
  const setSixthSenseUser = useUserStore((state) => state.setSixthSenseUser)
    const location = new useLocation()

    useEffect(() => {
      if (currentUser)
onSnapshot(doc(db, "visionUser", currentUser.visionUser), (doc) => {
  setSixthSenseUser(doc.data())
});
  }, [currentUser])

  useEffect(() => {
    location.getUserLocation(setUserCoords)

    }, [setUserCoords])
  
  const onCenter = useCallback(() => {
      map.animateToRegion({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }, [map]);

    const visionCenter = useCallback(() => {
      if (map)
      map.animateToRegion({
          latitude: sixthSenseUser.coords.latitude,
          longitude: sixthSenseUser.coords.longitude,
                  latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
        });
  },[map])

  if (userCoords && sixthSenseUser) {
    return (
  
<View style={styles.container}>
   
   <MapView style={styles.map}  
    ref={(e) => {
      setMap(e)
    }}
   initialRegion={{
latitude: userCoords?.latitude,
longitude: userCoords?.longitude,
latitudeDelta: LATITUDE_DELTA,
longitudeDelta: LONGITUDE_DELTA,
}} 
provider={PROVIDER_GOOGLE}
onPress={onPress}
onLongPress={onLongPress}
        >
        
<VisionMarker userCoords={sixthSenseUser?.coords} />
     {children}
     {userCoords && (
<Marker.Animated
ref={markerRef}
coordinate={userCoords}
tracksViewChanges={false}
>
<FontAwesome name="circle-o" size={18}/>
</Marker.Animated>
     )}
</MapView>
<TouchableOpacity style={styles.visionCenter} onPress={visionCenter} >
                    <FontAwesome6 name="person" size={32} color={Colors.three}/>
                </TouchableOpacity>
<TouchableOpacity
     style={{
       position: "absolute",
       bottom: 10,
       right: 20,
       zIndex: 2,
     }}
     onPress={onCenter}
   >
     <MaterialIcons name="gps-fixed" size={34} color={Colors.three} />
   </TouchableOpacity>
   </View>  
  );
  }
  }
  
  const styles = StyleSheet.create({
    container: {
 flex: 1
    },
    map: {
        flex: 1,
      width: '100%',
      height: '100%',
    },
    visionCenter: {
      position: 'absolute',
      bottom: 15,
      right: 80,
      zIndex: 2,
  },
  });