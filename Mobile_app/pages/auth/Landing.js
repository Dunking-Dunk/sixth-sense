import React, {useRef, useEffect} from 'react'
import { Text, View, StyleSheet, Button, ImageBackground } from 'react-native'

import Color from '../../constants/Colors'
import CustomButton from '../../components/CustomButton'
import { useTranslation } from 'react-i18next'


const LandingPage = props => {
    const { t } = useTranslation()
    
    return (
    <View style={styles.view}>
            <ImageBackground source={require('../../assets/images/landingBackground.png')} style={styles.bgImg}>
                <Text style={styles.title}>{t('Sixth Sense')}</Text>
            <View style={styles.buttonView}>
                <CustomButton onPress={() => { props.navigation.navigate('Register') }}  style={styles.button}>
                        <Text style={{ color: Color.one }}>{t('Register')}</Text>
                </CustomButton>
                <CustomButton onPress={() => { props.navigation.navigate('Login') }}  style={styles.button}>
                        <Text style={{ color: Color.one }}>{t('Login')}</Text>
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
        fontSize: 100,
        fontWeight: '600',
        color: Color.two,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        textAlign: 'center'
    },
    button: {
        height: 50,
        width: 120,
        color: Color.one,
        backgroundColor: Color.three,
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