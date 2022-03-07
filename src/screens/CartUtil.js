import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isLoggedIn, accesstocken, logout} from '../api/auth';
import {pathSettings} from '../api/pathSettings';
//import {GlobalVariable} from './GlobalVariable';
import {updateProductQtyInCart} from '../api/apis';
import {BLANK_CART_DATA} from '../redux/DispatcherFunctions/CartDispatchers';
import {CART_BADGE} from '../redux/DispatcherFunctions/LayoutDispatchers';

//import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../redux/store';

const saveCartToAsync = async items => {
  //const { setCartBadgecount } = React.useContext(GlobalVariable);
  try {
    //console.log('cart_badge_count', items.length);
    //setCartBadgecount(items.length);

    await AsyncStorage.setItem('cartdata', JSON.stringify(items));
  } catch (e) {
    console.log('CartUtil -> saveCartToAsync() -> Error: ', e);
  }
};

const moveAsyncToServer = async () => {
  let shoppingbagData = await getAsyncCartData();

  await AddToCartOnServer(shoppingbagData);
  AsyncStorage.removeItem('cartdata');

  //const t_data = await getServerCartData();
  //return t_data;
  //return true;
};

const AddToCartOnServer = async items => {
  try {
    console.log('Cart Data L : ', items);

    const token = await accesstocken();
    console.log('Access Token .:', token);
    const createCart_path = pathSettings.createCart;
    const addToCart_path = pathSettings.addToCart;

    let response1 = await fetch(createCart_path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    let resJson1 = await response1.json();
    if (resJson1.code === 'UNAUTHORIZED') {
      logout();
    }
    
    console.log(resJson1);
    const quote_id = resJson1.data.quote_id;

    items.forEach(async item => {
      let response2 = await fetch(addToCart_path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          cartItem: {
            sku: item.sku,
            qty: item.product_qty,
            quote_id: quote_id,
          },
        }),
      });

      let resJson2 = await response2.json();

      //console.log('Move local to server: ',resJson2);
    });
    console.log("Finish Move ------------- ");
    //console.log(resJson2);
  } catch (error) {
    console.log('CartUtil.js -> AddToCartOnServer() -> Error: ', error);
  }
};

const RemoveCartItemFromServer = async item_id => {
  //console.log('item_id: '+item_id);
  try {
    const token = await accesstocken();

    const addToCart_path = pathSettings.addToCart;

    let response = await fetch(addToCart_path + '/' + item_id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    let resJson = await response.json();
    //console.log(resJson);
    //return resJson.data.list.Items;

    const t_data = resJson?.data?.list?.Items || [];
    store.dispatch(CART_BADGE(t_data.length));

    return t_data;
  } catch (error) {
    console.log(error);
  }
};

const getServerCartData = async () => {
  try {
    const token = await accesstocken();

    const createCart_path = pathSettings.createCart;

    let response = await fetch(createCart_path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    let resJson = await response.json();
    if (resJson.code === 'UNAUTHORIZED') {
      logout();
      return [];
    }
    console.log(resJson);

    const t_data = resJson?.data?.list?.Items || [];
    store.dispatch(CART_BADGE(t_data.length));
    return t_data;
  } catch (error) {
    console.log(error);
  }
};

const getAsyncCartData = async () => {
  const cart_items = await AsyncStorage.getItem('cartdata')
    .then(value => {
      if (value === null) {
        store.dispatch(CART_BADGE(0));
        return [];
      }
      const t_data = JSON.parse(value);
      store.dispatch(CART_BADGE(t_data.length));
      return t_data;
    })
    .catch(err => {
      console.log('CartUtil -> Error in Parsing Cart Data', err);
      return [];
    });

  return cart_items;
};

const getCartData = async () => {
  const isLogin = await isLoggedIn();
  if (isLogin) {
    const t_data = await getServerCartData();
    return t_data;
  } else {
    const t_data = await getAsyncCartData();
    //console.log(t_data);
    return t_data;
  }
};

const updateCart = async (
  productId,
  sku,
  productName,
  final_price,
  image,
  qty,
  item_id,
  action,
) => {
  try {
    const isLogin = await isLoggedIn();
    if (isLogin) {
      console.log('server');
      if (action === 'remove') {
        const t_data = await RemoveCartItemFromServer(item_id);

        //store.dispatch(CART_BADGE(t_data.length));
        return t_data;

      } else {
        await AddToCartOnServer([{sku: sku, product_qty: qty}]);
        const t_data = await getServerCartData();
        //console.log('CartUtil.js -> updateCart() -> Info: ', t_data);
        store.dispatch(CART_BADGE(t_data.length));
        return t_data;
      }
    } else {
      let shoppingbagData = await getAsyncCartData();
      //console.log(shoppingbagData);

      const cartdata_json = {
        sku: sku,
        productName: productName,
        price: final_price,
        image: image,
        product_qty: qty,
        item_id: item_id,
      };

      if (action === 'remove') {
        const t_val = shoppingbagData.filter(item => item.sku !== sku);
        saveCartToAsync(t_val);

        store.dispatch(CART_BADGE(t_val.length));
        return t_val;
      } else {
        let f_sku = shoppingbagData.find(val => val.sku === sku);

        if (f_sku === undefined) {
          const t_val = [...shoppingbagData, cartdata_json];
          saveCartToAsync(t_val);

          store.dispatch(CART_BADGE(t_val.length));
          return t_val;
        } else {
          if (action === 'updqty') {
            let t_val = [...shoppingbagData];
            let objIndex = t_val.findIndex(item => item.sku === sku);
            let t_qty = Number(t_val[objIndex].product_qty) + qty;
            t_val[objIndex].product_qty = t_qty <= 1 ? 1 : t_qty;

            saveCartToAsync(t_val);

            store.dispatch(CART_BADGE(t_val.length));
            return t_val;
          }
        }
      }
    }
  } catch (err) {
    console.log('CartUtil.js -> AddToCartOnServer() -> Error: ', err);
  }
};

const increaseProdouctQtyInCart = async (item, inc) => {
  try {
    const isLogin = await isLoggedIn();
    if (!item.qty) {
      item.qty = item.product_qty;
    }
    if (isLogin) {
      await updateProductQtyInCart(item?.sku, item?.qty + 1, item?.item_id);
      const t_data = await getServerCartData();
      console.log('CartUtil.js -> updateCart() -> Info: ', t_data);
      return t_data;
    } else {
      let shoppingbagData = await getAsyncCartData();
      //console.log(shoppingbagData);
      let product = shoppingbagData.find(val => val.sku === item?.sku);

      const cartdata_json = {
        sku: item?.sku,
        productName: item?.productName,
        price: item?.final_price,
        image: item?.image,
        product_qty: item?.qty || 1,
        item_id: item?.item_id,
      };

      if (product === undefined) {
        const t_val = [...shoppingbagData, cartdata_json];
        saveCartToAsync(t_val);
        return t_val;
      } else {
        let t_val = [...shoppingbagData];
        let objIndex = t_val.findIndex(item2 => item2.sku === item?.sku);
        let t_qty = Number(t_val[objIndex].product_qty) + 1;
        t_val[objIndex].product_qty = t_qty <= 1 ? 1 : t_qty;

        saveCartToAsync(t_val);
        return t_val;
      }
    }
  } catch (err) {
    console.log('CartUtil.js -> AddToCartOnServer() -> Error: ', err);
  }
};

const decreaseProdouctQtyInCart = async (item, inc) => {
  try {
    const isLogin = await isLoggedIn();
    if (!item.qty) {
      item.qty = item.product_qty;
    }
    if (isLogin) {
      await updateProductQtyInCart(item?.sku, item?.qty - 1, item?.item_id);
      const t_data = await getServerCartData();
      console.log('CartUtil.js -> updateCart() -> Info: ', t_data);
      return t_data;
    } else {
      let shoppingbagData = await getAsyncCartData();
      //console.log(shoppingbagData);
      let product = shoppingbagData.find(val => val.sku === item?.sku);

      const cartdata_json = {
        sku: item?.sku,
        productName: item?.productName,
        price: item?.final_price,
        image: item?.image,
        product_qty: item?.qty || 1,
        item_id: item?.item_id,
      };

      if (product === undefined) {
        const t_val = [...shoppingbagData, cartdata_json];
        saveCartToAsync(t_val);
        return t_val;
      } else {
        let t_val = [...shoppingbagData];
        let objIndex = t_val.findIndex(item2 => item2.sku === item?.sku);
        let t_qty = Number(t_val[objIndex].product_qty) - 1;
        t_val[objIndex].product_qty = t_qty <= 1 ? 1 : t_qty;
        saveCartToAsync(t_val);
        return t_val;
      }
    }
  } catch (err) {
    console.log('CartUtil.js -> AddToCartOnServer() -> Error: ', err);
  }
};

const checkOut = async navigation => {
  const isLogin = await isLoggedIn();
  store.dispatch(BLANK_CART_DATA());

  if (isLogin) {
    navigation.navigate('checkout', {screen: 'Checkout'});
  } else {
    navigation.navigate('login', {
      screen: 'Login',
      params: {navigatePage: 'checkout'},
    });
  }
};

export {
  //saveCartToAsync,
  getCartData,
  getAsyncCartData,
  moveAsyncToServer,
  updateCart,
  checkOut,
  increaseProdouctQtyInCart,
  decreaseProdouctQtyInCart,
};
