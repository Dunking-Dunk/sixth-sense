import React, {useState, useRef} from "react";
import { Text, View, StyleSheet, Button, TextInput, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc,doc} from "firebase/firestore";
import Toast from 'react-native-root-toast';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';

import {db} from '../../firebaseConfig'
import Color from "../../constants/Colors";
import CustomButton from "../../components/CustomButton"

const Register = () => { 
    const animation = useRef(null);
    const [register,setRegister] = useState({
        password: "",
        email: "",
        username: "",
        disabledName: '',
        disabledAge: '',
        image: '',
        secret: ''
    })
    const auth = getAuth()
    const [page,setPage] = useState(0)

    const inputHandler = (value,title) => {
        setRegister((state) => ({...state, [title]: value}))
    }

    const pageHandler = () => {
        if (page === 0) setPage(1)
        else setPage(0)
    }

    const submitHandler = () => {
        const {email, password, username, disabledAge, disabledName, image, secret} = register

        createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                username,
                email,
                visionUser: secret,
              });
            await setDoc(doc(db,"visionUser" ,secret), {
                name: disabledName,
                age: disabledAge,
                image,
                caregiver: user.uid
            })
        }).catch((error) => {
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

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setRegister((state) => ({...state, image: result.assets[0].uri}) );
          const { uri } = result.assets[0];
        const fileName = uri.split("/").pop();
          const uploadResp = await uploadToFirebase(uri, fileName, (v) =>
          console.log(v)
        );
        setRegister((state) => ({...state, image: uploadResp.downloadUrl}))
        }
      };

      const uploadToFirebase = async (uri, name, onProgress) => {
        const fetchResponse = await fetch(uri);
        const theBlob = await fetchResponse.blob();
      
        const imageRef = ref(getStorage(), `images/${name}`);
      
        const uploadTask = uploadBytesResumable(imageRef, theBlob);
      
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress && onProgress(progress);
            },
            (error) => {
              // Handle unsuccessful uploads
              console.log(error);
              reject(error);
            },
            async () => {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                downloadUrl,
                metadata: uploadTask.snapshot.metadata,
              });
            }
          );
        });
      };
      

    return (
        <KeyboardAvoidingView style={styles.form} behavior={'padding'} keyboardVerticalOffset={500}>
        <View style={styles.textInputContainer}>
                       <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 150,
        }}
        source={require('../../assets/lottie/eye.json')}
      />
                {page === 0 ? (
                    <View style={{ width: '100%', alignItems: 'center'}}>
                       <TextInput style={styles.input} placeholder="Name" onChangeText={(text) => inputHandler(text, 'username')} value={register.username} placeholderTextColor={Color.four} autoCorrect keyboardType="default"/>
                           <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => inputHandler(text, 'email')} value={register.email} placeholderTextColor={Color.four} autoCorrect keyboardType="email-address"/>
                                <Text style={styles.label}>Secret Key (comes with the product)</Text>
                                <TextInput style={styles.input} placeholder="Secret Key" onChangeText={(text) => inputHandler(text, 'secret')} value={register.secret} placeholderTextColor={Color.four} autoCorrect keyboardType="default"/>
                           <TextInput style={styles.input} placeholder="Password" onChangeText={(text) => inputHandler(text, 'password')} value={register.password} placeholderTextColor={Color.four} secureTextEntry={true}/>
                        <CustomButton style={styles.formButtons} color={Color.four} onPress={pageHandler}>
                               <Text style={{color: Color.one}}>Next</Text>
                       </CustomButton>
                   </View>
                ) :
                    (
                        <View style={{ width: '100%', height: '100%' }}>
                            <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 5}}>Fill the detail about the Vision User</Text>
                       <TextInput style={styles.input} placeholder="Name" onChangeText={(text) => inputHandler(text, 'disabledName')} value={register.disabledName} placeholderTextColor={Color.four} autoCorrect keyboardType="default"/>
                            <TextInput style={styles.input} placeholder="Age"  onChangeText={(text) => inputHandler(text, 'disabledAge')} value={register.disabledAge} placeholderTextColor={Color.four} autoCorrect keyboardType="number-pad" />
                            <View style={styles.col}>
                                <Text>Profile Image</Text>
                                {register.image ? <Text>Uploaded</Text> :  <Button title="Pick an image" onPress={pickImage} color={Color.four} />}
                            </View>
                            <View style={styles.row}>
                            <CustomButton style={styles.formButtons}  color={Color.four} onPress={pageHandler}>
                               <Text style={{color: Color.one}}>Back</Text>
                                </CustomButton>
                                <CustomButton style={styles.formButtons}  color={Color.four} onPress={submitHandler}>
                               <Text style={{color: Color.one}}>Submit</Text>
                       </CustomButton>
                            </View>
                   </View>
                )
                }
        </View> 
    </KeyboardAvoidingView>
    )
}

export default Register



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
        width: '50%',
        backgroundColor: Color.four,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    col: {
        flexDirection: 'column',
        gap: 5,
        width: '100%',

    },
    row: {
        flexDirection: 'row',
        width: '100%',
        gap: 5
    },
    label: {
        textAlign: 'left', width: '100%',
        fontWeight: 'bold'
    }
})
