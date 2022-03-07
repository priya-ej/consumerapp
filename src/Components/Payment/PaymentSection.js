import React from 'react';
import {View,Text} from 'react-native';
import {useSelector} from 'react-redux';
import Actions from '../../redux/actions';
import StoreKeys from '../../redux/storeKeys';
import HeadingText from '../HeadingText/HeadingText';
import ShippingMethodsComponent from '../ShippingMethods/ShippingMethodsComponent';
import PaymentComponent from './PaymentComponent';

const PaymentSection = () => {
  const shouldShowPaymentModal = useSelector(
    state =>
      !!state[Actions.USER.KEY][StoreKeys.USER.SELECTED_SHIPPING_METHOD_CODE],
  );
  return (
    <View>
      <HeadingText text="Make Payment" />
      <ShippingMethodsComponent />
      {shouldShowPaymentModal && <PaymentComponent />}
    </View>
  );
};

export default PaymentSection;
