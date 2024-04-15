import React from 'react'
import { HeaderButton } from 'react-navigation-header-buttons'
import { Ionicons, Feather } from '@expo/vector-icons'
import {Platform} from 'react-native'

import Color from '../constants/Colors'

const CustomHeaderButton = props => {
    return <HeaderButton {...props} IconComponent={Feather} iconSize={23} color={Color.one}/>
}

export default CustomHeaderButton