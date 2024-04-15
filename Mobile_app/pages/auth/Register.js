import React, {useState, useRef} from "react";
import { Text, View, StyleSheet, TextInput, KeyboardAvoidingView,  Image, TouchableOpacity } from 'react-native'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { setDoc,doc, getDoc, GeoPoint} from "firebase/firestore";
import Toast from 'react-native-root-toast';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form";
import { uploadToFirebase } from '../../utils/firebaseStorage'


import { style } from "../../utils/commonStyle";
import Loader from "../../components/Loader";
import {db} from '../../firebaseConfig'
import Color from "../../constants/Colors";
import CustomButton from "../../components/CustomButton"
import { useTranslation } from "react-i18next";

const Register = () => { 
  const animation = useRef(null);
  const [loading, setLoading] = useState(false)
    const [register,setRegister] = useState({
        image: '',
        name: '',
    })
    const auth = getAuth()
    const [page,setPage] = useState(0)
    const {t} = useTranslation()
    
    const schema = yup.object({
      email: yup.string().email().required(),
      password: yup.string().required(),
      username: yup.string().min(4).required(),
      disabledAge: yup.string().required(),
      disabledName: yup.string().min(3).required(),
      secret: yup.string().min(2).required()
  })
  
      const {control, handleSubmit, formState: {errors}} = useForm({
          defaultValues: {
            email: "" ,
            password: "",
         username: "" ,
         disabledAge: "",
         disabledName: "",
         secret: ""
          },
          resolver: yupResolver(schema)
      })
  
    const pageHandler = () => {
        if (page === 0) setPage(1)
        else setPage(0)
    }

    const submitHandler = async(data) => {
        const { email, password, username, disabledAge, disabledName, secret } = data

        const sixthSenseUser = await getDoc(doc(db, "visionUser", secret))

        if (!sixthSenseUser.exists()) {
            Toast.show("Sixth Sense User does not exist. Please type the correct secret linked with the Sixth Sense harware", {
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
                delay: 1,
            })
            
        }

        if (register.image && sixthSenseUser.exists()) {
            const uploadResp = await uploadToFirebase(register.image, register.name, (v) => {
                setLoading(true)
            });

            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    await setDoc(doc(db, "users", user.uid), {
                        username,
                        email,
                        visionUser: secret,
                    });
                    await setDoc(doc(db, "visionUser", secret), {
                        name: disabledName,
                        age: disabledAge,
                        image: uploadResp.downloadUrl,
                        caregiver: user.uid,
                        coords: new GeoPoint(0,0)
                    })
                }).catch((error) => {
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
                        delay: 0,
                    })
                });
            setLoading(false)
            setRegister({ image: '', name: '' })
       
        } else {
            Alert.alert('No Image', 'Please upload a image to submit')
        }
     
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
            setRegister({image: uri, name: fileName})
        }
      };

     
    return (
        <KeyboardAvoidingView style={styles.form} behavior={'padding'} keyboardVerticalOffset={500}>
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
                {page === 0 ? (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="username"
            render={({field: {onBlur, value, onChange}}) => (<TextInput style={styles.input} placeholder={t('Name')} onChangeText={onChange} value={value} onBlur={onBlur} placeholderTextColor={Color.two} autoCorrect keyboardType="default"/>)}
                        />
                        <Text style={style.errorText}>{errors.username?.message}</Text>
              <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="email"
            render={({field: {onBlur, value, onChange}}) => ( <TextInput style={styles.input} placeholder={t('Email')} onChangeText={onChange} value={value} onBlur={onBlur} placeholderTextColor={Color.two} autoCorrect keyboardType="email-address"/>)}
                        />        
                                <Text style={style.errorText}>{errors.email?.message}</Text>
              <Text style={styles.label}>Secret Key (comes with the product)</Text>
              <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="secret"
            render={({field: {onBlur, value, onChange}}) => (  <TextInput style={styles.input} placeholder={t('Secret Key')} onChangeText={onChange} value={value} onBlur={onBlur} placeholderTextColor={Color.two} autoCorrect keyboardType="default"/>)}
                        />
                                <Text style={style.errorText}>{errors.secret?.message}</Text>
            <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="password"
            render={({field: {onBlur, value, onChange}}) => ( <TextInput style={styles.input} placeholder="Password" onChangeText={onChange} value={value} onBlur={onBlur} placeholderTextColor={Color.two} secureTextEntry={true}/>)}
              />           
                                <Text style={style.errorText}>{errors.password?.message}</Text>   
                        <CustomButton style={styles.formButtons} color={Color.four} onPress={pageHandler}>
                               <Text style={{color: Color.one}}>Next</Text>
                       </CustomButton>
                   </View>
                ) :
                    (
                        <View style={{ width: '100%', height: '100%' }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 5, color: Color.three }}>Fill the detail about the Sixth-Sense User</Text>
                            <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="disabledName"
            render={({field: {onBlur, value, onChange}}) => (  <TextInput style={styles.input} placeholder={t('Name')} onChangeText={onChange} onBlur={onBlur} value={value} placeholderTextColor={Color.two} autoCorrect keyboardType="default"/>)}
                            />          
                                    <Text style={style.errorText}>{errors.disabledName?.message}</Text>
                            <Controller
             control={control}
             rules={{
                 required: true
             }}
            name="disabledAge"
            render={({field: {onBlur, value, onChange}}) => (<TextInput style={styles.input} placeholder={t('Age')} onBlur={onBlur}  onChangeText={onChange} value={value} placeholderTextColor={Color.two} autoCorrect keyboardType="number-pad"/>)}
              />                  
                               <Text style={style.errorText}>{errors.disabledAge?.message}</Text>     
                            <View style={styles.col}>
                                <Text style={{ color: Color.two }}>{t('Profile')} {t('Image')}</Text>
                                {!register.image ? (
      <View style={styles.imageContainer}>
      <TouchableOpacity style={styles.imageSubContainer} onPress={pickImage}>
      <Ionicons name="add-circle" size={24} color={Color.three} />
      </TouchableOpacity>
  </View>
                ) : (
                        <View style={{ position: 'relative', height: 200, width: '100%'}} >
                            <Image source={{ uri: register.image}} style={styles.image} />
                            <TouchableOpacity onPress={() => setRegister({image: '', name: ''})} style={{position: 'absolute', right: 10, zIndex: 2, top: 10}}>
                            <MaterialIcons name="cancel" size={32} color={Color.three}  />
                            </TouchableOpacity>                      
                            </View>
                ) }
                            </View>
                            <View style={styles.row}>
                            <CustomButton style={styles.formButtons}  color={Color.three} onPress={pageHandler}>
                                    <Text style={{ color: Color.one }}>{t('Back')}</Text>
                                </CustomButton>
                                <CustomButton style={styles.formButtons}  color={Color.three} onPress={handleSubmit(submitHandler)}>
                                {
                                        loading ? <Loader style={{ width: 250, height: 250 }} /> : <Text style={{ color: Color.one }} >{t('Register')}</Text>
                    }
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
        height: '100%'
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
        width: '50%',
        backgroundColor: Color.three,
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
        fontWeight: 'bold',
        color: Color.three
    },
    imageContainer: {
        width: '100%',
        height: 100,
        padding: 10
    },
    imageSubContainer: {
        borderColor: Color.two,
        borderWidth: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
})
