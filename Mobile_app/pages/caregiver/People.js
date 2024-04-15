import React, {useCallback, useEffect, useState} from "react";
import { View, StyleSheet, Image, TextInput, ScrollView, Button, ActivityIndicator, TouchableOpacity, Text, FlatList, Alert } from 'react-native'
import {  onSnapshot, collection, addDoc} from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

import { uploadToFirebase } from "../../utils/firebaseStorage";
import useUserStore from '../../store/userStore'
import { db } from "../../firebaseConfig";
import CustomButton from '../../components/CustomButton'
import Colors from "../../constants/Colors";
import Loader from "../../components/Loader";
import { style } from "../../utils/commonStyle";
import { useTranslation } from "react-i18next";

const People = () => {
    const currentUser = useUserStore((state) => state.currentUser)
    const [image, setImage] = useState({ name: '', uri: null })
    const [contacts, setContacts] = useState(null)
    const [loading, setLoading] = useState(false)
    const {t} = useTranslation()
    
    useEffect(() => {
        if (currentUser)
        onSnapshot(collection(db, "visionUser", currentUser?.visionUser, 'peoples'), ({docs}) => {
            setContacts(docs)
        });
    }, [currentUser])

    const pickImage = useCallback(async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
            const { uri } = result.assets[0];
            const fileName = uri.split("/").pop();
            setImage({ uri: result.assets[0].uri, name: fileName } );
        }
    }, [])

    const Item = ({ item }) => {
        const data = item?.data()
      
        return (
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 10}} key={item.id}>
                <Image source={{ uri: data.image }} style={{height: 80, width: 80, borderRadius: 10}} />
                <Text style={{fontSize: 22,fontWeight:'400'}}>{data.name}</Text>
            </View>
        )
    }

    const schema = yup.object({
        name: yup.string().required().min(3)
    })

    const {control, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: {
            name: ''
        },
        resolver: yupResolver(schema)
    })

        
    async function onSubmit(data) {
        if (image.uri !== null) {
            const uploadResp = await uploadToFirebase(image.uri, image.name, () => {
                setLoading(true)
            })

            const ref = collection(db,"visionUser" ,currentUser.visionUser, 'peoples')
            await addDoc(ref, {
                        name: data.name,
                        image: uploadResp.downloadUrl
                })
            
            setLoading(false)
            setImage({uri: null, name: '' })
            reset()
        }else {
            Alert.alert('No Image', 'Please upload a image to submit')
        } 
    }

    return (
        <View style={styles.container} >
            <View style={styles.subContainer}>
                {!image.uri ? (
      <View style={styles.imageContainer}>
      <TouchableOpacity style={styles.imageSubContainer} onPress={pickImage}>
      <Ionicons name="add-circle" size={24} color={Colors.three} />
      </TouchableOpacity>
  </View>
                ) : (
                        <View style={{ position: 'relative', height: 200, width: '100%'}} >
                            <Image source={{ uri: image.uri }} style={styles.image} />
                            <TouchableOpacity onPress={() => setImage({name: '', uri: null})} style={{position: 'absolute', right: 10, zIndex: 2, top: 10}}>
                            <MaterialIcons name="cancel" size={32} color={Colors.three}  />
                            </TouchableOpacity>                      
                            </View>
                ) }
      
       
            <View style={styles.TextInputContainer}>
                <Controller
                control={control}
                rules={{
                    required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (<TextInput placeholder={`${t('Person')} ${t('Name')}`} style={styles.TextInput} onBlur={onBlur} onChangeText={onChange} value={value} placeholderTextColor={Colors.two} autoCorrect keyboardType="default" maxLength={1000} />
    )}
    name="name"
                />
                <Text style={style.errorText}>{errors.name?.message}</Text>
                
            </View>
                <CustomButton style={styles.btn} onPress={handleSubmit(onSubmit)}>
                    {
                        loading ? <Loader style={{ width: 250, height: 250 }} /> : <Text style={{ color: Colors.one }}>{t('Add')}</Text>
                    }
           </CustomButton>
            </View>
            <View style={styles.peoplesContainer}>
                <Text style={{ fontSize: 24, fontWeight: 600, marginBottom: 10, color: Colors.two }}>{t('All')} {t('People')}</Text>
                {contacts ? (
         <FlatList data={contacts}
         keyExtractor={item => item.id}
         renderItem={Item}
         style={styles.mainPeoplesContainer}
     />
                ): <Text>No Contacts found</Text>}
       
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        paddingVertical: 10,
        backgroundColor: Colors.one
    },
    subContainer: {
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    TextInputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TextInput: {
        marginTop: 20,
        width: '85%',
        height: 50,

        color: Colors.four,
        borderBottomWidth: 1,
        borderBottomColor: Colors.four
    },
    btn: {
        width: '90%',
        height: 50,
        backgroundColor: Colors.three,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 100,
        padding: 10
    },
    imageSubContainer: {
        borderColor: Colors.two,
        borderWidth: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderRadius: 10,
    },
    peoplesContainer: {
        padding: 20,
        width: '100%',
        height: 500
    },
    mainPeoplesContainer: {
  
        flex: 1
    }
})


export default People