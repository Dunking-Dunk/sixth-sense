import React, {useCallback, useEffect, useState} from "react";
import { View, StyleSheet, Image, TextInput, ScrollView, Button, ActivityIndicator, TouchableOpacity, Text, FlatList } from 'react-native'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { setDoc,doc, updateDoc, arrayUnion, getDoc, onSnapshot} from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import useUserStore from '../../store/userStore'
import { db } from "../../firebaseConfig";
import CustomButton from '../../components/CustomButton'
import Colors from "../../constants/Colors";

const People = () => {
    const currentUser = useUserStore((state) => state.currentUser)
    const [name, setName] = useState('')
    const [image, setImage] = useState({ name: '', uri: null })
    const [contacts, setContacts] = useState(null)

    useEffect(() => {
        onSnapshot(doc(db, "visionPeople", currentUser.visionUser), (doc) => {
            setContacts(doc.data())
        });
    }, [])

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
    
    async function handleSubmit() {
        if (image.uri !== null && name !== '') {
            const uploadResp = await uploadToFirebase(image.uri, image.name, (progress) => console.log(progress))
            const exist = await getDoc(doc(db, 'visionPeople', currentUser.visionUser))     
            const ref = doc(db,"visionPeople" ,currentUser.visionUser)
            if (exist.exists()) {
     await updateDoc(ref, {
                peoples: arrayUnion({
                    name,
                    image: uploadResp.downloadUrl
                })
            })
            } else {
                await setDoc(ref, {
                    peoples: {
                        name,
                        image: uploadResp.downloadUrl
                    }
                })
            }
       
            setImage({uri: null, name: '' })
            setName('')
        }
      
    }

    const Item = ({ item }) => {
        return (
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 10}}>
                <Image source={{ uri: item.image }} style={{height: 80, width: 80, borderRadius: 10}} />
                <Text style={{fontSize: 22,fontWeight:'400'}}>{item.name}</Text>
            </View>
        )
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
                <TextInput placeholder="Person Name" style={styles.TextInput} onChangeText={(text) => setName(text)} value={name} placeholderTextColor={Colors.four} autoCorrect keyboardType="default" maxLength={1000} />
            </View>
                <CustomButton style={styles.btn} onPress={handleSubmit}>
                    <Text style={{color: Colors.one}}>Add</Text>
           </CustomButton>
            </View>
            <View style={styles.peoplesContainer}>
                <Text style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>All Contacts</Text>
                {contacts?.peoples ? (
         <FlatList data={contacts.peoples}
         keyExtractor={item => item.image}
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
        marginTop: 20,
        width: '90%',
        height: 50,
        backgroundColor: Colors.two,
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