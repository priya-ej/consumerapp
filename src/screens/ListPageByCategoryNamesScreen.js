/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  Modal,
  SafeAreaView
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import VectorImage from 'react-native-vector-image';
import {addProductImpression} from '../api/apis';

import SmartLoader from './SmartLoader';
import { updateCart } from './CartUtil';
import { updateAppointment } from './AppointmentUtil';
import { getProductsList } from '../api/apis';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../redux/actions';
import StoreKeys from '../redux/storeKeys';
import { PAGE_TYPES } from '../constants/commonConstants';
import { GET_CART_DATA } from '../redux/DispatcherFunctions/CartDispatchers';
import { IMPRESSION_PAGE_TYPE } from '../constants/commonConstants';
import {RadioButton2} from '../Components/RadioButton/RadioButton'

function ListPageByCategoryNamesScreen({ route, navigation }) {
  const { apiurl, searchjson } = route.params;
  //console.log(apiurl, searchjson);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageno, setPageno] = React.useState(0);
  const [itemList, setItemList] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [resultCount, setResultCount] = React.useState('');
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  const [sortModalVisible, setSortModalVisible] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('popularity');

  const [filterList, setFilterList] = React.useState([]);
  const [filterAttributeList, setFilterAttributeList] = React.useState([]);
  const [flt, setFlt] = React.useState({});
  const pageTypes = useSelector(
    state => state[Actions.USER.KEY][StoreKeys.USER.PAGE_URLS],
  );

  const sort_by = {
    Newest_First: 'newest_first',
    Price_Low_To_High: 'price_low_to_high',
    Price_High_To_Low: 'price_high_to_low',
    Popularity: 'popularity',
  }
  const dispatch = useDispatch();

  const getListData = async () => {
    try {      
      setFilterModalVisible(false);
      setSortModalVisible(false);
      setIsLoading(true);
      
      //console.log('Page No 1: ', pageno);
      //console.log('Filter 2: ', flt);
      //console.log('Url 3: ', apiurl);
      //console.log('pageTypes: ',pageTypes);
      //console.log('pageTypes[apiurl] :', pageTypes[apiurl]);
      //console.log('searchjson :', searchjson);

      const body = {
        filterExpression: flt,
        url: searchjson ? null : apiurl,
        pageNum: (pageno <0 ? 1 : pageno),
        pageType: searchjson ? PAGE_TYPES.SEARCH : pageTypes[apiurl],
        sortBy: sortBy,
      };
      if (searchjson) {
        body.query = searchjson.query;
      }
      //console.log('list Q : ',body);
      const resJson = await getProductsList(body);
      console.log('lstData: ', resJson);
      setItemList(prevState => [...prevState, ...resJson.list]);
      //console.log(resJson.list);
      setTitle(resJson.h1_title);
      setResultCount(resJson.count + ' designs found');
      await setFilterList(
        resJson.filter.attributes.sort((a, b) => a.position - b.position),
      );
      setFilterAttributeList({ ...filterList[0]});
      //console.log(filterAttributeList);
      setIsLoading(false);

      /*  Add Product Impression */
      
      let product_data= [];
      let productIndex = 1;
      resJson.list.map((itemData_item) => {
          product_data.push({
            product_id: itemData_item.productId,
            sku: itemData_item.sku,
            vendor_id: itemData_item.store_brand_id,
            position: productIndex++,
            bid_organic: 'bid'
          });
      });
      if(product_data.length > 0){
        addProductImpression(product_data,  (pageTypes[apiurl] == 'category' ? IMPRESSION_PAGE_TYPE.CATEGORY : IMPRESSION_PAGE_TYPE.OTHERS) );
      }
      
      /*  End Add Product Impression */

    } catch (error) {
      setIsLoading(false);
      console.log(error);
      //alert(JSON.stringify(error));
      //Alert.alert('', 'Network Problem Try Again');
    }
  };

  const fetchMoreListData = () => {
    setPageno(prevState => prevState + 1);
  }

  React.useEffect(()=>{
    if(pageno >= 1){
      //console.log('xx call Sorted by: ', sortBy);
      setItemList([]);
      getListData();
    }
  },[sortBy]);

  React.useEffect(() => {
    //console.log('IIIIIIInnnn');
    setItemList([]);
    setTitle('');
    setSortBy(sort_by.Popularity);
    setResultCount(' designs found');
    setFlt({});
    setPageno(-1);
  }, [apiurl]);

  React.useEffect(()=>{
    if(pageno == -1 || pageno > 1){
      //console.log('Fetch More Data:pg:', pageno);
      if(pageno == -1){
        setPageno(1);
      }
      getListData();
    }
  },[pageno]);

  const isChecked = (attributeCode, optionId) => {
    if (flt[attributeCode]) {
      return flt[attributeCode].includes(optionId);
    } else {
      return false;
    }
    //const isThere = flt[attributeCode].includes(optionId);
    //return isThere;
  };

  const toggleChecked = (attributeCode, optionId) => {
    if (isChecked(attributeCode, optionId)) {
      setFlt(prevState => {
        return {
          ...prevState,
          [attributeCode]: flt[attributeCode].filter(id => id !== optionId),
        };
      });
    } else {
      setFlt(prevState => {
        return {
          ...prevState,
          [attributeCode]: [
            ...(prevState[attributeCode] ? prevState[attributeCode] : []),
            optionId,
          ],
        };
      });
    }
    //console.log(flt); 52
  };
// 
  return (
    <View style={{ flex: 1 }}>
      <SmartLoader isLoading={isLoading} />
      <Modal
        //animationType="none"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => {
          setSortModalVisible(!sortModalVisible);
        }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Pressable  onPress={()=> setSortModalVisible(false)} style={{flex:1, justifyContent: "center", alignItems: "center"}}>
          <View style={{backgroundColor: '#FFFFFF', padding:15,}}>
              <View style={{alignItems:'center', borderBottomWidth:1, borderBottomColor:'#CDAF84'}}>
                <Text style={[styles.baseText,{marginHorizontal:20, fontSize:16}]}>Sort By</Text>
              </View>
              <View style={{paddingTop:10}}>
                <TouchableOpacity                  
                  onPress={async () => {
                    setSortBy(sort_by.Popularity);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 25, alignItems: 'center' }}>
                      <RadioButton2 selected={sortBy === sort_by.Popularity}></RadioButton2>
                    </View>
                    <View style={{marginLeft: 8, paddingVertical: 12, }}>
                      <Text style={[styles.baseText, { fontSize: 14, fontWeight: '400' }]}>Popularity</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity                  
                  onPress={async () => {
                    setSortBy(sort_by.Newest_First);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 25, alignItems: 'center' }}>
                      <RadioButton2 selected={sortBy === sort_by.Newest_First}></RadioButton2>
                    </View>
                    <View style={{ marginLeft: 8, paddingVertical: 12, }}>
                      <Text style={[styles.baseText, { fontSize: 14, fontWeight: '400' }]}>Newest First</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity                  
                  onPress={async () => {
                    setSortBy(sort_by.Price_Low_To_High);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 25, alignItems: 'center' }}>
                      <RadioButton2 selected={sortBy === sort_by.Price_Low_To_High}></RadioButton2>
                    </View>
                    <View style={{ marginLeft: 8, paddingVertical: 12, }}>
                      <Text style={[styles.baseText, { fontSize: 14, fontWeight: '400' }]}>Price: Low To Hight</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity                  
                  onPress={async () => {
                    setSortBy(sort_by.Price_High_To_Low);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 25, alignItems: 'center' }}>
                      <RadioButton2 selected={sortBy === sort_by.Price_High_To_Low}></RadioButton2>
                    </View>
                    <View style={{ marginLeft: 8, paddingVertical: 12, }}>
                      <Text style={[styles.baseText, { fontSize: 14, fontWeight: '400' }]}>Price: Hight To Low</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
          </View>
          </Pressable>
          </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => {
          setFilterModalVisible(!filterModalVisible);
        }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={{ flex: 1, margin: 1, backgroundColor: '#FFFFFF' }}>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#D5D8DC',
              }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Filters</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={Object.keys(flt).length === 0 ? { display: 'none' } : ''}
                  onPress={() => {
                    setFlt({});
                  }}>
                  <Text style={{ color: '#3498DB' }}>Clear Filter</Text>
                </TouchableOpacity>
              </View>
              <View style={{ paddingRight: 10 }}>
                <Pressable
                  onPress={() => setFilterModalVisible(!filterModalVisible)}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>X</Text>
                </Pressable>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ backgroundColor: '#F7F7F7', padding: 5 }}>
                <FlatList
                  data={filterList}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <View key={'fl1'+index} style={{ paddingLeft: 8, paddingRight: 8 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setFilterAttributeList({ ...item });
                        }}>
                        <Text
                          style={{
                            color: '#000000',
                            padding: 7,
                            textTransform: 'uppercase',
                            fontSize: 15,
                          }}>
                          {item.attributeLabel}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
              <View>
                <FlatList
                  data={filterAttributeList.attributeValues}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => (
                    <View key={'fl2'+index} style={{ padding:5, paddingLeft: 8, paddingRight: 8 }}>
                      <TouchableOpacity
                        style={{ flexDirection: 'row',}}
                        onPress={() =>
                          toggleChecked(
                            filterAttributeList.attributeCode,
                            item.optionId,
                          )
                        }>
                        <CheckBox
                          disabled={true}
                          boxType="square"
                          tintColors={{ true: '#CDAF84' }}
                          tintColor={'#CDAF84'}
                          value={isChecked(
                            filterAttributeList.attributeCode,
                            item.optionId,
                          )}
                        />
                        <Text
                          style={{ color: '#000000', padding: 7, fontSize: 15 }}>
                          {item.optionLabel}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>
            <View
              style={{
                padding: 5,
                backgroundColor: '#063374',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}
                  onPress={async () => {
                    setItemList([]);
                    setPageno(-1);
                    await getListData();
                  }}>
                  <Text style={{ color: '#CDAF84', fontSize: 15 }}>Apply</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}
                  onPress={() => setFilterModalVisible(!filterModalVisible)}>
                  <Text style={{ color: '#CDAF84', fontSize: 15 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setFilterModalVisible(!filterModalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View> */}
          </View>
        </SafeAreaView>
      </Modal>
      <View style={{ flex: 1, justifyContent: 'space-between', }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#063374" }}>
        <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
          <FlatList
            data={itemList}
            onEndReached={fetchMoreListData}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={() => (
              <View>
                <View style={{ alignItems: 'center', margin: 5 }}>
                  <Text
                    style={{ fontFamily: 'Montserrat', color: '#2852a4', fontSize: 20, lineHeight: 24, fontWeight: '400' }}>
                    {title}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    marginTop: 5,
                    marginBottom: 5,
                  }}>
                  <Text
                    style={[styles.baseText, {
                      padding: 7,
                      paddingLeft: 10,
                      fontSize: 13,
                      lineHeight: 20,
                      fontWeight: '600',
                    }]}>
                    {resultCount}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            numColumns={2}
            renderItem={({ item, index }) => (
              <View
                key={'fv' + index}
                style={{
                  backgroundColor: '#FFFFFF',
                  margin: 5,
                  padding: 5,
                  borderRadius: 2,
                  flex: 1,
                }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    //navigation.navigate('product', {apiurl: item.url});
                    navigation.navigate('itemlst', {
                      screen: 'product',
                      params: { apiurl: item.url },
                    });
                  }}>
                  <View>
                    <Image
                      source={{ uri: item.image_url }}
                      resizeMode='contain'
                      style={{ resizeMode: 'contain', flex: 1, aspectRatio: 1 }}
                    />
                  </View>
                  <View>
                    <Text numberOfLines={1} style={[styles.baseText, { color: '#999999', fontSize: 12, fontWeight: '400' }]}>
                      {item.productName}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={{ uri: item.brand_image_url }}
                      style={{ resizeMode: 'contain', width: '100%', height: 35 }}
                    />
                  </View>
                  <View style={{ alignItems: 'center', paddingTop: 5 }}>
                    <Text numberOfLines={1} style={[styles.baseText, { fontSize: 14, lineHeight: 28, fontWeight: '400' }]}>
                      {item.store_brand_name}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text numberOfLines={1} style={[styles.baseText, { color: '#999999', fontSize: 10, lineHeight: 20, fontWeight: '400' }]}>
                      {item.store_brand_city}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={[styles.baseText, { fontSize: 14, lineHeight: 28, fontWeight: '600' }]}>
                      {'\u20B9'} {item.final_price}{' '}
                    </Text>
                    <Text
                      style={[styles.baseText, {
                        fontSize: 14,
                        lineHeight: 28,
                        fontWeight: '600',
                        paddingLeft: 5,
                        textDecorationLine: 'line-through',
                      }]}>
                      {item.price === item.final_price
                        ? ''
                        : '\u20B9' + ' ' + item.price}
                    </Text>
                  </View>
                  {/* <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                  <TouchableOpacity
                    style={{
                      marginLeft: 7,
                      marginRight: 7,
                      borderWidth: 1,
                      borderRadius: 25,
                      padding: 7,
                    }}
                    onPress={async () => {
                      setIsLoading(true);
                      await updateAppointment(
                        {
                          brand_image_url: item.brand_image_url,
                          vendor_id: item.store_brand_id,
                          vendor_name: item.store_brand_name,
                        },
                        '',
                      );
                      setIsLoading(false);
                      navigation.navigate('storevisit', { screen: 'Storevisit' });
                    }}>
                    <VectorImage
                      source={require('../images/store-visit.svg')}
                      style={{ width: 23, height: 23, tintColor: '#000000' }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ borderWidth: 1, borderRadius: 25, padding: 7 }}
                    onPress={async () => {
                      setIsLoading(true);
                      await updateCart(
                        item.productId,
                        item.sku,
                        item.productName,
                        Number(item.final_price.replace(/,/g, '')),
                        item.image_url,
                        1,
                        null,
                        '',
                      );
                      dispatch(GET_CART_DATA());
                      setIsLoading(false);
                      navigation.navigate('cart', { screen: 'Shoppingbag' });
                    }}>
                    <VectorImage
                      source={require('../images/shopping-cart.svg')}
                      style={{ width: 23, height: 23, tintColor: '#000000' }}
                    />
                  </TouchableOpacity>
                </View> */}
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View
          style={{
            padding: 5,
            backgroundColor: '#063374',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View>
            <TouchableOpacity
              style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}
              onPress={() => setFilterModalVisible(true)}>
              <Image source={require('../images/subtract.png')} />
              <Text style={{ color: '#CDAF84', fontSize: 15 }}>
                {' '}
                Apply Filter
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{ flexDirection: 'row', padding: 5, alignItems: 'center' }}
              onPress={()=> setSortModalVisible(true)}>
              <Image source={require('../images/subtract.png')} />
              <Text style={{ color: '#CDAF84', fontSize: 15 }}> Sort By</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <Text>{JSON.stringify(itemList)}</Text> */}
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseText: {
    color: '#212529',
    fontFamily: 'Montserrat'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ListPageByCategoryNamesScreen;


/*
{
  "product_data":[
    {
        "product_id": "47561",
        "sku": "342-KDI14-57",
        "vendor_id": "342",
        "position": 1,
        "bid_organic": "bid"
    },
    {
        "product_id": "45447",
        "sku": "378-AJER024",
        "vendor_id": "378",
        "position": 2,
        "bid_organic": "bid"
    },
  ],
  "category_id":"8",
  "page_type":"category",
  "device":"app",
  "country":"India",
  "region":"Maharashtra",
  "city":"Pune",
  "zip":"401601"
}
*/