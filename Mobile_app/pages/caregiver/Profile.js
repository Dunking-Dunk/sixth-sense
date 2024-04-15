import React, { useCallback, useEffect, useState } from "react";
import {addDoc, collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import {View, Text, Image, StyleSheet, TextInput, FlatList}from 'react-native'
import {db} from '../../firebaseConfig'
import useUserStore from "../../store/userStore";
import * as yup from 'yup'

import { style } from "../../utils/commonStyle";
import Loader from '../../components/Loader'
import Colors from "../../constants/Colors";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const Profile = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [contacts, setContacts] = useState(null)
    const {t} = useTranslation()
    const currentUser = useUserStore((state) => state.currentUser)
    
    useEffect(() => {   
    async function helper() {      
        const docRef = doc(db, "visionUser", currentUser.visionUser);
        const docSnap = await getDoc(docRef);
        setProfile(docSnap.data())

        onSnapshot(collection(db, "visionUser", currentUser.visionUser, "contacts"), ({ docs }) => {
                setContacts(docs)
        })
        }
            helper()
    }, [currentUser])


    const schema = yup.object({
        name: yup.string().required().min(2),
        phoneNumber: yup.string().required().min(10).max(10)
    })

    const {handleSubmit, control, formState: {errors}, reset } = useForm({
        defaultValues: {
            name: '',
            phoneNumber:''
        }, 
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        await addDoc(collection(db, "visionUser", currentUser.visionUser, 'contacts'), {
            name: data.name,
            phoneNumber: data.phoneNumber
        })
        setLoading(false)
        reset()
    }

    const Item = ({ item }) => {
        const data = item?.data()
      
        return (
            <View style={{width: '100%', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 10, backgroundColor: Colors.two, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 5}} key={item.id}>
                <Text style={{ fontSize: 22, fontWeight: '400', color: Colors.three }}>{data.name}</Text>
                <Text style={{fontSize: 16,fontWeight:'400',color: Colors.one}}>{data.phoneNumber}</Text>
            </View>
        )
    }

    if (profile) {
        return (
            <View style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10 }}>
                <View style={styles.profile}>
                    <Image source={{ uri: profile.image }} style={styles.profileImage} />
                    <View style={styles.profileDetail}>
                        <Text style={styles.name}>{profile.name}</Text>
                        <View style={styles.row}>
                            <Text style={styles.header}>Age:</Text>
                        <Text style={styles.text}>{profile.age}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.contact}>
                    <View style={styles.inputContainer}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (<TextInput placeholder="Name" style={styles.input} value={value} onBlur={onBlur} onChangeText={onChange} />)}
                        />
                        <Text style={style.errorText}>{errors.name?.message}</Text>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (  <TextInput placeholder="Phone Number" onChangeText={onChange} onBlur={onBlur} value={value} style={styles.input} keyboardType="phone-pad"/>)}
                        />
                       <Text style={style.errorText}>{errors.phoneNumber?.message}</Text>
                        <CustomButton style={styles.button} onPress={handleSubmit(onSubmit)}>
                            {loading ? <Loader/> :  <Text style={{color: Colors.one}}>Add</Text>}
                        </CustomButton>
                    </View>
                    <View style={styles.allContact}>
                        <Text style={{ ...styles.header, fontSize: 22, color: Colors.two }}>{t('All')} {t('Contact')}</Text>
                        <FlatList
                            data={contacts}
         keyExtractor={item => item.id}
                            renderItem={Item}
                            style={styles.allContactList}
                        />               
                    </View>                
                </View>
            </View>
        )  
    }else return <Loader/>

}

export default Profile

const styles = StyleSheet.create({
    profile: {
        backgroundColor: Colors.two,
        borderRadius: 20,
        flexDirection: 'row',
        marginBottom: 15
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        margin: 10
    },
    profileDetail: {
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'column',
        gap: 5,
        justifyContent: 'center',
    },
    name: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.one
    }, 
    text: {
        fontSize: 18,
        fontWeight: '400',
        color: Colors.three
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    header: {
        fontWeight: 'bold',
        color: Colors.three
    },
    contact: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'column',
        display: 'flex',
        paddingHorizontal: 10
    },
    input: {
        width: '100%',
        height: 50,
        borderBottomColor: Colors.three,
        borderBottomWidth: 1,
        color: Colors.two
    },
    button: {
        backgroundColor: Colors.three,
        paddingVertical: 15,
        display: 'flex',
        alignItems: 'center',
    },
    allContact: {
        paddingVertical: 10,
    },
    allContactList: {
       height: 350
    }
})