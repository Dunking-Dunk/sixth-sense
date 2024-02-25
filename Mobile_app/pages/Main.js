import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { FontAwesome, MaterialIcons  } from '@expo/vector-icons';
import MapContextProvider from '../components/Map/MapContextProvider';

import HomeScreen from "./caregiver/Home";
import PeopleScreen from './caregiver/People'
import ProfileScreen from "./caregiver/Profile";
import Colors from "../constants/Colors";

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
<MapContextProvider>
<Tab.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: Colors.two}} >
        
        <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          )
        }} />
                 <Tab.Screen name="People" component={PeopleScreen }
        options={{
            tabBarLabel: 'People',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="face-6" size={size} color={color} />
          ),}}
        />
        <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
            tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),}}
        />

      </Tab.Navigator> 
</MapContextProvider>  

    )
}

export default Main
