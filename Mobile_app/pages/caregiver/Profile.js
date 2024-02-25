import React, { useCallback, useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import {View, Text, Image, StyleSheet, FlatList }from 'react-native'
import {db} from '../../firebaseConfig'
import useUserStore from "../../store/userStore";
import moment from "moment";

import Loader from '../../components/Loader'
import Colors from "../../constants/Colors";

const Profile = () => {
    const [profile, setProfile] = useState(null)
    const [messages, setMessages] = useState([])
    const currentUser = useUserStore((state) => state.currentUser)
    
    useEffect(() => {   
    async function helper() {      
        const docRef = doc(db, "visionUser", currentUser.visionUser);
        const docSnap = await getDoc(docRef);
        setProfile(docSnap.data())
        onSnapshot(query(collection(db, "visionUser", currentUser.visionUser, "messages"), orderBy('timestamp', 'desc')), ({docs}) => {
          setMessages(docs)
        })
        }
            helper()
    }, [])

    const Card = useCallback(({ item }) => {
        const data = item?.data()

        return (
            <View style={styles.msgCard} >
                <Text style={styles.cardMessage}>{data.message}</Text>
                        <Text style={styles.cardTime}>{moment(data.timestamp * 1000).fromNow()}</Text>
                    </View>
        )
    }, [messages])

    if (profile) {
        return (
            <View style={{flex: 1, paddingVertical: 15, paddingHorizontal: 10}}>
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
                <View style={styles.msgContainer}>
                    <Text style={styles.msgTitle}>All Messages</Text>
                        <FlatList
                            data={messages}
                            keyExtractor={item => item.id}
                            renderItem={Card}
                        />
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
        fontWeight: '400'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    header: {
        fontWeight: 'bold',
    },
    msgContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 10
    },
    msgTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    msgCard: {
        padding: 10,
        backgroundColor: Colors.two,
        borderRadius: 12,
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
    }
})