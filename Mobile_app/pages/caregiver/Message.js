import React ,{ useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { onSnapshot, query, orderBy, collection, addDoc } from 'firebase/firestore'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { MaterialIcons } from '@expo/vector-icons';

import moment from 'moment'
import { db } from '../../firebaseConfig'
import useUserStore from '../../store/userStore'
import Colors from '../../constants/Colors'
import { yupResolver } from '@hookform/resolvers/yup'
import { style } from '../../utils/commonStyle'

const Message = () => {
    const { t } = useTranslation()
    const currentUser = useUserStore((state) => state.currentUser)
    const [messages, setMessages] = useState([])

    useEffect(() => {   
        async function helper() {      
            onSnapshot(query(collection(db, "visionUser", currentUser.visionUser, "messages"), orderBy('timestamp', 'desc')), ({ docs }) => {
              setMessages(docs)
            })
        }
    
        helper()
    }, [])

    const schema = yup.object({
        message: yup.string().required().min(2)
    })

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            message: ''
        },
        resolver: yupResolver(schema)
    })
    
    const Card = useCallback(({ item }) => {
        const data = item?.data()

        return (
            <View style={{...styles.msgCard, alignItems: data.caregiver ? 'flex-end' : 'flex-start', backgroundColor:  data.caregiver ? Colors.three: Colors.two}} key={item.id} >
                <Text style={styles.cardMessage}>{data.message}</Text>
                        <Text style={{...styles.cardTime, color: data.caregiver && Colors.two}}>{data.caregiver ? moment(data.timestamp).fromNow() :  moment(data.timestamp * 1000).fromNow() }</Text>
                    </View>
        )
    }, [messages])
    const sendMessage = async (data) => {
        await addDoc(collection(db, "visionUser", currentUser.visionUser, "messages"), {
            message: data.message,
            timestamp: Date.now(),
            caregiver: currentUser.uid,
            name: currentUser.username
        })
        reset()
    }


    return (
        <View style={styles.container}>
                <View style={styles.msgContainer}>
            <Text style={styles.msgTitle}>{t('All')} {t('Messages')}</Text>
            {messages ? (
                       <FlatList
                       data={messages}
                        keyExtractor={item => item.id} 
                       renderItem={Card}
                   />
            ) : (
                    <Text style={{color: Colors.two, fontSize: 22}}>No Message found</Text>
                )}
                 
            </View>
            {/* <Text style={style.errorText}>{errors.message?.message}</Text> */}
            <View style={styles.inputContainer}>
                <Controller
                    name='message'
                    control={control}
                    rules={{
                        required: true
                    }}
                    render={({ field: { onBlur, onChange, value } }) => (<TextInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder={t('Message')} style={styles.input} placeholderTextColor={Colors.one} />)}
                />
               
                <TouchableOpacity style={styles.button} onPress={handleSubmit(sendMessage)}>
                <MaterialIcons name="send" size={24} color={Colors.three} />
                </TouchableOpacity>
            </View>
        
        </View>
    )
}

export default Message

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 5
    },
    msgContainer: {
        height: '92%',
        flexDirection: 'column',
        gap: 10
    },
    msgTitle: {
        fontSize: 24,
        fontWeight: '600',
        color:  Colors.two
    },
    msgCard: {
        display: 'flex',
        padding: 10,
        borderRadius: 12,
        backgroundColor: Colors.two,
        marginBottom: 10
    },
    cardMessage: {
        fontSize: 20,
        color: Colors.one,
        marginBottom: 5
    },
    cardTime: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.three
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: '8%',
        backgroundColor: Colors.two,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: Colors.three
    },
    input: {
        width: '90%',
        height: '100%',
        padding: 5,
        color: Colors.three
    },
    button: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    }
})