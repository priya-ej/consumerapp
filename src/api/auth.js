import React from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pathSettings} from './pathSettings';
import {tsParenthesizedType} from '@babel/types';

const login = async credentials => {
  try {
    let response = await fetch(pathSettings.login, {
      method: 'POST',
      headers: {
        //'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'User-Agent': '*'
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    console.log('data recieved after login0', response);
    let resJson = await response.json();
    console.log('data recieved after login', JSON.stringify(resJson));

    if (resJson.code === 'OK') {
      await AsyncStorage.setItem(
        'ej_store',
        JSON.stringify({
          user: resJson.data,
          mobileApp: {
            hideHeader: true,
          },
        }),
      );
      return '';
    } else {
      return resJson.message;
    }
  } catch (error) {
    //Clipboard.setString(JSON.stringify(error));
    //Alert.alert(JSON.stringify(error));
    //return JSON.stringify(error)+'  xyz';
    return 'Network Problem Try Again';
  }
};

const signup = async data => {
  const sendData = {
    customer: {
      lastname: data.lastname,
      firstname: data.firstname,
      email: data.email,
      custom_attributes: {
        moblie: data.moblie,
      },
      addresses: [
        {
          defaultBilling: true,
          defaultShipping: true,
          firstname: data.firstname,
          lastname: data.lastname,

          region: {
            regionCode: '',
            regionId: 0,
            region: '',
          },

          countryId: data.countryId,

          postcode: '',
          city: '',
          street: [],
          telephone: '',
        },
      ],
    },
    password: data.password,
  };
  
  //console.log(pathSettings.createAccounts);
  //console.log(sendData);

  try {
    let response = await fetch(pathSettings.createAccounts, {
      method: 'POST',
      headers: {
        //'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'User-Agent': '*'
      },
      body: JSON.stringify(sendData)
    });

    let resJson = await response.json();
    console.log(JSON.stringify(resJson));

    if (resJson.code === 'OK') {
        await AsyncStorage.setItem('ej_store', JSON.stringify({
            user: resJson.data,
            mobileApp:{
                hideHeader: true
            }
        }));
        return '';
    } else {
        return resJson.message;
    }
    return '';
  } catch (error) {
    console.log(error);
    return 'Network Problem Try Again';
  }
};

const isLoggedIn = async () => {
  const tok = await AsyncStorage.getItem('ej_store');
  //console.log(tok);
  //console.log(!!tok);
  return !!tok;
};

const logout = () => {
  return AsyncStorage.removeItem('ej_store');
};

const accesstocken = async () => {
  const value = await AsyncStorage.getItem('ej_store');
  if (value !== null) {
    return JSON.parse(value).user.token;
  } else {
    return '';
  }
};

const GetUserName = async () => {
  const value = await AsyncStorage.getItem('ej_store');
  if (value !== null) {
    return JSON.parse(value).user.list[0].name;
  } else {
    return '';
  }
};

const GetLoginKeyValue = async () => {
  const value = await AsyncStorage.getItem('ej_store');
  if (value !== null) {
    return value;
  } else {
    return '';
  }
};

export {
  login,
  signup,
  isLoggedIn,
  logout,
  accesstocken,
  GetUserName,
  GetLoginKeyValue,
};
