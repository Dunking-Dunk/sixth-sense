import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome6,  Entypo} from '@expo/vector-icons';
import { signOut, getAuth } from 'firebase/auth'
import Colors from '../../constants/Colors';
import { SelectList } from 'react-native-dropdown-select-list'
import { useTranslation } from 'react-i18next';

const Setting = ({navigation}) => {
    const auth = getAuth()
    const [selected, setSelected] = useState("");
    const {t, i18n } = useTranslation()
    
  const onLogout = () => {
    signOut(auth)
    }

    const handleLangChange = useCallback(() => {
        if (i18n.language !== selected) {
            i18n.changeLanguage(selected)
        }
    }, [selected])
    
    const data = [
        {key:'en', value:'English'},
        {key:'hi', value:'Hindi'},
    ]


    return (
        <View style={style.container}>
            <TouchableOpacity style={style.item} onPress={() => {
                navigation.navigate('GeoFence')
               }}>
                <Text style={style.text}>{t('Geofence')}</Text>
                <FontAwesome6 name="chevron-right" size={24} color={Colors.three} />
            </TouchableOpacity>
            <SelectList 
                setSelected={(val) => setSelected(val)} 
                onSelect={handleLangChange}
        data={data} 
                save="key"
                boxStyles={{
                    width: '100%',
                    borderWidth: 0,
                    borderRadius: 0,
                }}
                dropdownStyles={{
                    borderWidth: 0,
                }}
                inputStyles={{
                    color: Colors.two,
                    fontSize: 20
                }}
                dropdownTextStyles={{
                    color: Colors.two,
                }}
                closeicon={<Entypo name="cross" size={24} color={Colors.three} />}
                placeholder="Choose Language"
                arrowicon={<FontAwesome6 name="chevron-down" size={24} color={Colors.three} />} />
            
              <TouchableOpacity  style={style.item} onPress={onLogout}>
            <Text style={{...style.text, color: 'red'}}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "column",
        gap: 10,
        paddingVertical: 15
    },
    item: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0,0.2)',
    },
    text: {
        color: Colors.two,
        fontSize: 20
    },
})

export default Setting