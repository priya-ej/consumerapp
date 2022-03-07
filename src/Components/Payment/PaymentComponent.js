import React, { useCallback, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { PAYMENT_METHODS } from '../../constants/commonConstants';
import Actions from '../../redux/actions';
import {
  PLACE_ORDER,
  Save_Razorpay_order_details,
  VERIFY_RAZORPAY_ORDER,
} from '../../redux/DispatcherFunctions/UserDispatchers';
import StoreKeys from '../../redux/storeKeys';
import RazorpayCheckout from 'react-native-razorpay';
import config from '../../config/config';

const Styles = {
  button: {
    backgroundColor: '#063374',
    width: '70%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  buttonText: { color: '#fff' },
  container: {
    marginTop: 20,
  },
};

const PaymentComponent = () => {
  const dispatch = useDispatch();

  const [
    shouldShowPaymentModal,
    paymentMethodsData,
    orderData,
    razorPayOrderData,
    cartData,
  ] = useSelector(state => {
    return [
      !!state[Actions.USER.KEY][StoreKeys.USER.SELECTED_SHIPPING_METHOD_CODE],
      state[Actions.USER.KEY][StoreKeys.USER.AVAILABLE_PAYMENT_METHODS],
      state[Actions.USER.KEY][StoreKeys.USER.ORDER_DETAILS],
      state[Actions.USER.KEY][StoreKeys.USER.RAZORPAY_ORDER_DETAILS],
      state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA],
    ];
  });
  const isCodAvailable = (paymentMethodsData ?.payment_methods || []).some(
    item => item ?.code === PAYMENT_METHODS.CASH_ON_DELIVERY.CODE,
  );

  const isRazorpayAvailable = (paymentMethodsData ?.payment_methods || []).some(
    item => item ?.code === PAYMENT_METHODS.RAZORPAY.CODE,
  );

  const payByCod = useCallback(() => {
    try {
      dispatch(PLACE_ORDER(PAYMENT_METHODS.CASH_ON_DELIVERY));
    } catch (err) {
      console.log('PaymentComponent.js => PLACE_ORDER :', err);
      Alert.alert('Some Thing Went Wrong \nPlease Try Again');
    }
  }, [dispatch]);

  const payUsingRazorpay = useCallback(() => {
    try {
      dispatch(PLACE_ORDER(PAYMENT_METHODS.RAZORPAY))
    } catch (err) {
      console.log('PaymentComponent.js => PLACE_ORDER :', err);
      Alert.alert('Some Thing Went Wrong \nPlease Try Again');
    }
  }, [dispatch]);

  const { email, telephone, firstname, lastname } =
    cartData ?.data ?.list ?.shipping_address || {};

  const { amount, id: rzpOrderId } = razorPayOrderData || {};
  const startPayment = async () => {
    // https://razorpay.com/docs/payments/payments/test-card-upi-details/
    console.log('order_id : ', rzpOrderId);
    try {
      const options = {
        description: 'Ejohri Product Order',
        image: 'https://i.ibb.co/RjvFSYB/ezgif-com-gif-maker.png',
        currency: 'INR',
        key: config.RAZORPAY_API_KEY,
        amount,
        name: 'Ejohri',
        order_id: rzpOrderId,
        prefill: {
          email,
          contact: telephone,
          name: `${firstname} ${lastname}`,
        },
        theme: { color: '#CDAF84' },
        notes: { 
          address: cartData ?.data ?.list ?.shipping_address, 
          order_id: orderData.order_no 
        },
      };
      console.log('Fetching Payment', options);
      console.log('order_noa: ', orderData.order_no);
      const data = await RazorpayCheckout.open(options);
      console.log('Payment Successful', data);
      dispatch(VERIFY_RAZORPAY_ORDER(data));
    } catch (err) {
      console.log('Payment Error: ', err);
      console.log('order_no: ', orderData.order_no);
      if (err.code == 2) {
        //console.log('xx');
        //console.log(razorPayOrderData);
        dispatch(Save_Razorpay_order_details(null));
        // dispatch({
        //   type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_RAZORPAY_ORDER_DETAILS}`,
        //   data: null,
        // });
      }
    }
  };

  useEffect(() => {
    if (razorPayOrderData) {
      startPayment();
    }
  }, [razorPayOrderData]);

  return (
    <View style={Styles.container}>
      {isCodAvailable && (
        <Button onPress={payByCod} style={Styles.button}>
          <Text style={Styles.buttonText}>Pay On Delivery</Text>
        </Button>
      )}
      {isRazorpayAvailable && !razorPayOrderData && (
        <Button onPress={payUsingRazorpay} style={Styles.button}>
          <Text style={Styles.buttonText}>Pay Using Razorpay</Text>
        </Button>
      )}
      {/* {razorPayOrderData && (
        <Button onPress={startPayment} style={Styles.button}>
          <Text style={Styles.buttonText}>Pay Now</Text>
        </Button>
      )} */}
    </View>
  );
};

export default PaymentComponent;
