import {accesstocken, logout} from './auth';
import {webServiceUrls} from './webServiceUrls';
import axios from 'axios';
import {get} from 'lodash';
import {PAGE_TYPES} from '../constants/commonConstants';
import {Platform} from 'react-native'; 

const hitApiByFetch = async ({url, method, body}) => {
  //console.log('PlateForm: ',Platform.OS);
  try {
    const token = await accesstocken();
    /*
    console.log('apis.js -> hitApiByFetch() -> Info: ', {
      token,
      url,
      method,
      body,
    });
    */
    const res = await axios({
      url,
      method,
      data: body,
      headers: {Authorization: 'Bearer ' + token},
    });
    // console.log('apis.js -> hitApiByFetch() -> Res -> Info: ', {res, url});
    return res.data;
  } catch (err) {
    console.log('apis.js -> hitApiByFetch() -> Error: ', err);
  }
};

const getCategoryList = async () => {
  try {
    const token = await accesstocken();
    //console.log('apis.js -> getCategoryList() -> Access Token', token);
    const {url, method} = webServiceUrls.CATEGORY_LIST;

    const categoryListResponse = await hitApiByFetch({url, method});
    console.log('apis.js -> getCategoryList() -> Success: ');
    return categoryListResponse;
  } catch (error) {
    console.log('apis.js -> getCategoryList() -> Error: ', error);
    throw error;
  }
};

const getCartData = async () => {
  try {
    const token = await accesstocken();
    console.log('Access Token', token);
    const {url, method} = webServiceUrls.GET_CART;

    const cartData = await hitApiByFetch({url, method});
    console.log('apis.js -> getCartData() -> Success: ', cartData);
    
    // if(cartData?.code === 'UNAUTHORIZED'){
    //   await logout();
    //   return [];
    // }
    return cartData;
    //return cartData?.data?.list?.Items || [] ;
  } catch (error) {
    console.log('apis.js -> getCartData() -> Error: ', error);
    throw error;
  }
};

const addCustomerNewAddress = async data => {
  const {url, method} = webServiceUrls.ADD_NEW_ADDRESS;
  const response = await hitApiByFetch({url, method, body: data});
  return response;
};

const getAllAddressesOfUser = async () => {
  try {
    const token = await accesstocken();
    console.log('apis.js -> getAllAddressesOfUser() -> Access Token', token);
    const {url, method} = webServiceUrls.GET_CUSTOMER_ADDRESS_LIST;
    const addesses = await hitApiByFetch({url, method});
    console.log('apis.js -> getAllAddressesOfUser() -> Success: ', addesses);
    return addesses;
  } catch (error) {
    console.log('apis.js -> getAllAddressesOfUser() -> Error: ', error);
    throw error;
  }
};

const removeAddressesOfUser = async addressId => {
  try {
    const token = await accesstocken();
    console.log('apis.js -> removeAddressesOfUser() -> Access Token', token);
    const {url, method} = webServiceUrls.DELETE_CUSTOMER_ADDRESS;
    const body = {address_id: addressId};
    const addesses = await hitApiByFetch({url, method, body});

    console.log('apis.js -> removeAddressesOfUser() -> Success: ', addesses);
    return addesses;
  } catch (error) {
    console.log('apis.js -> removeAddressesOfUser() -> Error: ', error);
    throw error;
  }
};

const selectUserAddressForOrder = async address => {
  try {
    const token = await accesstocken();
    console.log(
      'apis.js -> selectUserAddressForOrder() -> Access Token',
      token,
    );
    const {url, method} = webServiceUrls.SELECT_CUSTOMER_ADDRESS;
    const body = {
      address: {
        city: address.city,
        country_id: address.country_id,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region,
        region_id: address.region_id,
        street: address.street,
        telephone: address.telephone,
      },
    };
    const res = await hitApiByFetch({url, method, body});
    console.log('apis.js -> selectUserAddressForOrder() -> Success: ', res);
    return res;
  } catch (error) {
    console.log('apis.js -> selectUserAddressForOrder() -> Error: ', error);
    throw error;
  }
};

const getShippingMethodsForOrder = async address => {
  try {
    const token = await accesstocken();
    console.log(
      'apis.js -> getShippingMethodsForOrder() -> Access Token',
      token,
    );
    const {url, method} = webServiceUrls.GET_SHIPPING_METHODS;
    const body = {
      address: {
        city: address.city,
        country_id: address.country_id,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region,
        region_id: address.region_id,
        street: address.street,
        telephone: address.telephone,
      },
    };
    const res = await hitApiByFetch({url, method, body});
    console.log('apis.js -> getShippingMethodsForOrder() -> Success: ', res);
    return res;
  } catch (error) {
    console.log('apis.js -> getShippingMethodsForOrder() -> Error: ', error);
    throw error;
  }
};

const setShippingMethod = async ({
  city,
  country_id,
  email,
  firstname,
  lastname,
  postcode,
  region,
  region_id,
  street,
  telephone,
  shippingCarrierCode,
  shippingMethodCode,
}) => {
  try {
    const token = await accesstocken();
    console.log('apis.js -> setShippingMethod() -> Access Token', token);
    const {url, method} = webServiceUrls.SET_SHIPPING_METHOD;
    const addressData = {
      city,
      country_id,
      email,
      firstname,
      lastname,
      postcode,
      region,
      region_id,
      street,
      telephone,
    };
    const body = {
      addressInformation: {
        billing_address: addressData,
        shipping_address: addressData,
        shipping_carrier_code: shippingCarrierCode,
        shipping_method_code: shippingMethodCode,
      },
    };
    const res = await hitApiByFetch({url, method, body});

    console.log('apis.js -> setShippingMethod() -> Success: ', res);
    return res;
  } catch (error) {
    console.log('apis.js -> setShippingMethod() -> Error: ', error);
    throw error;
  }
};

const placeOrder = async ({
  city,
  country_id,
  email,
  firstname,
  lastname,
  paymentMethod,
  postcode,
  region,
  region_code,
  region_id,
  status,
  street,
  telephone,
}) => {
  try {
    const {url, method} = webServiceUrls.CREATE_ORDER;
    const billingAddress = {
      email,
      region,
      region_id,
      region_code,
      country_id,
      street,
      postcode,
      city,
      telephone,
      firstname,
      lastname,
    };
    const body = {
      paymentMethod: {method: paymentMethod},
      billing_address: billingAddress,
      shipping_address: billingAddress,
      device: (Platform.OS === 'ios' ? 'ios' : 'android'),
    };
    if (status) {
      body.paymentMethod.additional_data = {status: 'pending'};
    }
    console.log(url,body);
    const res = await hitApiByFetch({url, method, body});
    console.log('apis.js -> placeOrder() -> Success: ', res);
    return res;
  } catch (error) {
    console.log('apis.js -> placeOrder() -> Error: ', error);
    throw error;
  }
};

const createRazorPayOrder = async (receipt, amount) => {
  try {
    const {url, method} = webServiceUrls.CREATE_RAZORPAY_ORDER;
    const body = {
      receipt,
      amount,
      currency: 'INR',
    };
    const res = await hitApiByFetch({url, method, body});
    console.log('apis.js -> createRazorPayOrder() -> Success: ', res);
    return res;
  } catch (error) {
    console.log('apis.js -> createRazorPayOrder() -> Error: ', error);
    throw error;
  }
};

const verifyPaymentViaRazorPay = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  orderId,
}) => {
  const {url, method} = webServiceUrls.VERIFY_PAYMENT;
  const body = {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    orderId,
  };
  const res = await hitApiByFetch({url, method, body});
  return res;
};

const setPaymentVerficationResponse = async ({
  paymentId,
  orderId,
  status,
  razorpayOrderId,
}) => {
  const {url, method} = webServiceUrls.SET_PAYMENT_RESPONSE;
  const res = await hitApiByFetch({
    url,
    method,
    body: {
      paymentInfo: [
        {
          paymentId,
          orderId,
          status,
          razorpay_order_id: razorpayOrderId,
        },
      ],
    },
  });
  return res;
};

const getQuoteId = async () => {
  const {url, method} = webServiceUrls.CREATE_OR_GET_CART;
  const cartResponse = await hitApiByFetch({url, method});
  return get(cartResponse, 'data.quote_id');
};

const updateProductQtyInCart = async (productSku, qty, itemId) => {
  const quoteId = await getQuoteId();
  const {url, method} = webServiceUrls.UPDATE_PRODUCT_QTY_IN_CART;
  const payload = {
    cartItem: {
      item_id: itemId,
      sku: productSku,
      qty,
      quote_id: quoteId,
    },
  };
  const response = await hitApiByFetch({url, method, body: payload});
  return response;
};

const getPageUrls = async () => {
  const {url, method} = webServiceUrls.PAGE_URLS;
  const categoryListResponse = await hitApiByFetch({url, method});
  return categoryListResponse?.data;
};

const getProductsAndFiltersByCategory = async ({
  filterExpression = {},
  pageSize = 24,
  pageNum = 1,
  url: urlKey = '',
  sortBy = '',
}) => {
  //console.log('getProductsAndFiltersByCategory: ', sortBy);
  const {url, method} = webServiceUrls.GET_CATEGORY_PAGE_DATA;
  let body = {
    url_key: urlKey,
    p: pageNum,
    page_size: pageSize,
    filter_expression: filterExpression,
  };
  if (sortBy.length) {
    body.sort_by = sortBy;
  }
  //console.log(body);
  const productsListResponse = await hitApiByFetch({
    url,
    method,
    body,
  });
  if (productsListResponse.status !== 200) {
    return [];
  }
  return productsListResponse.data;
};

const getProductsAndFiltersByStore = async ({
  url: jewellerUrl,
  filterExpression = {},
  pageSize = 24,
  pageNum = 1,
  sortBy = ''
}) => {
  //console.log('getProductsAndFiltersByStore: ', sortBy);
  const {url, method} = webServiceUrls.GET_STORE_PAGE_DATA;
  let query = {
    jeweller_url: jewellerUrl,
    filter_expression: filterExpression,
    p: pageNum,
    page_size: pageSize,
  };
  if (sortBy.length) {
    query.sort_by = sortBy;
  }
  const productsListResponse = await hitApiByFetch({url, method, body: query});
  if (productsListResponse.status !== 200) {
    return [];
  }
  return productsListResponse.data;
};

const searchProducts = async ({
  query,
  filterExpression = {},
  pageSize = 24,
  pageNum = 1,
  sortBy = ''
}) => {

  const {url, method} = webServiceUrls.SEARCH_PRODUCTS;
  let queryObj = {
    query,
    filter_expression: filterExpression,
    p: pageNum,
    page_size: pageSize,
  };
  if (sortBy.length) {
    queryObj.sort_by = sortBy;
  }  
  console.log('searchProducts: ', queryObj);

  const productsListResponse = await hitApiByFetch({ url, method, body: queryObj});
  
//console.log('productsListResponse: ',productsListResponse); 

  if (productsListResponse.status !== 200) {
    return [];
  }
  return productsListResponse.data;
};

const availableCoupon = async (cartId) => {
  const {url, method} = webServiceUrls.AVAILABLE_COUPONS;
  //const res = await hitApiByFetch({url, method, body: {cartId}});
  const res = await hitApiByFetch({url, method});
  return res.data;
};

const applyCoupon = async couponCode => {
  const {url, method} = webServiceUrls.APPLY_COUPON;
  const finalUrl = `${url}/${couponCode}`;
  const res = await hitApiByFetch({url: finalUrl, method});
  return res;
};

const deleteCouponCode = async () => {
  const {url, method} = webServiceUrls.REMOVE_COUPON;
  const res = await hitApiByFetch({url, method});
  return res.data;
};

const applyEjCash = async (cartId, amt) => {
  const {url, method} = webServiceUrls.APPLY_EJ_CASH;
  const res = await hitApiByFetch({url, method, body: {cartId, points: amt}});
  return res.data;
};

const getAppliedEjCash = async () => {
  const {url, method} = webServiceUrls.GET_APPLIED_EJ_CASH;
  const res = await hitApiByFetch({url, method});
  return res.data;
};

const getProductsList = async ({
  pageType,
  url,
  filterExpression,
  pageSize,
  pageNum,
  query,
  sortBy
}) => {
  switch (pageType) {
    case PAGE_TYPES.CATEGORY: {
      return getProductsAndFiltersByCategory({
        url,
        filterExpression,
        pageSize,
        pageNum,
        sortBy,
      });
    }
    case PAGE_TYPES.SEARCH: {
      return searchProducts({
        url,
        filterExpression,
        pageSize,
        pageNum,
        query,
        sortBy
      });
    }
    default: {
      return getProductsAndFiltersByStore({
        url,
        filterExpression,
        pageSize,
        pageNum,
        sortBy
      });
    }
  }
};

const getCurrentLocationByCurrentIP = async()=>{
  const {url, method} = webServiceUrls.GET_CURRENTLOCATION_BY_USING_IP;
  const res = await hitApiByFetch({url,method});
  //console.log(res);
  return res;
}
const addProductImpression = async (data, page_type) => {
  const {url, method} = webServiceUrls.ADD_PRODUCT_IMPRESSION;
  /*
  {
    "product_data":[{
          "product_id": "47561",
          "sku": "342-KDI14-57",
          "vendor_id": "342",
          "position": 1,
          "bid_organic": "bid"
      }],
    "category_id":"8", "page_type":"category", "device":"app", "country":"India", "region":"Maharashtra", "city":"Pune", "zip":"401601"
  }

  Implemented Screen
  HomeScreen.js
  ListPageByCategoryNamesScreen.js
  ProductScreen.js
  */

  const currentLocation = await getCurrentLocationByCurrentIP();
  let body = {
    product_data: data,
    category_id: '8',
    page_type,
    device: 'app',
    country: currentLocation.country_name,
    region: currentLocation.region,
    city: currentLocation.city,
    zip: currentLocation.postal
  };

  //console.log('Impression: ',body);
  const res = await hitApiByFetch({url, method, body});
  console.log(res);
  return res.data;
  //  return {"code": "OK", "status": 200, "message": "Product Impression Added Successfully", "data": []};
};

export {
  createRazorPayOrder,
  getAllAddressesOfUser,
  getCategoryList,
  getCartData,
  getShippingMethodsForOrder,
  getProductsList,
  placeOrder,
  removeAddressesOfUser,
  selectUserAddressForOrder,
  setShippingMethod,
  verifyPaymentViaRazorPay,
  addCustomerNewAddress,
  setPaymentVerficationResponse,
  updateProductQtyInCart,
  getPageUrls,
  getProductsAndFiltersByCategory,
  availableCoupon,
  applyCoupon,
  deleteCouponCode,
  applyEjCash,
  getAppliedEjCash,
  addProductImpression
};
