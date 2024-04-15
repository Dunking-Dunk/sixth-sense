import React, { useRef } from "react";
import { Text, View, StyleSheet, Button, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-root-toast';
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form";
import LottieView from 'lottie-react-native'

import { style } from "../../utils/commonStyle";
import Color from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import { useTranslation } from "react-i18next";

const Login = () => {
    const animation = useRef(null);
    const auth = getAuth()
    const { t } = useTranslation()

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
})

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: yupResolver(schema)
    })

    const submitHandler = (data) => {
        const {email, password} = data
    signInWithEmailAndPassword(auth, email, password)
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Toast.show(errorMessage, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadowColor: 'red',
            containerStyle: {
                backgroundColor: 'red',
                marginBottom: 50
            },
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
    });
    }

    return (
        <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.textInputContainer}>
        <LottieView
        autoPlay
        ref={animation}
        style={{
            width: 250,
            height: 200,
          }}
        source={require('../../assets/lottie/eye1.json')}
      />
            <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="email"
            render={({field: {onBlur, value, onChange}}) => ( <TextInput style={styles.input} placeholder={t('Email')} onChangeText={onChange} value={value} onBlur={onBlur} placeholderTextColor={Color.four} autoCorrect keyboardType="email-address"/>)}
            />
                <Text style={style.errorText}>{errors.email?.message}</Text>
              <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="password"
            render={({field: {onBlur, value, onChange}}) => (  <TextInput style={styles.input} placeholder="Password" onBlur={onBlur} onChangeText={onChange} value={value} placeholderTextColor={Color.four} secureTextEntry={true}/>)}
            />
                <Text style={style.errorText}>{errors.password?.message}</Text>
                    <CustomButton style={styles.formButtons} title="Login" color={Color.four} onPress={handleSubmit(submitHandler)}>
                    <Text style={{ color: Color.one }}>{t('Login')}</Text>
                </CustomButton>
        </View> 
    </KeyboardAvoidingView>
    )
}

export default Login


const styles = StyleSheet.create({
    form: {
        flex: 1,
        backgroundColor: Color.one,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        color: Color.four,
        fontSize: 100,
        marginBottom: 50,
        fontWeight: '600'
    },
    textInputContainer: {
        width: '90%',
        alignItems: 'center',
        padding: 20,
        height: '80%'
    },
    input: {
        width: '100%',
        height: 50,
        marginBottom: 20,
        borderBottomColor: Color.three,
        borderBottomWidth: 1,
        color: Color.two
    },
    formButtons: {
        marginTop: 20,
        width: '100%',
        backgroundColor: Color.three,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
