import  React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { RootSiblingParent } from 'react-native-root-siblings';
import { doc, getDoc } from "firebase/firestore";
import registerNNPushToken, {registerIndieID, unregisterIndieDevice} from 'native-notify';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

import GeoFence from './pages/caregiver/Geofence';
import MapContextProvider from './components/Map/MapContextProvider';
import { db } from './firebaseConfig';
import useUserStore from './store/userStore';
import Main from './pages/Main'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Landing from './pages/auth/Landing';
import Colors from './constants/Colors';
import { calcDistAtoB } from './utils/calcCoordinate';
import  './utils/multiLanguage';
import useNotification from './hooks/use-notification';
import { useTranslation } from 'react-i18next';
import Setting from './pages/caregiver/Setting';


const BACKGROUND_FETCH_TASK = 'monitor-sixthSense';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {

  const sixthSenseUser = await getDoc(doc(db, 'visionUser', 'Wert'))
  const data = sixthSenseUser.data()
  const distance = calcDistAtoB(data.coords.latitude, data.coords.longitude, data.geoFence.latitude, data.geoFence.longitude)

  if (distance > (data.radius / 1000)) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alert ❌",
        body: 'Sixth-Sense User Has crossed the safe region',
      },
      trigger: null,
    });
  }
            
  return BackgroundFetch.BackgroundFetchResult.NewData
})

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1 * 60, // 1 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}


const Stack = createNativeStackNavigator()
const auth = getAuth();

function Auth() {
  return (
      <Stack.Navigator initialRouteName='Landing' screenOptions={{ headerStyle: { backgroundColor: Colors.three }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Landing" component={Landing}  options={{ headerShown: false }}  />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const {t} = useTranslation()

  return (
    <MapContextProvider>
 <Stack.Navigator screenOptions={ { headerShown: false,  headerTitle:t('Sense'),
            headerStyle: {
              backgroundColor: Colors.three,
        },
            animation: 'slide_from_right',
            headerTitleStyle: {
              color: Colors.one
          }}} >
      <Stack.Screen name='Main' component={Main} />
        <Stack.Screen name='GeoFence' component={GeoFence} options={{
          headerShown: 'true',
          
        }}/>
        <Stack.Screen name='Setting' component={Setting} options={{
          headerShown: 'true',
        }} />
    </Stack.Navigator>
    </MapContextProvider>
  )
}

export default function App() {
  registerNNPushToken(19745, 'iV4ceRtjBYygvWfLa5Bu3z');
  registerIndieID('sub-id-1', 19745, 'iV4ceRtjBYygvWfLa5Bu3z');
  useNotification()
  
  const [loading, setLoading] = useState({ loggedIn: false, loaded: false })
  const { loggedIn, loaded } = loading
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {

      if (user) {
        async function helper() {
          await registerBackgroundFetchAsync()
          const currentUser = await getDoc(doc(db, "users", user.uid));
          setCurrentUser({ ...currentUser.data(), uid: user.uid })
        }
        helper()
        setLoading({ loggedIn: true, loaded: true })
      } else {
        setLoading({ loggedIn: false, loaded: true })
      }
  
    })

    return () => {
      unregisterBackgroundFetchAsync()
      unregisterIndieDevice('sub-id-1', 19745, 'iV4ceRtjBYygvWfLa5Bu3z');
    }
  }, [])

  return (
    <RootSiblingParent>
          <NavigationContainer>
      {loggedIn ? <Navigation/>:  <Auth/>}
 
      </NavigationContainer>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
