import React, {useState, useRef, useEffect} from 'react';
import MapView, {
    Marker,
    Circle,
    AnimatedRegion,
    PROVIDER_GOOGLE,
  } from "react-native-maps";
  import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Dimensions, TouchableOpacity, Platform } from 'react-native';

import Colors from '../../constants/Colors';
import useLocation from '../../hooks/use-location';
import useMapContext from './useMapContext';
import useUserStore from '../../store/userStore';

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0122;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function Map({ children }) {
  const {map, setMap} = useMapContext()
  const markerRef = useRef();
  const userCoords =  useUserStore((state) => state.userCoords)
  const setUserCoords =  useUserStore((state) => state.setUserCoords)
    const location = new useLocation()
  
  useEffect(() => {
    location.getUserLocation(setUserCoords)
      if (userCoords && map)
      map.animateToRegion({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }, [setUserCoords])


    const onCenter = () => {
      map.animateToRegion({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    };

  if (userCoords) {
    return (
  
<View style={styles.container}>
   
   <MapView style={styles.map}  
    ref={setMap}
   initialRegion={{
latitude: 37.78825,
longitude: -122.4324,
latitudeDelta: LATITUDE_DELTA,
longitudeDelta: LONGITUDE_DELTA,
}} 
provider={PROVIDER_GOOGLE}
>
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
<TouchableOpacity
     style={{
       position: "absolute",
       bottom: 10,
       right: 20,
       zIndex: 2,
     }}
     onPress={onCenter}
   >
     <MaterialIcons name="gps-fixed" size={34} color={Colors.two} />
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
  });