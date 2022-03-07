import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCartData} from '../screens/CartUtil';

const getLocalStorageDataFromAsyncStorage = async () => {
  const localStorageData = await AsyncStorage.getItem('ej_store').then(
    JSON.parse,
  );
  const cartData = await getCartData().then(data =>
    typeof data === 'string' ? JSON.parse(data) : data,
  );
  localStorageData.CART_NEW = {list: {Items: cartData}};

  if (localStorageData === null) {
    return '';
  } else {
    return JSON.stringify(localStorageData);
  }
};

const getLocalStorageString = (localStorageData = '') => `
  console.log('Setting Data Into Local Storage');
  window.localStorage.setItem('ej_store', \`${localStorageData}\`); 
  console.log('Data Successfully Set To Local Storage',window.localStorage.getItem('ej_store'));
  `;

const getPriceToDisplay = (arg = '') => {
  try {
    const price = typeof arg === 'string' ? arg : `${arg}`;
    if (!price.length) {
      return '';
    }
    const finalPrice = Number.parseFloat(price.split(',').join('')).toFixed(2);
    return new global.Intl.NumberFormat('en-IN').format(finalPrice);
  } catch (err) {
    return arg;
  }
};
export {
  getLocalStorageDataFromAsyncStorage,
  getLocalStorageString,
  getPriceToDisplay,
};
