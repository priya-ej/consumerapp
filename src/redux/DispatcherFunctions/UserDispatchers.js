import {
  addCustomerNewAddress,
  availableCoupon,
  applyCoupon,
  applyEjCash,
  createRazorPayOrder,
  deleteCouponCode,
  getAllAddressesOfUser,
  getPageUrls,
  getShippingMethodsForOrder,
  placeOrder,
  removeAddressesOfUser,
  selectUserAddressForOrder,
  setPaymentVerficationResponse,
  setShippingMethod,
  verifyPaymentViaRazorPay,
} from '../../api/apis';
import Actions from '../actions';
import countriesJson from '../../constants/countries.json';
import StoreKeys from '../storeKeys';
import { ORDER_STATUS, PAYMENT_METHODS } from '../../constants/commonConstants';
import { GET_CART_DATA } from './CartDispatchers';

const COMMON_ACTIONS = {
  SHOW_LOADER: `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.SHOW_LOADER}`,
  HIDE_LOADER: `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.HIDE_LOADER}`,
};

const UTILS = {
  getAddressDataFromState: state => {
    const addressData = (
      state[Actions.USER.KEY][StoreKeys.USER.ADDRESSES] || []
    ).find(
      address =>
        address.address_id ===
        state[Actions.USER.KEY][StoreKeys.USER.SELECTED_ADDRESS_ID_FOR_PAYMENT],
    );

    const selectedCountry = countriesJson.find(
      countryVal => countryVal.value === addressData.country_id,
    );
    const region = selectedCountry ?.regions ?.find(
      i => `${i.id}` === `${addressData.region_id}`,
    );
    return { ...addressData, region };
  },
};

const RESET = () => async dispatch => {
  dispatch({ type: Actions.RESET });
};

const GET_ALL_ADDRESSES = () => async dispatch => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    const actionType = `${Actions.USER.KEY}.${Actions.USER.TYPE.GET_USER_ADDRESSES}`;
    const addressesResponse = await getAllAddressesOfUser();
    if (addressesResponse ?.status !== 200) {
      throw new Error('Invalid Status Code Received');
    }
    dispatch({ type: actionType, data: addressesResponse ?.data ?.address || []});
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    console.log('userDispatcher.js -> GET_ALL_ADDRESSES() -> Error: ', err);
  }
};

const SAVE_ADDRESS = (addressData, navigation) => async dispatch => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    const address = {
      city: addressData.city,
      company: '',
      country_id: addressData.country_id,
      firstname: addressData.firstname,
      lastname: addressData.lastname,
      postcode: addressData.postcode,
      region_id: `${addressData.state}`,
      same_as_billing: 1,
      street: addressData.street,
      telephone: addressData.moblie,
    };

    await addCustomerNewAddress(address);
    const addressesResponse = await getAllAddressesOfUser();
    if (addressesResponse ?.status !== 200) {
      throw new Error('Invalid Status Code Received');
    }
    const actionType = `${Actions.USER.KEY}.${Actions.USER.TYPE.GET_USER_ADDRESSES}`;
    dispatch({ type: actionType, data: addressesResponse ?.data ?.address || []});
    navigation.goBack();
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    console.log('userDispatcher.js -> GET_ALL_ADDRESSES() -> Error: ', err);
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  }
};

const REMOVE_ADDRESS = addressId => async dispatch => {
  dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
  try {
    await removeAddressesOfUser(addressId);
    const actionType = `${Actions.USER.KEY}.${Actions.USER.TYPE.GET_USER_ADDRESSES}`;
    const addressesResponse = await getAllAddressesOfUser();
    if (addressesResponse ?.status !== 200) {
      throw new Error('Invalid Status Code Received');
    }
    dispatch({ type: actionType, data: addressesResponse ?.data ?.address || []});
    //dispatch({type: COMMON_ACTIONS.HIDE_LOADER});
  } catch (err) {
    console.log('userDispatcher.js -> REMOVE_ADDRESS() -> Error: ', err);
    //dispatch({type: COMMON_ACTIONS.HIDE_LOADER});
  }
  dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
};

const SELECT_ADDRESS_FOR_PAYMENT = addressId => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    const addressData = (
      getState()[Actions.USER.KEY][StoreKeys.USER.ADDRESSES] || []
    ).find(address => address.address_id === addressId);

    const selectedCountry = countriesJson.find(
      countryVal => countryVal.value === addressData.country_id,
    );
    const region = selectedCountry ?.regions ?.find(
      i => `${i.id}` === `${addressData.region_id}`,
    );

    console.log(addressId, selectedCountry);

    const addressesResponse = await selectUserAddressForOrder({
      ...addressData,
      region: region.code,
    });
    if (addressesResponse ?.status !== 200) {
      throw new Error(
        'Invalid Status Code Received While Setting Shipping Address',
      );
    }

    const shippingMethods = await getShippingMethodsForOrder(addressData);
    if (shippingMethods ?.status !== 200) {
      throw new Error(
        'Invalid Status Code Received While Fetching Shipping Methods',
      );
    }
    const actionType = `${Actions.USER.KEY}.${Actions.USER.TYPE.SELECT_ADDRESS_AND_SAVE_SHIPPING_METHODS}`;
    dispatch({
      type: actionType,
      addressId,
      shippingMethods: shippingMethods ?.data ?.list,
    });
    if ((shippingMethods ?.data ?.list || []).length) {
      const shippingMethodData = shippingMethods ?.data ?.list[0];
      const response = await setShippingMethod({
        ...addressData,
        region: region.code,
        email:
          getState()[Actions.USER.KEY][StoreKeys.USER.DATA] ?.list[0] ?.email,
        shippingCarrierCode: shippingMethodData.carrier_code,
        shippingMethodCode: shippingMethodData.carrier_methodecode,
      });
      const err = 'Invalid Status Code Received While Setting Shipping Method';
      if (response ?.status !== 200) {
        throw new Error(err);
      }
      dispatch({
        type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_SELECTED_SHIPPING_METHOD_CODE}`,
        data: shippingMethodData.carrier_methodecode,
      });
      dispatch({
        type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_AVAILABLE_PAYMENT_METHODS}`,
        data: response ?.data,
      });
    }
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
    console.log(
      'userDispatcher.js -> SELECT_ADDRESS_FOR_PAYMENT() -> Error: ',
      err,
    );
  }
};

const SELECT_SHIPPING_METHOD =
  shippingMethodData => async (dispatch, getState) => {
    try {
      dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
      const state = getState();
      const { region, ...addressData } = UTILS.getAddressDataFromState(state);
      const response = await setShippingMethod({
        ...addressData,
        region: region.code,
        email: state[Actions.USER.KEY][StoreKeys.USER.DATA] ?.list[0] ?.email,
        shippingCarrierCode: shippingMethodData.carrier_code,
        shippingMethodCode: shippingMethodData.carrier_methodecode,
      });
      if (response ?.status !== 200) {
        throw new Error(
          'Invalid Status Code Received While Setting Shipping Method',
        );
      }

      dispatch({
        type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_SELECTED_SHIPPING_METHOD_CODE}`,
        data: shippingMethodData.carrier_methodecode,
      });
      dispatch({
        type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_AVAILABLE_PAYMENT_METHODS}`,
        data: response ?.data,
      });
      dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
    } catch (err) {
      console.log(
        'userDispatcher.js -> SELECT_ADDRESS_FOR_PAYMENT() -> Error: ',
        err,
      );
    }
  };

const SAVE_USER_DATA = userData => dispatch => {
  try {
    const actionType = `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_USER_DATA}`;
    dispatch({
      type: actionType,
      data: userData,
    });
  } catch (err) {
    console.log(
      'userDispatcher.js -> SELECT_ADDRESS_FOR_PAYMENT() -> Error: ',
      err,
    );
  }
};

const PLACE_ORDER = paymentMethod => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    const state = getState();
    const cart = state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA];

    const data = {
      city: cart ?.data ?.list ?.shipping_address ?.city,
      country_id: cart ?.data ?.list ?.shipping_address ?.country_id,
      email: cart ?.data ?.list ?.shipping_address ?.email,
      firstname: cart ?.data ?.list ?.shipping_address ?.firstname,
      lastname: cart ?.data ?.list ?.shipping_address ?.lastname,
      paymentMethod: paymentMethod.CODE,
      postcode: cart ?.data ?.list ?.shipping_address ?.postcode,
      region: cart ?.data ?.list ?.shipping_address ?.region,
      region_code: cart ?.region_code,
      region_id: cart ?.data ?.list ?.shipping_address.region_id,
      status: null,
      street: [cart ?.data ?.list ?.shipping_address ?.street],
      telephone: cart ?.data ?.list ?.shipping_address ?.telephone,
    };

    if (data.paymentMethod !== PAYMENT_METHODS.CASH_ON_DELIVERY.CODE) {
      data.status = 'pending';
    }
    const orderRes = await placeOrder(data);

    if(orderRes?.status !== 200 ){
      //console.log('$$$$$$$$$$$$$$$$: ', {orderRes, data, cart});
      console.log('$$$$$$$$$$$$$$$$: ', orderRes);
      throw new  Error('Unabled to create order');
    }

    console.log('userDispatcher.js -> PLACE_ORDER() -> Info: Created order');
    dispatch({
      type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_ORDER_DETAILS}`,
      data: orderRes,
    });
    if (data.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY.CODE) {
      // code for COD
      dispatch({
        type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_SUCCESS_ORDER_WITH_DATA}`,
        data: {
          status: ORDER_STATUS.SUCCESS,
          orderItems: cart,
        },
      });
    } else {
      const razorpayOrderRes = await createRazorPayOrder(
        orderRes ?.data ?.order_id || `EJ_ORD_${Math.random()}`,
        Number.parseInt(
          `${cart ?.data ?.list ?.grand_total}`.replace(/,/g, ''),
          10,
        ) * 100,
      );
      console.log(
        'userDispatcher.js -> PLACE_ORDER() -> Info: Created RazorpayOrder',
        razorpayOrderRes,
      );
      dispatch(Save_Razorpay_order_details(razorpayOrderRes));
      // dispatch({
      //   type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_RAZORPAY_ORDER_DETAILS}`,
      //   data: razorpayOrderRes,
      // });
    }

    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
    console.log('userDispatcher.js -> PLACE_ORDER() -> Error: ', err);
  }
};

const Save_Razorpay_order_details = RazorpayOrderDetails => async (dispatch) => {
  console.log('Save Razor details :', RazorpayOrderDetails);
  dispatch({
    type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_RAZORPAY_ORDER_DETAILS}`,
    data: RazorpayOrderDetails,
  });
}

const VERIFY_RAZORPAY_ORDER = paymentDetails => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    const state = getState();
    const cart = state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA];
    const orderId =
      state[Actions.USER.KEY][StoreKeys.USER.ORDER_DETAILS] ?.data ?.order_id;
    const razorPayOrderDetails =
      state[Actions.USER.KEY][StoreKeys.USER.RAZORPAY_ORDER_DETAILS];
    const verificationRes = await verifyPaymentViaRazorPay({
      razorpayOrderId: paymentDetails.razorpay_order_id,
      razorpayPaymentId: paymentDetails.razorpay_payment_id,
      razorpaySignature: paymentDetails.razorpay_signature,
      orderId,
    });

    if (
      verificationRes.status === 200 &&
      verificationRes.message === 'Signature verified'
    ) {
      // success
      const paymentConfirmationRes = await setPaymentVerficationResponse({
        paymentId: paymentDetails.razorpay_payment_id,
        orderId: orderId,
        razorpayOrderId: paymentDetails.razorpay_order_id,
        status: 'success',
      });
      dispatch({
        type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_RAZORPAY_CONFIRMATION_RES}`,
        data: paymentConfirmationRes,
      });
    }
    dispatch({
      type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_SUCCESS_ORDER_WITH_DATA}`,
      data: {
        status: ORDER_STATUS.SUCCESS,
        orderItems: cart,
      },
    });
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
    console.log('userDispatcher.js -> VERIFY_RAZORPAY_ORDER() -> Error: ', err);
  }
};

const CLEAR_ALL_ORDER_DETAILS = () => async dispatch => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });

    dispatch({
      type: `${Actions.USER.KEY}.${Actions.USER.TYPE.CLEAR_ALL_ORDER_DETAILS}`,
    });

    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
    console.log('userDispatcher.js -> VERIFY_RAZORPAY_ORDER() -> Error: ', err);
  }
};

const GET_AND_SAVE_PAGE_TYPES = () => async dispatch => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    const pageTypes = await getPageUrls();
    dispatch({
      type: `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_PAGE_URLS}`,
      data: pageTypes,
    });

    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
    console.log('userDispatcher.js -> VERIFY_RAZORPAY_ORDER() -> Error: ', err);
  }
};

const VALIDATE_COUPON_CODE = coupon => async dispatch => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    await deleteCouponCode();
    const couponResponse = await applyCoupon(coupon);
    console.log(couponResponse);
    if (couponResponse.status === '400') {
      dispatch({
        type: `${[Actions.USER.KEY]}.${[Actions.USER.TYPE.SAVE_COUPON_CODE]}`,
        data: {valid: false, couponCode: coupon, message: couponResponse.message},
      });
    } else {
      dispatch({
        type: `${[Actions.USER.KEY]}.${[Actions.USER.TYPE.SAVE_COUPON_CODE]}`,
        data: { valid: true, couponCode: coupon, message: couponResponse.message },
      });
    }
    dispatch(GET_CART_DATA());
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
    console.log('userDispatcher.js -> VERIFY_RAZORPAY_ORDER() -> Error: ', err);
  }
};

const DELETE_COUPON_CODE = () => async dispatch => {
  try {
    dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
    await deleteCouponCode();
    dispatch({
      type: `${[Actions.USER.KEY]}.${[Actions.USER.TYPE.SAVE_COUPON_CODE]}`,
      data: { valid: false, couponCode: '', message: '' },
    });
    dispatch(GET_CART_DATA());
    dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
  } catch (err) {
    console.log('userDispatcher.js -> VERIFY_RAZORPAY_ORDER() -> Error: ', err);
  }
};

const APPLY_EJ_CASH = points => async (dispatch, getState) => {
  dispatch({ type: COMMON_ACTIONS.SHOW_LOADER });
  try {
    const cartId =
      getState()[Actions.CART_DATA.KEY][StoreKeys.CART_DATA] ?.data ?.list
        ?.quote_id;
    await applyEjCash(cartId, points);
    dispatch(GET_CART_DATA());
  } catch (err) {
    console.log('userDispatcher.js -> VERIFY_RAZORPAY_ORDER() -> Error: ', err);
  }
  dispatch({ type: COMMON_ACTIONS.HIDE_LOADER });
};

export {
  RESET,
  VALIDATE_COUPON_CODE,
  GET_ALL_ADDRESSES,
  REMOVE_ADDRESS,
  SELECT_ADDRESS_FOR_PAYMENT,
  SELECT_SHIPPING_METHOD,
  SAVE_USER_DATA,
  PLACE_ORDER,
  Save_Razorpay_order_details,
  VERIFY_RAZORPAY_ORDER,
  CLEAR_ALL_ORDER_DETAILS,
  SAVE_ADDRESS,
  GET_AND_SAVE_PAGE_TYPES,
  DELETE_COUPON_CODE,
  APPLY_EJ_CASH,
};
