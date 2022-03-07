import React, {useCallback, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {CLEAR_ALL_ORDER_DETAILS} from '../redux/DispatcherFunctions/UserDispatchers';
import {CART_BADGE} from '../redux/DispatcherFunctions/LayoutDispatchers';
import Actions from '../redux/actions';
import StoreKeys from '../redux/storeKeys';
import HeadingText from '../Components/HeadingText/HeadingText';
import FieldValueRow from '../Components/FieldValueRow/FieldValueRow';
import {getPriceToDisplay} from '../Util/Functions';
import CartCard from '../Components/OrderSummary/CartCard';
import List from '../Components/List';

const Styles = StyleSheet.create({
  fieldContainer: {
    paddingHorizontal: 10,
  },
  addressWrapper: {
    paddingHorizontal: 10,
  },
  addressStyle: {
    display: 'flex',
    marginTop: 0,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
});

const PaymentConfirmationScreen = ({route, navigation}) => {
  const dispatch = useDispatch();

  const [orderData, razorPayOrderData, userAddressDetails] = useSelector(
    state => [
      state[Actions.USER.KEY][StoreKeys.USER.ORDER_DETAILS],
      state[Actions.USER.KEY][StoreKeys.USER.RAZORPAY_ORDER_DETAILS],
      state[Actions.USER.KEY][StoreKeys.USER.ORDERED_ITEMS],
    ],
  );
  
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      dispatch(CART_BADGE(0));

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        dispatch(CLEAR_ALL_ORDER_DETAILS());
      };
    }, [])
  );

  const renderItem = useCallback(({item}) => {
    return <CartCard cart={item} />;
  }, []);

  return (
    <View>
      <View>
        <HeadingText text="Order Successful" />
      </View>
      <View style={Styles.fieldContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('home')}>
          <Text style={{paddingVertical:8, fontFamily:'Montserrat', fontSize:14, color:'#3985ff'}}>Navigate Back To Home</Text>
        </TouchableOpacity>
        <FieldValueRow name={'Order Number'} value={orderData?.order_no} />
        <FieldValueRow
          name={'Amount'}
          value={getPriceToDisplay(userAddressDetails?.data?.list?.grand_total)}
        />
        {razorPayOrderData && (
          <FieldValueRow
            name={'Receipt Id'}
            value={razorPayOrderData?.receipt}
          />
        )}
      </View>

      <HeadingText text="Ordered Items" />
      <View>
        <List
          data={userAddressDetails?.data?.list?.Items}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default PaymentConfirmationScreen;
