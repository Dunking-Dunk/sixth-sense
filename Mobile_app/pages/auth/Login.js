import React, { useState } from "react";
import { Text, View, StyleSheet, Button, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-root-toast';

import Color from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";

const Login = () => {
    const [login,setLogin] = useState({
        password: "",
        email: ""
    })
    const auth = getAuth()

    const inputHandler = (value,title) => {
        setLogin((state) => ({...state, [title]: value}))
    }

    const submitHandler = () => {
        const {email, password} = login
    signInWithEmailAndPassword(auth, email, password)
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Toast.show(errorMessage, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,})
    });
    }

    return (
        <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.textInputContainer}>
            <Text style={styles.name}>Vision</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => inputHandler(text, 'email')} value={login.email} placeholderTextColor={Color.four} autoCorrect keyboardType="email-address"/>
            <TextInput style={styles.input} placeholder="Password" onChangeText={(text) => inputHandler(text, 'password')} value={login.password} placeholderTextColor={Color.four} secureTextEntry={true}/>
                    <CustomButton style={styles.formButtons} title="Login" color={Color.four} onPress={submitHandler}>
                        <Text style={{color: Color.one}}>Login</Text>
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
        borderBottomColor: Color.four,
        borderBottomWidth: 1,
        color: Color.four
    },
    formButtons: {
        marginTop: 20,
        width: '100%',
        backgroundColor: Color.four,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
