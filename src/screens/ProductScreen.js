import React, { useState } from 'react';
import { View, Text, TextInput, Image, ImageBackground, FlatList, TouchableOpacity, Pressable, Modal, ScrollView, Dimensions, LogBox, Animated, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { isLoggedIn } from '../api/auth';
import Carousel from 'react-native-banner-carousel';
import SmartLoader from './SmartLoader';
import { pathSettings } from '../api/pathSettings';
import { updateCart } from './CartUtil';
import { ShoppingBag } from './ShoppingBag';
import SliderCard from "./SliderCard";
import { updateAppointment } from './AppointmentUtil';
import { addProductImpression } from '../api/apis';
import { IMPRESSION_PAGE_TYPE } from '../constants/commonConstants';

const PageWidth = Dimensions.get('window').width;
const lstDataStructure = {
    productDetails: {
        images: [],
        metal: {
            bisHallMark: null
        }
    }
};

function ProductScreen({ route, navigation }) {
    var { apiurl } = route.params;

    //console.log('productUrl 1: ', apiurl);
    //const [shoppingbagModalVisible, setShoppingbagModalVisible] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);
    const [listData, setListData] = React.useState({...lstDataStructure});

    // React.useEffect(() => {
    //     getScreenData();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            getScreenData();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [apiurl])
    );


    const getScreenData = async () => {
        try {
            setIsLoading(true);
            setListData({...lstDataStructure});
            
            const tPath = pathSettings.getProductByUrl;

            
            //console.log('productUrl 2: ', apiurl);
            //apiurl = "20-grams-purity-999-mmtc-pamp-floral-yellow-gold-bar-428-mmtc-20gm";
            //Alert.alert(tPath);
            let response = await fetch(tPath, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': '*'
                },
                body: JSON.stringify({
                    "url_key": apiurl
                })
            });
            let resJson = await response.json();
            console.log('resJson.data.list: ',resJson.data.list);
            setListData(resJson.data.list);
            setIsLoading(false);

            /*  Add Product Impression */

            Object.entries(resJson.data.list).forEach(([key, value], index) => {
                //console.log('Key: ', key);
                if (index == 0) {
                    let product_data = [];
                    product_data.push({
                        product_id: value.productId,
                        sku: value.sku,
                        vendor_id: value.store_brand_id,
                        position: 1,
                        bid_organic: 'bid'
                    });
                    if (product_data.length > 0) {
                        addProductImpression(product_data, IMPRESSION_PAGE_TYPE.PRODUCT_VIEW);
                    }
                } else {
                    let product_data = [];
                    let t_key = key.indexOf('More Jewellery From')>=0 ? 'More Jewellery From' : key;
                    //console.log('pr: ', IMPRESSION_PAGE_TYPE.PRODUCT_VIEW_OTHERS[t_key]);

                    value.map((itemData_item, idx) => {
                        product_data.push({
                            product_id: itemData_item.productId,
                            sku: itemData_item.sku,
                            vendor_id: itemData_item.store_brand_id,
                            position: idx,
                            bid_organic: 'bid'
                        });                        
                    });
                    if (product_data.length > 0) {
                        addProductImpression(product_data, IMPRESSION_PAGE_TYPE.PRODUCT_VIEW_OTHERS[t_key]);
                    }
                }
            });
            

            /*  End Add Product Impression */

            //console.log(listData);
            //alert(JSON.stringify(listData.banner));
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            //alert(JSON.stringify(error));
            //Alert.alert('', 'Network Problem Try Again');
        }
    }
// 'unique-rose-gold-diamond-pendant-60-adtest-pre-oneplus7t'
    const render_product = (items) => {
        return (
            <View key='pdxyz' style={{ flex: 1, marginTop: 10, marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                    <Carousel
                        autoplay={false}
                        //autoplayTimeout={5000}
                        loop
                        index={0}
                        //pageSize={PageWidth}
                        pageIndicatorContainerStyle={{ bottom: -15 }}
                        pageIndicatorStyle={{ backgroundColor: '#bdbdbd' }}
                        activePageIndicatorStyle={{ backgroundColor: '#494949' }}
                    //style={{backgroundColor:'pink'}}
                    >
                        {
                            items.images.map((image, index) => {
                                return (
                                    <View key={index} style={{ width: PageWidth, height: PageWidth }}>
                                        <Image
                                            source={{ uri: image }}
                                            style={{ resizeMode: 'contain', flex: 1, aspectRatio: 1 }}
                                        />
                                    </View>
                                )
                            })
                        }
                    </Carousel>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ minWidth: (PageWidth / 100 * 40), justifyContent: 'center' }}>
                        <Image
                            source={{ uri: items.brand_image_url }}
                            style={{ resizeMode: 'contain', width: '100%', height: 50 }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text numberOfLines={1} style={[style.baseText, { fontSize: 14, lineHeight:27 , fontWeight: '600' }]}>{items.store_brand_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[style.baseText, { flex: 1, flexWrap: 'wrap', fontSize: 12, lineHeight:18, fontWeight:'400' }]}>{items.store_brand_address}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ padding: 10, paddingBottom: 0 }}>
                    <Text style={[style.baseText, { flex: 1, flexWrap: 'wrap', fontSize: 18, lineHeight:22, fontWeight: '600' }]}>{items.productName}</Text>
                </View>

                <View style={{ flexDirection: 'row', padding: 10, paddingBottom: 0 }}>
                    <Text style={[style.baseText, { flex: 1, flexWrap: 'wrap', color:'#2d2d2d', fontSize: 11, lineHeight:20, fontWeight:'400' }]}>{items.sku}</Text>
                </View>

                <View style={{ flexDirection: 'row', padding: 10, paddingBottom: 0 }}>
                    <Text style={[style.baseText, { flex: 1, flexWrap: 'wrap', fontSize: 12, lineHeight:24, fontWeight:'400'}]}>{items.product_shortDesc}</Text>
                </View>

                <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                    <Text style={[style.baseText,{ color: '#ff6b6b', fontSize: 20, lineHeight:30, fontWeight: '600' }]}>{items.final_price && ('\u20B9'+ ' ' + items.final_price)} </Text>
                    <Text style={[style.baseText,{ color: '#000000', fontSize: 18, lineHeight:30, fontWeight: '600', textDecorationLine: 'line-through', paddingLeft: 8 }]}>{items.price && (items.price === items.final_price ? '' : '\u20B9' + ' ' + items.price)}</Text>
                    <Text style={[style.baseText,{ color: '#00b61f', fontSize: 14, lineHeight:21, fontWeight:'400', paddingLeft: 10 }]}>{ items.in_stock && (items.in_stock === 'yes' ? 'In Stock' : 'Out Of Stock')}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ flex: 1, padding: 15 }}>
                        <TouchableOpacity style={{ flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#063374' }}
                            onPress={async () => {

                                //setShoppingbagData(
                                setIsLoading(true);
                                await updateCart(
                                    items.productId,
                                    items.sku,
                                    items.productName,
                                    items.final_price,
                                    items.images[0],
                                    1,
                                    null,
                                    ''
                                )
                                //);

                                //setShoppingbagModalVisible(true);
                                setIsLoading(false);
                                navigation.navigate('cart', { screen: 'Shoppingbag' });
                            }}
                        >
                            <Text style={[style.baseText,{ fontSize: 13, lineHeight:18, fontWeight:'400', color: '#FFFFFF' }]}>BUY NOW</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, padding: 15 }}>
                        <TouchableOpacity
                            style={{ flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#CDAF84' }}
                            onPress={async () => {
                                setIsLoading(true);
                                await updateAppointment(
                                    {
                                        brand_image_url: items.brand_image_url,
                                        vendor_id: items.store_brand_id,
                                        vendor_name: items.store_brand_name,
                                    },
                                    ''
                                );
                                setIsLoading(false);
                                navigation.navigate('storevisit', { screen: 'Storevisit' })
                            }}
                        >
                            <Text style={[style.baseText,{ fontSize: 13, lineHeight:18, fontWeight:'400', color: '#FFFFFF' }]}>STORE VISIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ padding: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#CDAF84' }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={[style.baseText, { fontSize: 12, lineHeight:18, fontWeight:'400' }]}>METAL</Text>
                        </View>
                        <View>
                            <Image
                                source={{ uri: items.metal.bisHallMark }}
                                style={{ resizeMode: 'contain', width: 40, height: 40 }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 8, justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'400' }]}>Colour</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'600' }]}>{items.metal.color}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 8, justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'400' }]}>Gross Wt.</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'600' }]}>{items.metal.gross_weight}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 8, justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'400' }]}>Net Wt.</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'600' }]}>{items.metal["Net weight"]}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 8, justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'400' }]}>Hallmark</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'600' }]}>{items.metal.hallmark}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 8, justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'400' }]}>Metal</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'600' }]}>{items.metal.metal}</Text>
                        </View>
                    </View>
                    <View
                        style={[
                            { flexDirection: 'row', paddingTop: 8, justifyContent: 'space-between' },
                            items.metal.ring_size === undefined ? '' : { display: 'none' }
                        ]}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'400' }]}>Ring Size</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[style.baseText, { fontSize: 11, lineHeight:17, fontWeight:'600' }]}>{items.metal.ring_size}</Text>
                        </View>
                    </View>
                    <View style={{ paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <TextInput
                                style={[style.baseText, { fontSize: 16, lineHeight:24, fontWeight:'400', margin: 0, padding: 3 }]}
                                placeholder={'Enter Pincode'}
                            ></TextInput>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity style={{ marginRight: 15 }}>
                                <Text style={[style.baseText, { fontSize: 12, lineHeight:18, color: '#CDAF84', fontWeight: '600' }]}>CHECK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (

        <View style={{ flex: 1 }}>
            <SmartLoader isLoading={isLoading} />
            <ScrollView
                style={[
                    { flex: 1, backgroundColor: '#FFFFFF' }, 
                    //isLoading ? { display: 'none' } : ''
                ]}
                showsVerticalScrollIndicator={false}
            >
                {
                    (() => {
                        let ret = [];
                        Object.entries(listData).forEach(([key, value], index) => {
                            let card_data = { iscallfromproduct: true, category_sliderproduct: listData[key] };
                            //console.log('------',card_data);
                            if (index == 0) {
                                ret.push(render_product(listData.productDetails))
                            } else {
                                ret.push(
                                    <View key={'pd' + index} style={{ backgroundColor: '#F7F7F7', paddingTop: 10 }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={[style.baseText, {fontSize: 15, lineHeight:24, fontWeight: '600' }]}>{key}</Text>
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 10, paddingBottom: 20 }}>
                                            <SliderCard data={card_data} navigation={navigation} />

                                        </View>
                                    </View>
                                )
                            }
                        })
                        return (ret)
                    })()
                }
            </ScrollView>
        </View>
    )
}

const style= StyleSheet.create({
    baseText:{
        color: '#212529',
        fontFamily:'Montserrat'   
    }
})

export default ProductScreen;

/*
[
    {"brand_image_url": "https://image.ejohri.com/vendor/432/v-logo-1628253448474.jpg", "final_price": "41,040", "final_price_usd": "626", "hover_image": "https://image.ejohri.com/catalog/product/432/GR20706-2.jpg", "image_url": "https://image.ejohri.com/catalog/product/432/GR20706-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "43,200", "price_usd": "659", "productId": "48161", "productName": "Attractive Ruby Gemstone Floral Yellow Gold 14kt Diamond Ring-GR20706", "sku": "432-GR20706", "store_brand_city": "Jaipur", "store_brand_id": "432", "store_brand_name": "Golechas Jewels", "store_brand_url": "golechas-jewels", "url": "attractive-ruby-gemstone-floral-yellow-gold-14kt-diamond-ring-gr20706"}, 
    {"brand_image_url": "https://image.ejohri.com/vendor/427/v-logo-1626768890524.jpg", "final_price": "58,000", "final_price_usd": "885", "hover_image": "https://image.ejohri.com/catalog/product/427/VJLR013-3.jpg", "image_url": "https://image.ejohri.com/catalog/product/427/VJLR013-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "60,000", "price_usd": "915", "productId": "46998", "productName": "Attractive Cluster Floral Rose Gold 18kt Diamond Ring-VJLR013", "sku": "427-VJLR013", "store_brand_city": "Ghaziabad", "store_brand_id": "427", "store_brand_name": "Vinayak Jewels", "store_brand_url": "vinayak-jewels", "url": "attractive-cluster-floral-rose-gold-18kt-diamond-ring-vjlr013"},
    {"brand_image_url": "https://image.ejohri.com/vendor/267/v-logo-1626101733626.jpg", "final_price": "60,981", "final_price_usd": "930", "hover_image": "https://image.ejohri.com/catalog/product/267/LR11035-2.jpg", "image_url": "https://image.ejohri.com/catalog/product/267/LR11035-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": true, "is_new": false, "price": "60,981", "price_usd": "930", "productId": "38627", "productName": "Stylish Diamond Ring", "sku": "267-LR11035", "store_brand_city": "Mumbai", "store_brand_id": "267", "store_brand_name": "Anmol Jewellers", "store_brand_url": "anmol-jewellers", "url": "stylish-diamond-ring-lr11035"}, {"brand_image_url": "https://image.ejohri.com/vendor/436/v-logo-1630400847530.jpg", "final_price": "49,717", "final_price_usd": "758", "hover_image": "https://image.ejohri.com/catalog/product/436/DLRA722-1.jpg", "image_url": "https://image.ejohri.com/catalog/product/436/DLRA722-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "49,717", "price_usd": "758", "productId": "48331", "productName": "Delicate Floral Yellow Gold 14kt Diamond Ring-DLRA722", "sku": "436-DLRA722", "store_brand_city": "Ghaziabad", "store_brand_id": "436", "store_brand_name": "Janki Jewellers", "store_brand_url": "janki-jewellers", "url": "delicate-floral-yellow-gold-14kt-diamond-ring-dlra722"}, {"brand_image_url": "https://image.ejohri.com/vendor/58/v-logo-1626245415764.jpg", "final_price": "36,191", "final_price_usd": "552", "hover_image": "https://image.ejohri.com/catalog/product/R/1/R164-2.jpg", "image_url": "https://image.ejohri.com/catalog/product/R/1/R164-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": true, "is_new": false, "price": "36,191", "price_usd": "552", "productId": "30587", "productName": "Stunning Rhodium Polish Gold Band", "sku": "58-R164", "store_brand_city": "Mumbai", "store_brand_id": "58", "store_brand_name": "Popular Gold", "store_brand_url": "popular-gold", "url": "stunning-rhodium-polish-gold-band"}, {"brand_image_url": "https://image.ejohri.com/vendor/436/v-logo-1630400847530.jpg", "final_price": "49,640", "final_price_usd": "757", "hover_image": "https://image.ejohri.com/catalog/product/436/DLRA713-1.jpg", "image_url": "https://image.ejohri.com/catalog/product/436/DLRA713-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "49,640", "price_usd": "757", "productId": "48277", "productName": "Sparkling Floral Yellow Gold 14kt Diamond Ring-DLRA713", "sku": "436-DLRA713", "store_brand_city": "Ghaziabad", "store_brand_id": "436", "store_brand_name": "Janki Jewellers", "store_brand_url": "janki-jewellers", "url": "sparkling-floral-yellow-gold-14kt-diamond-ring-dlra713"}, {"brand_image_url": "https://image.ejohri.com/vendor/439/v-logo-1630399068857.jpg", "final_price": "35,000", "final_price_usd": "534", "hover_image": "https://image.ejohri.com/catalog/product/439/LR9-1.jpg", "image_url": "https://image.ejohri.com/catalog/product/439/LR9-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "35,000", "price_usd": "534", "productId": "48507", "productName": "Glittering Floral Casual Wear 18kt Yellow Gold Diamond Ring-439-LR9", "sku": "439-LR9", "store_brand_city": "Patna", "store_brand_id": "439", "store_brand_name": "Alankar Jewellers (Patna)", "store_brand_url": "alankar-jewellers-patna", "url": "glittering-floral-casual-wear-18kt-yellow-gold-diamond-ring-439-lr9"}, {"brand_image_url": "https://image.ejohri.com/vendor/342/v-logo-1626089687184.jpg", "final_price": "45,426", "final_price_usd": "693", "hover_image": "https://image.ejohri.com/catalog/product/342/LR18-1500-2.jpg", "image_url": "https://image.ejohri.com/catalog/product/342/LR18-1500-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "45,426", "price_usd": "693", "productId": "47540", "productName": "Attractive Floral Cluster Rose Gold 18kt Diamond Ring-LR18-1500", "sku": "342-LR18-1500", "store_brand_city": "Surat", "store_brand_id": "342", "store_brand_name": "Zota Jewel", "store_brand_url": "zota-jewel", "url": "attractive-floral-cluster-rose-gold-18kt-diamond-ring-lr18-1500"}, {"brand_image_url": "https://image.ejohri.com/vendor/138/Kuldeepppppp.jpg", "final_price": "46,194", "final_price_usd": "704", "hover_image": "https://image.ejohri.com/catalog/product/138/DLRG931-1.jpg", "image_url": "https://image.ejohri.com/catalog/product/138/DLRG931-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "46,194", "price_usd": "704", "productId": "48333", "productName": "Glittering Floral Yellow Gold 18kt Diamond Ring-DLRG931", "sku": "138-DLRG931", "store_brand_city": "Jamshedpur", "store_brand_id": "138", "store_brand_name": "Kuldip Sons Jewellers (Jamshedpur)", "store_brand_url": "kuldip-sons-jewellers-jamshedpur", "url": "glittering-floral-yellow-gold-18kt-diamond-ring-dlrg931"}, {"brand_image_url": "https://image.ejohri.com/vendor/235/v-logo-1626246451494.jpg", "final_price": "43,142", "final_price_usd": "658", "hover_image": "https://image.ejohri.com/catalog/product/235/DLR863-1.jpg", "image_url": "https://image.ejohri.com/catalog/product/235/DLR863-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "43,142", "price_usd": "658", "productId": "48634", "productName": "Sparkling Floral Rose Gold 18kt Diamond Ring-DLR863", "sku": "235-DLR863", "store_brand_city": "Nagpur", "store_brand_id": "235", "store_brand_name": "Rokde Jewellers", "store_brand_url": "rokde-jewellers", "url": "sparkling-floral-rose-gold-18kt-diamond-ring-dlr863"}, {"brand_image_url": "https://image.ejohri.com/vendor/267/v-logo-1626101733626.jpg", "final_price": "72,895", "final_price_usd": "1,112", "hover_image": "https://image.ejohri.com/catalog/product/267/LR10534-1.jpg", "image_url": "https://image.ejohri.com/catalog/product/267/LR10534-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": true, "is_new": false, "price": "72,895", "price_usd": "1,112", "productId": "38624", "productName": "Glittering Engagement Diamond Ring", "sku": "267-LR10534", "store_brand_city": "Mumbai", "store_brand_id": "267", "store_brand_name": "Anmol Jewellers", "store_brand_url": "anmol-jewellers", "url": "glittering-engagement-diamond-ring-lr10534"}, {"brand_image_url": "https://image.ejohri.com/vendor/342/v-logo-1626089687184.jpg", "final_price": "53,383", "final_price_usd": "814", "hover_image": "https://image.ejohri.com/catalog/product/342/LR14-561-3.jpg", "image_url": "https://image.ejohri.com/catalog/product/342/LR14-561-1.jpg", "is_cz_diamond": false, "is_diamond": false, "is_featured": false, "is_new": true, "price": "53,383", "price_usd": "814", "productId": "47533", "productName": "Fancy Floral Two Tone Gold 14kt Diamond Ring-LR14-561", "sku": "342-LR14-561", "store_brand_city": "Surat", "store_brand_id": "342", "store_brand_name": "Zota Jewel", "store_brand_url": "zota-jewel", "url": "fancy-floral-two-tone-gold-14kt-diamond-ring-lr14-561"}]
*/