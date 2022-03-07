import React from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image, ImageBackground, StyleSheet } from 'react-native';
import { updateCart } from './CartUtil';
import SimplePaginationDot from './SimplePaginationDot';
import VectorImage from 'react-native-vector-image';
//import IconCompare from '../images/compare.svg';
//import IconStorevisit from '../images/store-visit.svg';
//import IconCart from '../images/shopping-cart.svg';

//import { updateAppointment } from './AppointmentUtil';
//import { useDispatch } from 'react-redux';
//import { GET_CART_DATA } from '../redux/DispatcherFunctions/CartDispatchers'

function SliderCard(props) {
    const { data, navigation } = props;

    const [currentIndex, setCurrentIndex] = React.useState(0);

    const _onViewableItemsChanged = React.useRef((viewableItems) => {
        //console.log("Visible items are", viewableItems);
        //console.log("Changed in this iteration", viewableItems);
        //console.log('current index: ',viewableItems.changed[0].index);
        setCurrentIndex(viewableItems.changed[0].index);
    })

    const _viewabilityConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <View style={{ backgroundColor: '#F7F7F7' }}>
            <View style={[!data.slider_title ? { display: 'none' } : '', { padding: 20, flexDirection: 'row' }]}>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[style.baseText, { fontSize: 15, lineHeight: 24, fontWeight: '600' }]}>{data.slider_title}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('itemlst', { screen: 'itemLst', params: { apiurl: data.view_all_url } });
                        }}
                    >
                        <Text style={[style.baseText, { fontSize: 15, lineHeight: 12, fontWeight: '400', textDecorationLine: 'underline' }]}>View All ></Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[!data.slider_title ? { display: 'none' } : '', { paddingLeft: 10, paddingRight: 10 }]}>
                <Text style={[style.baseText, { fontSize: 16, lineHeight: 24, fontWeight: '400' }]}>{data.slider_description}</Text>
            </View>
            <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <FlatList
                        onViewableItemsChanged={_onViewableItemsChanged.current}
                        viewabilityConfig={_viewabilityConfig.current}

                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={data.category_sliderproduct}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={{
                                width: ((windowWidth / 2) - 15),
                                backgroundColor: '#FFFFFF',
                                margin: 10,
                                marginRight: 5,
                                marginLeft: 5
                            }}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                        console.log('SlideCardUrl: ',item.url);
                                        if (data.iscallfromproduct) {
                                            //console.log('push: ',item.url);
                                            navigation.push('product', { apiurl: item.url });
                                        } else {
                                            //console.log('navigate: ',item.url);
                                            navigation.navigate('itemlst', { screen: 'product', params: { apiurl: item.url } });
                                        }
                                    }}
                                >
                                    <View>
                                        {/* <Image
                                            source={{ uri: item.image_url }}
                                            style={{ resizeMode: 'contain', flex: 1, aspectRatio: 1 }}
                                        /> */}
                                        <ImageBackground
                                            source={{ uri: item.image_url }}
                                            //style={{resizeMode:'cover', height:'100%', width:'100%'}}
                                            resizeMode='contain'
                                            style={{ resizeMode: 'contain', flex: 1, aspectRatio: 1 }}
                                        >
                                            <View style={[
                                                (item.is_new || item.is_featured) ? '' : { display: 'none' },
                                                {
                                                    alignSelf: 'flex-start',
                                                    padding: 7,
                                                    paddingLeft: 10,
                                                    paddingRight: 10,
                                                    backgroundColor: item.is_new ? '#FF6B6B' : '#CDAF84',
                                                    borderBottomRightRadius: 13,

                                                }
                                            ]}>
                                                <Text style={{ color: '#FFFFFF', fontFamily: 'Arial', fontSize: 12, lineHeight: 13, fontWeight: '400' }}>
                                                    {item.is_new ? 'NEW' : 'FEATURED'}
                                                </Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Image resizeMode="contain" style={{ height: 70, width: '100%' }} source={{ uri: item.brand_image_url }} />
                                    </View>
                                    <View style={{ alignItems: 'center', padding: 10 }}>
                                        <Text style={[{ color: '#212529', fontFamily: 'Arial', fontSize: 12, lineHeight: 18, fontWeight: '400' }]} numberOfLines={1} >{item.store_brand_name}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[{ color: '#999999', fontFamily: 'Arial', fontSize: 12, lineHeight: 24, fontWeight: '500' }]}>{item.store_brand_city}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', flexDirection: 'row', padding: 10 }}>
                                        <Text style={[style.baseText, { color: '#000000', fontSize: 12, lineHeight: 24, fontWeight: '500' }]}>{'\u20B9'} {item.final_price} </Text>
                                        <Text style={[style.baseText, { color: '#000000', fontSize: 12, lineHeight: 24, fontWeight: '500', paddingLeft: 5, textDecorationLine: 'line-through' }]}>{item.price === item.final_price ? '' : '\u20B9' + ' ' + item.price}</Text>
                                    </View>

                                    {/* <View style={{ paddingBottom: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        style={{ marginLeft: 10, marginRight: 10, borderWidth: 1, borderRadius: 25, padding: 8 }}
                                        onPress={async () => {
                                            await updateAppointment(
                                                {
                                                    brand_image_url: item.brand_image_url,
                                                    vendor_id: item.store_brand_id,
                                                    vendor_name: item.store_brand_name,
                                                },
                                                ''
                                            );
                                            navigation.navigate('storevisit', { screen: 'Storevisit' })
                                        }}
                                    >
                                        <VectorImage source={require('../images/store-visit.svg')} style={{ width: 23, height: 23, tintColor: '#000000' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ borderWidth: 1, borderRadius: 25, padding: 8 }}
                                        onPress={async () => {
                                            await updateCart(
                                                item.productId,
                                                item.sku,
                                                item.productName,
                                                Number(item.final_price.replace(/,/g, '')),
                                                item.image_url,
                                                1,
                                                null,
                                                ''
                                            );
                                            // useDispatch()(GET_CART_DATA());
                                            navigation.navigate('cart', { screen: 'Shoppingbag' });
                                        }}
                                    >
                                        <VectorImage source={require('../images/shopping-cart.svg')} style={{ width: 23, height: 23, tintColor: '#000000' }} />
                                    </TouchableOpacity>
                                </View> */}
                                </TouchableOpacity>
                            </View>
                        )}
                    >
                    </FlatList>
                    <SimplePaginationDot currentIndex={currentIndex} length={data.category_sliderproduct.length} />
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    baseText: {
        color: '#212529',
        fontFamily: 'Montserrat'
    }
})

export default SliderCard;