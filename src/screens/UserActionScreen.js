import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCartData } from '../screens/CartUtil';
import { isLoggedIn, logout } from '../api/auth';
import SmartLoader from './SmartLoader';

import VectorImage from 'react-native-vector-image';
//import IconCompare from '../images/compare.svg';

function UserActionScreen({ route, navigation }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const [islogin, setIslogin] = React.useState(false);

    const checkLogin = async () => {
        setIsLoading(true);
        const is_login = await isLoggedIn();
        //console.log('is_login', is_login);
        setIslogin(is_login);
        setIsLoading(false);
    }

    // React.useEffect(() => {
    //     checkLogin();
    // }, []);
    useFocusEffect(
        React.useCallback(() => {
          // Do something when the screen is focused
          checkLogin();
          return () => {
            // Do something when the screen is unfocused
            // Useful for cleanup functions
          };
        }, [])
      );

    return (
        <View style={{ flex: 1, paddingTop: 15, justifyContent: 'space-between' }}>
            <SmartLoader isLoading={isLoading} />
            <View>
                <View style={{ padding: 17, borderColor: '#D5D8DC', borderBottomWidth: 1 }}>
                    <TouchableOpacity
                        style={{ alignSelf: 'flex-start' }}
                        onPress={() => {
                            if (islogin) {
                                navigation.navigate('account', { screen: 'Account' });
                            } else {
                                navigation.navigate('login', { screen: 'Login', params: { navigatePage: 'account' } });
                            }
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../images/user_login.png')} />
                            <Text style={[style.baseText,{ color:'#282c3f', paddingLeft: 15, fontSize: 17, lineHeight:23, fontWeight:'400' }]}>{islogin ? 'My Account' : 'Login/Signup'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 17, borderColor: '#D5D8DC', borderBottomWidth: 1 }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-start' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <IconCompare width={30} height={30} fill="#000000" /> */}
                            <VectorImage source={require('../images/compare.svg')} style={{width:23, height:23, tintColor:'#282c3f'}} />
                            <Text style={[style.baseText,{ color:'#282c3f', paddingLeft: 15, fontSize: 17, lineHeight:23, fontWeight:'400' }]}>Compare</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ padding: 17 }}>
                <TouchableOpacity
                    style={[{
                        alignItems: 'center',
                        backgroundColor: '#000000',
                        padding: 10,
                        borderRadius: 5
                    },islogin ? '' : {display:'none'}]}
                    onPress={async () => {
                        await logout();
                        await getCartData();
                        navigation.navigate('home');
                        //navigation.navigate('login', { screen: 'Login', params: { navigatePage: null } });
                    }}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 20 }}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style= StyleSheet.create({
    baseText:{
        color: '#212529',
        fontFamily:'Montserrat'   
    }
})

export default UserActionScreen;