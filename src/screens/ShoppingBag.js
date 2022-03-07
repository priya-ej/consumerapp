import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import SmartLoader from './SmartLoader';
import {
  getCartData,
  updateCart,
  checkOut,
  increaseProdouctQtyInCart,
  decreaseProdouctQtyInCart,
} from './CartUtil';
import {GlobalVariable} from './GlobalVariable';

const PageWidth = Dimensions.get('window').width;
const Styles = StyleSheet.create({
  navigate: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#063374',
  },
  subtotalItem: {
    fontFamily:'Montserrat',
    color: '#063374', 
    fontSize: 12,
    lineHeight:18,
    fontWeight:'400'
  },
  border: {borderTopWidth: 1, borderTopColor: '#e0e0e0'},
  subtotal: {
    paddingLeft: 15,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numWrapper: {
    fontFamily:'Montserrat',
    color: '#000000',
    fontSize: 16,
    lineHeight:24,
    fontWeight: '600',
  },
  img: {resizeMode: 'contain', width: '100%', height: 80},
  flex: {flex: 1},
  flexRow: {flexDirection: 'row'},
  headText: {
    fontFamily:'Montserrat',
    color: '#063374', 
    fontSize: 19,
    lineHeight:24, 
    fontWeight: '600'
  },
  imageContainer: {
    minWidth: (PageWidth / 100) * 30,
    justifyContent: 'center',
  },
  s1: {
    padding: 7,
    paddingLeft: 14,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: '#bdbdbd',
  },
  textStyle: {
    fontFamily:'Montserrat',
    fontSize: 10,
    lineHeight:15,
    fontWeight:'400',
    color: '#063374',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  h1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D8DC',
  },
  back: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  product: {
    margin: 10,
    marginTop: 0,
    padding: 10,
    shadowColor: '#470000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    elevation: 1,
  },
  productName: {
    flex: 1,
    flexWrap: 'wrap',
    fontFamily:'Montserrat',
    fontSize: 14,
    lineHeight:21,
    color: '#000000',
  },
  p10: {padding: 10},
  p15: {padding: 15},
});

function ShoppingBag({navigation}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [shoppingbagData, setShoppingbagData] = React.useState([]);
  //const {setCartBadgecount} = React.useContext(GlobalVariable);

  const itemSubtotal = shoppingbagData.reduce(
    (total, element) =>
      (total +=
        Math.trunc(element.price.toString().replace(/,/g, '')) *
        element.product_qty),
    0,
  );

  async function getAsyncCartData() {
    let t_data = await getCartData();
    //setCartBadgecount(t_data.length);
    setShoppingbagData(t_data);    
  }

  useFocusEffect(
    React.useCallback(async() => {
      // Do something when the screen is focused
      setIsLoading(true);
      await getAsyncCartData();
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
    <View style={Styles.container}>
      <SmartLoader isLoading={isLoading} />
      <View style={Styles.flex}>
        <View style={Styles.h1}>
          <View style={Styles.p10}>
            <Text style={Styles.headText}>
              Shopping Bag ({shoppingbagData.length} item)
            </Text>
          </View>
          <View style={{padding: 5}}>
            <TouchableOpacity
              style={Styles.back}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{...Styles.flex, ...Styles.p10}}>
          <FlatList
            data={shoppingbagData}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <View style={Styles.product}>
                <View style={Styles.flexRow}>
                  <View style={Styles.imageContainer}>
                    <Image source={{uri: item.image}} style={Styles.img} />
                  </View>
                  <View style={Styles.flex}>
                    <View style={Styles.flexRow}>
                      <Text style={Styles.productName}>{item.productName}</Text>
                    </View>
                    <View style={Styles.p15}>
                      <Text style={Styles.numWrapper}>
                        {'\u20B9'}{' '}
                        {Math.trunc(
                          Number(item.price.toString().replace(/,/g, '')),
                        )}{' '}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <View>
                        <TouchableOpacity
                          style={Styles.s1}
                          onPress={async () => {
                            setIsLoading(true);
                            const t_data = await decreaseProdouctQtyInCart(
                              item,
                            );
                            setShoppingbagData(t_data);
                            setIsLoading(false);
                          }}>
                          <Text style={{color:'#212529', fontFamily:'Montserrat', fontSize:14, lineHeight:18 , fontWeight:'400'}}>-</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={Styles.s1}>
                        <Text style={{color:'#212529', fontFamily:'Montserrat', fontSize:12, lineHeight:18 , fontWeight:'600'}}>{item.product_qty}</Text>
                      </View>
                      <View>
                        <TouchableOpacity
                          style={Styles.s1}
                          onPress={async () => {
                            setIsLoading(true);
                            const t_data = await increaseProdouctQtyInCart(
                              item,
                            );
                            setShoppingbagData(t_data);
                            setIsLoading(false);
                          }}>
                          <Text style={{color:'#212529', fontFamily:'Montserrat', fontSize:14, lineHeight:18 , fontWeight:'400'}}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <View>
                    <TouchableOpacity
                      onPress={async () => {
                        setIsLoading(true);
                        const t_data = await updateCart(
                          null,
                          item.sku,
                          null,
                          null,
                          null,
                          null,
                          item.item_id,
                          'remove',
                        );
                        //setCartBadgecount(t_data.length);
                        setShoppingbagData(t_data);
                        setIsLoading(false);
                      }}>
                      <Text style={Styles.textStyle}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{paddingLeft: 10, paddingRight: 10}}>
                    <TouchableOpacity>
                      <Text style={Styles.textStyle}>Move To Wishlist</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity>
                      <Text style={Styles.textStyle}>Move To Store Visit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
      <View style={Styles.border}>
        <View style={Styles.subtotal}>
          <View>
            <Text style={Styles.subtotalItem}>
              SUBTOTAL ({shoppingbagData.length} Item):
            </Text>
          </View>
          <View style={{paddingRight:5}}>
            <Text style={{
              color: '#063374',
              fontFamily:'Montserrat',
              fontSize: 14,
              lineHeight:21,
              fontWeight:'700'
              }}>
              {'\u20B9'} {itemSubtotal}{' '}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={{flex: 1, padding: 15}}>
            <TouchableOpacity
              style={Styles.navigate}
              onPress={() => {
                navigation.navigate('cart', {screen: 'Cart'});
              }}>
              <Text style={{
                color: '#ffffff',
                fontFamily:'Montserrat',
                fontSize: 13,
                lineHeight:18,
                fontWeight:'500'
              }}>VIEW CART</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, padding: 15}}>
            <TouchableOpacity
              style={{
                padding: 10,
                alignItems: 'center',
                backgroundColor: '#CDAF84',
              }}
              onPress={async () => {
                checkOut(navigation);
              }}>
              <Text style={{
                color: '#ffffff',
                fontFamily:'Montserrat',
                fontSize: 13,
                lineHeight:18,
                fontWeight:'500'
              }}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}


const style= StyleSheet.create({
  baseText:{
      color: '#212529',
      fontFamily:'Montserrat'   
  }
})

export default ShoppingBag;
