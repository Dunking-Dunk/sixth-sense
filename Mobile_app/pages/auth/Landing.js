import React, {useRef, useEffect} from 'react'
import { Text, View, StyleSheet, Button, ImageBackground } from 'react-native'

import Color from '../../constants/Colors'
import CustomButton from '../../components/CustomButton'


const LandingPage = props => {

    return (
    <View style={styles.view}>
            <ImageBackground source={require('../../assets/images/landingBackground.png')} style={styles.bgImg}>
            <Text style={styles.title}>Vision</Text>
            <View style={styles.buttonView}>
                <CustomButton onPress={() => { props.navigation.navigate('Register') }} color={Color.four} style={styles.button}>
                    <Text style={{color: Color.one}}>Register</Text>
                </CustomButton>
                <CustomButton onPress={() => { props.navigation.navigate('Login') }} color={Color.four} style={styles.button}>
                    <Text style={{color: Color.one}}>Login</Text>
                </CustomButton>
                </View>
                </ImageBackground>
        </View>
    )
        

}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.one
    },
    buttonView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }, title: {
        fontSize: 120,
        fontWeight: '600',
        color: Color.one
    },
    button: {
        height: 50,
        width: 120,
        color: Color.one,
        backgroundColor: Color.four,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgImg: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%'
    }
})

export default LandingPage