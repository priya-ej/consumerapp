import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmartLoader from './SmartLoader';
import { isLoggedIn } from '../api/auth';
import { useFocusEffect } from '@react-navigation/native';

import { getCartData, updateCart, checkOut, increaseProdouctQtyInCart, decreaseProdouctQtyInCart } from './CartUtil';

const PageWidth = Dimensions.get('window').width;

function CartScreen({ route, navigation }) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [shoppingbagData, setShoppingbagData] = React.useState([]);

    const itemSubtotal = shoppingbagData.reduce((total, element) =>
        total += Math.trunc(element.price.toString().replace(/,/g, '')) * element.product_qty
        , 0);

    async function getAsyncstoragedata() {
        let t_data = await getCartData();
        setShoppingbagData(t_data);
    }

    useFocusEffect(
        React.useCallback(async() => {
            // Do something when the screen is focused
            setIsLoading(true);
            await getAsyncstoragedata();
            setIsLoading(false);
            
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setShoppingbagData([]);
                setIsLoading(false);
            };
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'space-between' }}>
            <SmartLoader isLoading={isLoading} />
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#D5D8DC' }}>
                    <Text style={[style.baseText,{
                        color: '#063374',
                        fontSize: 20,
                        lineHeight:24,
                        fontWeight: '600' 
                        }]}>Shopping Bag ({shoppingbagData.length} item)</Text>
                </View>
                <View style={{ flex: 1, paddingTop: 5 }}>
                    <FlatList
                        data={shoppingbagData}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}

                        renderItem={({ item }) =>
                            (
                                <View style={{
                                    flexDirection: 'row',
                                    margin: 10,
                                    marginTop: 0,
                                    padding: 10,
                                    shadowColor: '#470000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    elevation: 1,
                                }}>
                                    <View style={{ minWidth: (PageWidth / 100 * 30), }}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ resizeMode: 'contain', width: '100%', height: 80 }}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[style.baseText,{ 
                                                flex: 1, 
                                                flexWrap: 'wrap', 
                                                fontSize: 14, 
                                                lineHeight:17,
                                                fontWeight:'500'
                                                }]}>{item.productName}</Text>
                                        </View>
                                        <View style={{ paddingTop: 15 }}>
                                            <Text style={[style.baseText,{ 
                                                color: '#000000', 
                                                fontSize: 16, 
                                                lineHeight:21,
                                                fontWeight: '400' 
                                                }]}>{'\u20B9'} {Math.trunc(Number(item.price.toString().replace(/,/g, '')))} </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                            <View>
                                                <TouchableOpacity
                                                    style={{ padding: 7, paddingLeft: 14, paddingRight: 14, borderWidth: 1, borderColor: '#bdbdbd' }}
                                                    onPress={async () => {
                                                        //setShoppingbagData( await updateCart(null, item.sku, null, null, null, -1, 'updqty') ); 
                                                        setIsLoading(true);
                                                        //const t_data = await updateCart(null, item.sku, null, null, null, -1, null, 'updqty');
                                                        const t_data = await decreaseProdouctQtyInCart(
                                                            item,
                                                        );
                                                        setShoppingbagData(t_data);
                                                        setIsLoading(false);
                                                    }}
                                                >
                                                    <Text style={{ color:'#212529', fontFamily:'Montserrat', fontSize:14, lineHeight:18 , fontWeight:'400' }}>-</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ padding: 7, paddingLeft: 14, paddingRight: 14, borderWidth: 1, borderColor: '#bdbdbd' }}>
                                                <Text style={{ color:'#212529', fontFamily:'Montserrat', fontSize:12, lineHeight:18 , fontWeight:'600' }}>{item.product_qty}</Text>
                                            </View>
                                            <View>
                                                <TouchableOpacity
                                                    style={{ padding: 7, paddingLeft: 14, paddingRight: 14, borderWidth: 1, borderColor: '#bdbdbd' }}
                                                    onPress={async () => {
                                                        //setShoppingbagData(await updateCart(null, item.sku, null, null, null, 1, 'updqty') ); 
                                                        setIsLoading(true);
                                                        //const t_data = await updateCart(null, item.sku, null, null, null, 1, null, 'updqty');
                                                        const t_data = await increaseProdouctQtyInCart(
                                                            item,
                                                        );
                                                        setShoppingbagData(t_data);
                                                        setIsLoading(false);
                                                    }}
                                                >
                                                    <Text style={{ color:'#212529', fontFamily:'Montserrat', fontSize:14, lineHeight:18 , fontWeight:'400' }}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 10 }}>
                                            <View style={{ padding: 5 }}>
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        //setShoppingbagData(await updateCart(null, item.sku, null, null, null, null, 'remove') ); 
                                                        setIsLoading(true);
                                                        const t_data = await updateCart(null, item.sku, null, null, null, null, item.item_id, 'remove');
                                                        setShoppingbagData(t_data);
                                                        setIsLoading(false);
                                                    }}
                                                >
                                                    <Text style={{color: '#063374', fontFamily:'Montserrat', fontSize:13, lineHeight:18 , fontWeight:'400', textDecorationLine: 'underline' }}>Remove</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ padding: 5, paddingLeft: 10 }}>
                                                <TouchableOpacity>
                                                    <Text style={{ color: '#063374', fontFamily:'Montserrat', fontSize:13, lineHeight:18 , fontWeight:'400', textDecorationLine: 'underline'  }}>Move To Wishlist</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ padding: 5 }}>
                                                <TouchableOpacity>
                                                    <Text style={{ color: '#063374', fontFamily:'Montserrat', fontSize:13, lineHeight:18 , fontWeight:'400', textDecorationLine: 'underline'  }}>Move To Store Visit</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }
                    >
                    </FlatList>
                </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: '#e0e0e0' }}>
                <View style={{ paddingLeft: 15, paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={[style.baseText,{ color: '#063374', fontSize:14, lineHeight:21, fontWeight:'500' }]}>SUBTOTAL ({shoppingbagData.length} Item):</Text>
                    </View>
                    <View style={{paddingRight:5}}>
                        <Text style={[style.baseText, { color: '#063374', fontSize: 14, lineHeight:21, fontWeight: '500' }]}>{'\u20B9'} {itemSubtotal} </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {/* <View style={{ flex: 1, padding: 15 }}>
                        <TouchableOpacity style={{ padding: 10, alignItems: 'center', backgroundColor: '#063374' }}
                            onPress={() => {
                                alert('Cart');
                            }}
                        >
                            <Text style={{ fontSize: 16, color: '#FFFFFF' }}>VIEW CART</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{ flex: 1, padding: 15 }}>
                        <TouchableOpacity
                            style={{ padding: 12, alignItems: 'center', backgroundColor: '#063374' }}
                            onPress={async () => {
                                checkOut(navigation);
                            }}
                        >
                            <Text style={[style.baseText,{ color: '#FFFFFF', fontSize: 14, fontWeight:'500'  }]}>PROCEED TO CHECKOUT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default CartScreen;


const style= StyleSheet.create({
    baseText:{
        color: '#212529',
        fontFamily:'Montserrat'   
    }
  })

/*
[
    {"final_price": "60386.2814", "image": "https://image.ejohri.com/catalog/product/266/JNJ-063-1.jpg", "productId": "41945", "productName": "Elegant Drop Cutout Gold Chain Pendant  Set-JNJ-063", "qty": 1, "sku": "266-JNJ-063"}, 
    {"final_price": "11950.9031", "image": "https://image.ejohri.com/catalog/product/266/JNJ-168-1.jpg", "productId": "43195", "productName": " Fashion Daily Wear Yellow Gold 18kt Earrings-266-JNJ-168", "qty": 1, "sku": "266-JNJ-168"}, 
    {"final_price": "25494.3519", "image": "https://image.ejohri.com/catalog/product/240/GFR003-1.jpg",  "productId": "45528", "productName": "Traditional Texture Yellow Gold 22kt Ring-gfr003", "qty": 1, "sku": "240-gfr003"}, 
    {"final_price": "10213.5472", "image": "https://image.ejohri.com/catalog/product/266/JNJ-217-2.jpg", "productId": "43051", "productName": "Attractive Daily Wear Yellow Gold 18kt Ring-JNJ-217", "qty": 1, "sku": "266-JNJ-217"}
]
*/