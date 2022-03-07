import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isLoggedIn, accesstocken, logout} from '../api/auth';
import {pathSettings} from '../api/pathSettings';
//import { GlobalVariable } from './GlobalVariable';

const saveAppointmentToAsync = async items => {
  try {
    await AsyncStorage.setItem('appointmentdata', JSON.stringify(items));
  } catch (e) {
    console.log(e);
  }
};

const getAppointmentData = async () => {
  //const isLogin = await isLoggedIn();
  //if (isLogin) {
  //    const t_data = await getServerCartData();
  //    return t_data;
  //}else{
  const t_data = await getAsyncAppointmentData();
  //console.log(t_data);
  return t_data;
  //}
};

const getAsyncAppointmentData = async () => {
  const cart_items = await AsyncStorage.getItem('appointmentdata').then(
    value => {
      if (value === null) {return [];}
      return JSON.parse(value);
    },
  );

  return cart_items;
};

const getVendorLocation = async vendorid => {
  try {
    //const token = await accesstocken();
    const t_path = pathSettings.getVendorAddress;

    let response = await fetch(t_path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendor_id: vendorid,
      })
    });
    let resJson = await response.json();
    //console.log(resJson);

    return resJson.data.city_address;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const addAppointmentGuest = async data => {
  //console.log(data);

  try {
    //const token = await accesstocken();
    const t_path = pathSettings.addAppointmentGuestCustomer;

    let response = await fetch(t_path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        brand_image_url: data.brand_image_url,
        city: data.city,
        location: data.location,
        mobile: data.mobile,
        vendor_id: data.vendor_id,
        vendor_name: data.vendor_name
      })
    });
    let resJson = await response.json();
    console.log(resJson);
    await updateAppointment({vendor_id: data.vendor_id}, 'remove');
    //return resJson.data.city_address;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const updateAppointment = async (data, action) => {
  let appointmentData = await getAsyncAppointmentData();
  //console.log(data);
  /*
    const data_json = {
        appointment_date: null, //"2021-10-05"
        appointment_time: null, //"1:26 PM"
        brand_image_url: data.brand_image_url, // "https://image.ejohri.com/vendor/266/v-logo-1593591400133.jpg"
        city: data.store_brand_city,  // "Lucknow"
        location: null, // "328/21/001, Old Subzi Mandi Chowk, In Gol Darwaza, Lucknow - 226003"
        mobile: null, // "8700371480"
        vendor_id: data.vendor_id, // "266"
        vendor_name: data.store_brand_name, // "Jagat Narayan Jewels"
    };
    */

  if (action === 'remove') {
    const t_val = appointmentData.filter(
      item => item.vendor_id !== data.vendor_id,
    );
    saveAppointmentToAsync(t_val);
    return t_val;
  } else {
    let f_sku = appointmentData.find(val => val.vendor_id === data.vendor_id);

    if (f_sku === undefined) {
      let vendorLocation = await getVendorLocation(data.vendor_id);
      let data_json = [];
      vendorLocation.forEach(element => {
        data_json.push({
          appointment_date: null,
          appointment_time: null,
          brand_image_url: data.brand_image_url,
          city: element.city,
          location: element.address,
          mobile: null,
          vendor_id: data.vendor_id,
          vendor_name: data.vendor_name,
        });
      });
      //console.log(data_json);
      const t_val = [...appointmentData, ...data_json];

      saveAppointmentToAsync(t_val);

      return t_val;
    }
  }
};

export {
  getAppointmentData, 
  updateAppointment, 
  addAppointmentGuest
}

