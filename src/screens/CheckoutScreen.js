/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {GET_CART_DATA} from '../redux/DispatcherFunctions/CartDispatchers';
import {CLEAR_ALL_ORDER_DETAILS, GET_ALL_ADDRESSES} from '../redux/DispatcherFunctions/UserDispatchers';
import AddressList from '../Components/AddressList/AddressList';
import PaymentSection from '../Components/Payment/PaymentSection';
import OrderSummary from '../Components/OrderSummary/OrderSummaryComponent';
import Actions from '../redux/actions';
import StoreKeys from '../redux/storeKeys';
import margins from '../styles/margins';
import {ORDER_STATUS} from '../constants/commonConstants';

const SCREENS = [
  {name: 'Order Summary', Comp: OrderSummary},
  {name: 'Select Delivery Address', Comp: AddressList},
  {name: 'Payment', Comp: PaymentSection},
];

const Styles = StyleSheet.create({
  container: {flex: 1, padding: 10, height: margins.h44, backgroundColor:'#FFFFFF'},
  sectionContainer: {
    paddingVertical: 5,
  },
  head: {
    paddingBottom: 10,
    borderBottomColor: '#cdb083',
    borderBottomWidth: 2,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontFamily:'Montserrat',
    fontWeight: '600',
    fontSize: 14,
    lineHeight:17,
    color:'#212529',
    textTransform: 'uppercase',
  },
});

function CheckoutScreen(props) {
  const dispatch = useDispatch();
  const [currentSection, updateCurrentSection] = useState(SCREENS[0]);


  useFocusEffect(
    React.useCallback(() => {
      dispatch(CLEAR_ALL_ORDER_DETAILS());
      updateCurrentSection(SCREENS[0]);
      dispatch(GET_CART_DATA());
      dispatch(GET_ALL_ADDRESSES());
      return () => {
        console.log('Closed Screen ******:');
      };
    }, [dispatch])
  );
/*
  useEffect(() => {
    //const unsubscribe = props.navigation.addListener('focus', () => {
      console.log('call useEffect -----=>');
      //dispatch(CLEAR_ALL_ORDER_DETAILS());
      //updateCurrentSection(SCREENS[0]);
      dispatch(GET_CART_DATA());
      dispatch(GET_ALL_ADDRESSES());
    //});

    //return unsubscribe;
  }, [dispatch]);
*/

  const changeCurrentSection = useCallback(
    sectionIdx =>
      updateCurrentSection(
        SCREENS[sectionIdx].name === currentSection.name
          ? {}
          : SCREENS[sectionIdx],
      ),
    [currentSection],
  );

  const [shippingMethods, orderStatus] = useSelector(state => [
    state[Actions.USER.KEY][StoreKeys.USER.SHIPPING_METHODS],
    state[Actions.USER.KEY][StoreKeys.USER.ORDER_STATUS],
  ]);

  useEffect(() => {
    console.log('status*****: ', orderStatus);
    if (orderStatus === ORDER_STATUS.SUCCESS) {
      props.navigation.replace('PaymentSuccess');
    }
  }, [orderStatus, props.navigation]);

  useEffect(() => {
    if (shippingMethods.length) {
      updateCurrentSection(SCREENS[2]);
    }
  }, [shippingMethods]);

  return (
    <View style={Styles.container}>
      {/* <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('login', {
            screen: 'Login',
            params: { navigatePage: 'checkout' },
          });
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity> */}
    <ScrollView 
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {SCREENS.map(({name, Comp}, idx) => (
        <View key={`Section_${name}_${idx}`} style={Styles.sectionContainer}>
          <View style={Styles.head}>
            <Pressable onPress={() => changeCurrentSection(idx)}>
              <View style={Styles.textContainer}>
                <View>
                  <Text style={Styles.text}>{name}</Text>
                </View>
                <View
                  style={[
                    style.triangle,
                    currentSection.name === name
                      ? {transform: [{rotate: '180deg'}]}
                      : '',
                  ]}
                />
              </View>
            </Pressable>
          </View>
          <View style={[currentSection.name === name ? '' : {display: 'none'}]}>
            <Comp {...props} />
          </View>
        </View>
      ))}
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 11,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#cdb083',
  },
});

export default CheckoutScreen;
