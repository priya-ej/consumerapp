import React from 'react';
import { Image, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { useNavigation } from '@react-navigation/native';

function SearchBar(props) {
    const [searchcat, setSearchcat] = React.useState('');
    const [searchquery, setsearchquery] = React.useState('');
    //const navigation = useNavigation();

    return (
        <View style={{flex:1, flexDirection: 'row'}}>
            <View style={{justifyContent:'center', width: 60}}>
                <View style={{ backgroundColor: '#FFFFFF' , borderTopLeftRadius:4, borderBottomLeftRadius:4}}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'All',
                            value: ''
                        }}
                        style={{
                            inputIOS: {
                                height: 40,
                                fontSize: 16,
                                paddingLeft: 3
                            },
                            inputAndroid: {
                                height: 40,
                                fontSize: 16,
                                paddingLeft: 3,
                            }
                        }}
                        value={searchcat}
                        onValueChange={(value) => {
                            setSearchcat(value);
                        }}
                        items={[
                            { label: 'Designs', value: 'designs' },
                            { label: 'Products', value: 'products' },
                            { label: 'price', value: 'Price' },
                            { label: 'Coins', value: 'coins' },
                            { label: 'Collections', value: 'collections' },
                        ]}
                        useNativeAndroidPickerStyle={false}
                        Icon={() => {
                            return <Icon name="caret-down" size={28} color="#CDAF84" style={{ marginTop: 6, paddingRight: 10 }} />
                        }}

                    />
                </View>
            </View>
            <View style={{flex:1, justifyContent:'center', paddingLeft: 1 }}>
                <View 
                    style={{
                        flexDirection: 'row', 
                        justifyContent: 'space-between', 
                        backgroundColor: '#FFFFFF',
                        borderBottomRightRadius: 4,
                        borderTopRightRadius: 4
                    }}
                >
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TextInput
                            placeholder='Discover jewellery, jewellers and more'
                            placeholderTextColor='#B2BABB'
                            style={{flex:1, fontSize: 16, padding: 4 }}
                            onChangeText={setsearchquery}
                            value={searchquery}
                            underlineColorAndroid='transparent'
                        />
                    </View>
                    <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                //console.log(searchcat, searchquery);  
                                                     
                                //console.log(props.navigation.getState());
                                Keyboard.dismiss();
                                //const routes = navigation.getState().routeNames;
                                //console.log(navigation.getState().routes);

                                if(props.navigation.getState().routes[0].name === 'itemLst'){
                                    //console.log('checked *************');
                                    props.navigation.replace('itemLst', { apiurl: Math.random(), searchjson: { query: searchquery, category: searchcat } });
                                }else{
                                    props.navigation.navigate('itemlst', { screen: 'itemLst', params: { apiurl: Math.random(), searchjson: { query: searchquery, category: searchcat } } });
                                }
                            }}
                        >
                            <Image source={require('../images/search.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SearchBar;
/*
{
    "navigation": {
        "addListener": [Function addListener], 
        "canGoBack": [Function canGoBack], 
        "closeDrawer": [Function anonymous], 
        "dispatch": [Function dispatch], 
        "getParent": [Function getParent], 
        "getState": [Function anonymous], 
        "goBack": [Function anonymous], 
        "isFocused": [Function isFocused], 
        "jumpTo": [Function anonymous], 
        "navigate": [Function anonymous], 
        "openDrawer": [Function anonymous], 
        "pop": [Function anonymous], 
        "popToTop": [Function anonymous], 
        "push": [Function anonymous], 
        "removeListener": [Function removeListener], 
        "replace": [Function anonymous], 
        "reset": [Function anonymous], 
        "setOptions": [Function setOptions], 
        "setParams": [Function anonymous], 
        "toggleDrawer": [Function anonymous]
    }
}
*/
