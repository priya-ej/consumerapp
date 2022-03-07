import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import Actions from '../../redux/actions';
import StoreKeys from '../../redux/storeKeys';
import margins from '../../styles/margins';
import CartCard from './CartCard';
import CartSubTotal from './CartSubTotal';
import List from '../List';
import Coupon from './Coupon';
import HeadingText from '../HeadingText/HeadingText';
import EjCashComponent from './EjCash';

const Styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  listContainer: {
    minHeight: margins.h115,
    maxHeight: margins.h200,
    // backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 5,
    marginBottom: 10,
  },
});

const OrderSummary = () => {
  const cart = useSelector(
    state =>
    state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA]?.data?.list?.Items,
  );

  const renderItem = useCallback(({item}) => {
    return <CartCard cart={item} />;
  }, []);
  return (
    <View style={Styles.container}>
      <HeadingText text="Order Summary" />
      <View style={Styles.listContainer}>
        <List data={cart} renderItem={renderItem} />
      </View>
      <Coupon />
      <EjCashComponent />
      <CartSubTotal />
    </View>
  );
};

export default OrderSummary;
