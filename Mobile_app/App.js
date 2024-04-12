import  React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import { RootSiblingParent } from 'react-native-root-siblings';
import { doc, getDoc } from "firebase/firestore";
import registerNNPushToken, {registerIndieID, unregisterIndieDevice} from 'native-notify';
import * as Localization from 'expo-localization'
import * as BackgroundFetch from 'expo-background-fetch';

import { BACKGROUND_FETCH_TASK } from './pages/caregiver/Geofence';
import GeoFence from './pages/caregiver/Geofence';
import MapContextProvider from './components/Map/MapContextProvider';
import { db } from './firebaseConfig';
import useUserStore from './store/userStore';
import CustomHeaderButton from './components/headerButton';
import Main from './pages/Main'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Landing from './pages/auth/Landing';
import Colors from './constants/Colors';
import { translations } from './utils/multiLanguage';


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
  const onLogout = () => {
    signOut(auth)
  }

  return (
    <MapContextProvider>
 <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: Colors.two }, headerTintColor: '#fff',  headerTitle: "Sense",
    headerTitleStyle: {
      marginLeft: 50,
      color: Colors.one
      },
      headerRight: () => <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
      <Item title="logout" iconName='log-out' onPress={onLogout}/>
  </HeaderButtons >
    }} >
      <Stack.Screen name='Main' component={Main} />
      <Stack.Screen name='GeoFence' component={GeoFence}/>
    </Stack.Navigator>
    </MapContextProvider>
  )
}

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function App() {
  registerNNPushToken(19745, 'iV4ceRtjBYygvWfLa5Bu3z');
  registerIndieID('sub-id-1', 19745, 'iV4ceRtjBYygvWfLa5Bu3z');

  const [loading, setLoading] = useState({ loggedIn: false, loaded: false })
  const { loggedIn, loaded } = loading
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)
  let [local, setLocale] = useState(Localization.getLocales())
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        async function helper() {
          await registerBackgroundFetchAsync()
          const currentUser = await getDoc(doc(db, "users", user.uid));
          setCurrentUser({...currentUser.data(), uid: user.uid})
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
