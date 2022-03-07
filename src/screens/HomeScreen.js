import React from 'react';
import {
  Keyboard,
  ScrollView,
  FlatList,
  LogBox,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StyleSheet
} from 'react-native';
//import { Picker, PickerIOS } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconSimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
//import { FlatList } from 'react-native-gesture-handler';
import {pathSettings} from '../api/pathSettings';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Carousel from 'react-native-banner-carousel';
import SlideCard from './SliderCard';
import SmartLoader from './SmartLoader';
import {GlobalVariable} from './GlobalVariable';
import {addProductImpression} from '../api/apis';
import SimplePaginationDot from './SimplePaginationDot';
import Banner from '../Components/Banner/Banner';
import { IMPRESSION_PAGE_TYPE } from '../constants/commonConstants';
import crashlytics from '@react-native-firebase/crashlytics';

let banner_CurrentSlide = 0;
let gold_jewellery_currentSlide = 0;
let diamond_jewellery_currentSlide = 0;
let silver_jewellery_currentSlide = 0;
let recommendations_currentSlide = 0;

/*
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
*/

function HomeScreen({navigation}) {
  //const insets = useSafeAreaInsets();
  const banner_flatList = React.useRef();
  const gold_jewellery_flatList = React.useRef();
  const diamond_jewellery_flatList = React.useRef();
  const silver_jewellery_flatList = React.useRef();
  const recommendations_flatList = React.useRef();

  const [isLoading, setIsLoading] = React.useState(false);
  const [listData, setListData] = React.useState([]);

  const [searchcat, setSearchcat] = React.useState('');
  const [searchquery, setsearchquery] = React.useState('');

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [refreshing, setRefreshing] = React.useState(false);

  //const {setCartBadgecount} = React.useContext(GlobalVariable);

  //     {
  //         "banner": {
  //             "banner_data": [],
  //             "position": 0
  //         },
  //         "hottest-deals": {
  //             "images": [],
  //             "position": 0
  //         },
  //         "Trending Offers": {
  //             "category_sliderproduct": [],
  //             "position": 0
  //         }
  //         // "diamond_jewellery": {
  //         //     "category_sliderproduct": [],
  //         //     "position": 0
  //         // },
  //         // "gold_jewellery": {
  //         //     "gold_jewellery_data": [],
  //         //     "position": 0
  //         // },
  //         // "sliver_jewellery": {
  //         //     "sliver_jewellery_data": [],
  //         //     "position": 0
  //         // },
  //         // "recommendations": {
  //         //     "recommendations_data": [],
  //         //     "position": 0
  //         // }
  //     }
  // );
  //   const [imgData, setImgData] = React.useState([
  //     {
  //       imglnk:
  //         'https://image.ejohri.com/banners/ValentinePromotionbanner_414x170pwa.jpg',
  //     },
  //     {
  //       imglnk:
  //         'https://image.ejohri.com/banners/GiftingGoldCoinappBanner123.jpg',
  //     },
  //   ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    //wait(2000).then(() => setRefreshing(false));
    getHomeScreenData();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    
    getHomeScreenData();
  }, []);

  const getHomeScreenData = async () => {
    try {
      setIsLoading(true);
      const tPath = pathSettings.getHomepageData;
      //Alert.alert(tPath);
      let response = await fetch(tPath, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': '*',
        },
      });
      let resJson = await response.json();

      const {list} = resJson.data;
      let t_json = [];
      for (var k in list) {
        let t_item = list[k];
        if (t_item.position > 0) {
          t_json.push({...t_item, key_attr: k});
        }
      }
      t_json.sort((a, b) => a.position - b.position);

      //console.log('t_json: ',t_json);
      setListData(t_json);
      setIsLoading(false);

      /*  Add Product Impression */
      let product_data= [];
      let productIndex = 1;
      listData.map((itemData) => {
        if (itemData.is_slider) {
          itemData.category_sliderproduct.map((itemData_item) => {
            product_data.push({
              product_id: itemData_item.productId,
              sku: itemData_item.sku,
              vendor_id: itemData_item.store_brand_id,
              position: productIndex++,
              bid_organic: 'bid'
            });
          });
        }
      });
      if(product_data.length > 0){
        addProductImpression(product_data, IMPRESSION_PAGE_TYPE.HOME);
      }

      /*  End Add Product Impression */
      
      
      //console.log([{...listData}]);
      //alert(JSON.stringify(listData.banner));
    } catch (error) {
      setIsLoading(false);
      crashlytics().recordError(error);
      console.log(error);
      //alert(JSON.stringify(error));
      //Alert.alert('', 'Network Problem Try Again');
    }
  };

  const render_banner = items => {
    return (
      <View id={items.key_attr}>
        <View>
          <Carousel
            showsPageIndicator={false}
            autoplay={true}
            autoplayTimeout={7000}
            loop
            index={0}
            //pageSize={windowWidth}
          >
            {items.banner_data.map((item, index) => {
              return (
                <View key={index} style={{flex: 1}}>
                  <TouchableOpacity
                    style={{height: 200, width: windowWidth}}
                    onPress={() => {
                      navigation.navigate('itemlst', {
                        screen: 'itemLst',
                        params: {apiurl: item.link},
                      });
                    }}>
                    <Image
                      source={{uri: item.mobile_image}}
                      style={{resizeMode: 'stretch', flex: 1}}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </Carousel>
        </View>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity>
                <Image
                  style={{width: 36, height: 40}}
                  source={require('../images/insurance.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={style.bannerText}>Free Transit</Text>
              <Text style={style.bannerText}>Insurance</Text>
            </View>
          </View>
          <View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity>
                <Image
                  style={{width: 36, height: 40}}
                  source={require('../images/jewellery.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={style.bannerText}>Certified Jewellery</Text>
            </View>
          </View>
          <View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity>
                <Image
                  style={{width: 36, height: 40}}
                  source={require('../images/return7days.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={style.bannerText}>7 Days Returns</Text>
            </View>
          </View>
          <View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity>
                <Image
                  style={{width: 36, height: 40}}
                  source={require('../images/freedelivery.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={style.bannerText}>Free Delivery</Text>
            </View>
          </View>
          <View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity>
                <Image
                  style={{width: 36, height: 40}}
                  source={require('../images/freedelivery.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={style.bannerText}>COD Available</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const render_hottest_deals = items => {
    return (
      <View
        id={items.key_attr}
        style={{backgroundColor: '#F7F7F7', marginTop: 4}}>
        <View style={{padding: 10}}>
          <View
            style={{
              alignItems: 'center',
              padding: 5,
              borderBottomColor: '#063374',
              borderBottomWidth: 0.6,
            }}>
            <Text style={[style.baseText, {color: '#053374', fontSize: 20, lineHeight:24, fontWeight: '500'}]}>
              {items.title}
            </Text>
          </View>
          <View style={{alignItems: 'center', padding: 8}}>
            <Text style={[style.baseText,{color: '#606060', fontSize: 15, lineHeight:22, fontWeight:'400'}]}>
              {items.sub_title}
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingTop: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: 5,
              paddingTop: 0,
            }}>
            <FlatList
              //ref={gold_jewellery_flatList}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              //data={listData.gold_jewellery.gold_jewellery_data}
              data={items.images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View style={{width: windowWidth / 2, marginRight: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('itemlst', {
                        screen: 'itemLst',
                        params: {apiurl: item.url},
                      });
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{height: 150, width: windowWidth / 2}}
                      source={{uri: item.img_url}}
                    />
                  </TouchableOpacity>
                </View>
              )}
              snapToAlignment={'start'}
              //snapToInterval={200 + 10} // Adjust to your content width
              decelerationRate={'fast'}
              pagingEnabled
            />
          </View>
        </View>
      </View>
    );
  };

  render_gold_jewellery = items => {
    return (
      <View style={{backgroundColor: '#F7F7F7', marginTop: 4}}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{color: '#000000', fontSize: 20, fontWeight: '600'}}>
              Gold Jewellery
            </Text>
          </View>
          <View>
            <Text style={{color: '#000000', fontSize: 15, fontWeight: '400'}}>
              VIEW ALL
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-start',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (gold_jewellery_currentSlide > 0) {
                  gold_jewellery_flatList.current.scrollToIndex({
                    index: --gold_jewellery_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-left"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 'auto', marginRight: 'auto', padding: 15}}>
            <FlatList
              ref={gold_jewellery_flatList}
              horizontal
              showsHorizontalScrollIndicator={false}
              //data={listData.gold_jewellery.gold_jewellery_data}
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{width: windowWidth - 20, backgroundColor: '#FFFFFF'}}>
                  <View style={{paddingTop: 15}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 250, width: '100%'}}
                      source={{uri: item.image}}
                    />
                    {/* <Text>{item.image}</Text> */}
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 70, width: 220}}
                      source={{uri: item.brand_image_url}}
                    />
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      {item.store_brand_name}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontWeight: '400', fontSize: 18}}>
                      {item.store_brand_city}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      Rs. {item.price}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-end',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (gold_jewellery_currentSlide < items.length - 1) {
                  gold_jewellery_flatList.current.scrollToIndex({
                    index: ++gold_jewellery_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-right"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render_diamond_jewellery = items => {
    return (
      <View style={{backgroundColor: '#F7F7F7', marginTop: 4}}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{color: '#000000', fontSize: 20, fontWeight: '600'}}>
              Diamond Jewellery
            </Text>
          </View>
          <View>
            <Text style={{color: '#000000', fontSize: 15, fontWeight: '400'}}>
              VIEW ALL
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-start',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (diamond_jewellery_currentSlide > 0) {
                  diamond_jewellery_flatList.current.scrollToIndex({
                    index: --diamond_jewellery_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-left"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 'auto', marginRight: 'auto', padding: 15}}>
            <FlatList
              ref={diamond_jewellery_flatList}
              //numColumns={1}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{width: windowWidth - 20, backgroundColor: '#FFFFFF'}}>
                  <View style={{paddingTop: 15}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 250, width: '100%'}}
                      source={{uri: item.image}}
                    />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 70, width: 220}}
                      source={{uri: item.brand_image_url}}
                    />
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      {item.store_brand_name}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontWeight: '400', fontSize: 18}}>
                      {item.store_brand_city}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      Rs. {item.price}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-end',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (diamond_jewellery_currentSlide < items.length - 1) {
                  diamond_jewellery_flatList.current.scrollToIndex({
                    index: ++diamond_jewellery_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-right"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render_silver_jewellery = items => {
    return (
      <View style={{backgroundColor: '#F7F7F7', marginTop: 4}}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{color: '#000000', fontSize: 20, fontWeight: '600'}}>
              Silver Jewellery
            </Text>
          </View>
          <View>
            <Text style={{color: '#000000', fontSize: 15, fontWeight: '400'}}>
              VIEW ALL
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-start',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (silver_jewellery_currentSlide > 0) {
                  silver_jewellery_flatList.current.scrollToIndex({
                    index: --silver_jewellery_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-left"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 'auto', marginRight: 'auto', padding: 15}}>
            <FlatList
              ref={silver_jewellery_flatList}
              //numColumns={1}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{width: windowWidth - 20, backgroundColor: '#FFFFFF'}}>
                  <View style={{paddingTop: 15}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 250, width: '100%'}}
                      source={{uri: item.image}}
                    />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 70, width: 220}}
                      source={{uri: item.brand_image_url}}
                    />
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      {item.store_brand_name}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontWeight: '400', fontSize: 18}}>
                      {item.store_brand_city}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      Rs. {item.price}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-end',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (silver_jewellery_currentSlide < items.length - 1) {
                  silver_jewellery_flatList.current.scrollToIndex({
                    index: ++silver_jewellery_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-right"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render_recommendations = items => {
    return (
      <View style={{backgroundColor: '#F7F7F7', marginTop: 4}}>
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{color: '#000000', fontSize: 20, fontWeight: '600'}}>
              Recommendations
            </Text>
          </View>
          <View>
            <Text style={{color: '#000000', fontSize: 15, fontWeight: '400'}}>
              VIEW ALL
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-start',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (recommendations_currentSlide > 0) {
                  recommendations_flatList.current.scrollToIndex({
                    index: --recommendations_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-left"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
          <View style={{marginLeft: 'auto', marginRight: 'auto', padding: 15}}>
            <FlatList
              ref={recommendations_flatList}
              //numColumns={1}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <View
                  style={{width: windowWidth - 20, backgroundColor: '#FFFFFF'}}>
                  <View style={{paddingTop: 15}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 250, width: '100%'}}
                      source={{uri: item.image}}
                    />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      resizeMode="contain"
                      style={{height: 70, width: 220}}
                      source={{uri: item.brand_image_url}}
                    />
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      {item.store_brand_name}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontWeight: '400', fontSize: 18}}>
                      {item.store_brand_city}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 22}}>
                      Rs. {item.price}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
          <View
            style={{
              zIndex: 1,
              justifyContent: 'flex-end',
              borderWidth: 1,
              borderColor: '#CDAF84',
              borderRadius: 25,
              padding: 8,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (recommendations_currentSlide < items.length - 1) {
                  recommendations_flatList.current.scrollToIndex({
                    index: ++recommendations_currentSlide,
                    animated: true,
                  });
                }
              }}>
              <IconSimpleLineIcons
                name="arrow-right"
                size={25}
                color="#CDAF84"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  //change request
  return (
    // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //   <Text>Home Screen</Text>
    // </View>
    <View style={{flex: 1}}>
      <SmartLoader isLoading={isLoading} />
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ScrollView
          style={{flex: 1, backgroundColor: '#FFFFFF'}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {listData.map((itemData, index) => {
            switch (itemData.key_attr) {
              case 'banner':
                return (
                  <Banner
                    key={`${Math.random()}`}
                    items={itemData}
                    navigation={navigation}
                  />
                );
              case 'hottest-deals':
                return (
                  <View key={`${Math.random()}`}>
                    {render_hottest_deals(itemData)}
                  </View>
                );
              default:
                if (itemData.is_slider) {
                  return (
                    <SlideCard
                      key={`${Math.random()}`}
                      data={itemData}
                      navigation={navigation}
                    />
                  );
                }
            }
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const style= StyleSheet.create({
  baseText:{
      color: '#212529',
      fontFamily:'Montserrat'   
  },
  bannerText:{
    color: '#212529',
    fontFamily:'Montserrat',
    fontSize:10,
    lineHeight:12,
    fontWeight:'400'
  }
})

export default HomeScreen;

// https://stackoverflow.com/questions/54039345/display-images-in-flatlist/54042860
/*
[
    {"brand_image_url": "https://image.ejohri.com/vendor/240/v-logo-1626112180649.jpg", "catid": "509", "final_price": "2,736", "final_price_usd": "42", "hover": "https://image.ejohri.com/catalog/product/240/llc00014-1.JPG", "image": "https://image.ejohri.com/catalog/product/240/llc00014-1.JPG", "image_url": "https://image.ejohri.com/catalog/product/cache/6570621d0904a67ef7cf9ba10ae0c647/240/llc00014-1.JPG", "in_stock": "yes", "is_new": false, "is_wishlist": false, "lbl": "Attractive Two Layered White Silver 925 Payal-llc00014", "price": "2,736", "price_usd": "42", "productId": "43567", "productName": "Attractive Two Layered White Silver 925 Payal-llc00014", "sku": "240-llc00014", "store_brand_city": "Bangalore", "store_brand_id": 240, "store_brand_name": "Bharat Jewellers", "store_brand_url": "bharat-jewellers", "url": "attractive-two-layered-white-silver-925-payal-llc00014"},
    {"brand_image_url": "https://image.ejohri.com/vendor/337/v-logo-1601117510765.jpg", "catid": "509", "final_price": "3,000", "final_price_usd": "46", "hover": "https://image.ejohri.com/catalog/product/337/KJ08-1.jpg", "image": "https://image.ejohri.com/catalog/product/337/KJ08-1.jpg", "image_url": "https://image.ejohri.com/catalog/product/cache/6570621d0904a67ef7cf9ba10ae0c647/337/KJ08-1.jpg", "in_stock": "yes", "is_new": false, "is_wishlist": false, "lbl": "Gorgeous Floral Gemstone 925 Silver Pendant-KJ08", "price": "3,000", "price_usd": "46", "productId": "40828", "productName": "Gorgeous Floral Gemstone 925 Silver Pendant-KJ08", "sku": "337-KJ08", "store_brand_city": "Delhi", "store_brand_id": 337, "store_brand_name": "Shri Kusal Jewellers", "store_brand_url": "shri-kusal-jewellers", "url": "gorgeous-floral-gemstone-925-silver-pendant-kj08"}
]
*/

// https://medium.com/enappd/refreshcontrol-pull-to-refresh-in-react-native-apps-dfe779118f75
