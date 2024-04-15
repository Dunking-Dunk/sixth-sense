import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialIcons,  MaterialCommunityIcons  } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HomeScreen from "./caregiver/Home";
import PeopleScreen from './caregiver/People'
import ProfileScreen from "./caregiver/Profile";
import MessageScreen from './caregiver/Message'
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";
import CustomHeaderButton from '../components/headerButton';

const Tab = createBottomTabNavigator();

const Main = ({navigation}) => {
  const { t } = useTranslation()

  return (
    <Tab.Navigator screenOptions={{
      headerShown: true, tabBarActiveTintColor: Colors.three,
      headerTitle:t('Sense'),
      headerStyle: {
        backgroundColor: Colors.three
      },
      headerTitleStyle: {
        color: Colors.one
      },
      headerRight: () => <HeaderButtons  HeaderButtonComponent={CustomHeaderButton}>
        <Item title="logout" iconName='menu' onPress={() => {
          navigation.navigate('Setting')
        }}/>
  </HeaderButtons >
    }} >
        <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarLabel: t('Home'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          )
        }} />
                 <Tab.Screen name="People" component={PeopleScreen }
        options={{
            tabBarLabel: t('People'),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="face-6" size={size} color={color} />
          ),}}
      />
          <Tab.Screen name="Message" component={MessageScreen}
        options={{
            tabBarLabel: t('Message'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="android-messages" size={size} color={color} />
          )}}
        />

        <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
            tabBarLabel: t('Profile'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          )}}
        />

      </Tab.Navigator> 
    )
}

export default Main
