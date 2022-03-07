import {BASE_URL} from './pathSettings';

const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const webServiceUrls = {
  CATEGORY_LIST: {
    url: `${BASE_URL}rest/V1/api/getCategoryListJson`,
    method: REQUEST_METHODS.GET,
  },
  GET_CART: {
    url: `${BASE_URL}rest/V1/cartsData/mine`,
    method: REQUEST_METHODS.GET,
  },
  ADD_NEW_ADDRESS: {
    url: `${BASE_URL}rest/V1/api/customer/addCustomerAddress`,
    method: REQUEST_METHODS.POST,
  },
  GET_CUSTOMER_ADDRESS_LIST: {
    url: `${BASE_URL}rest/V1/customer/customerAddressList`,
    method: REQUEST_METHODS.POST,
  },
  DELETE_CUSTOMER_ADDRESS: {
    url: `${BASE_URL}rest/V1/customer/deleteCustomerAddress`,
    method: REQUEST_METHODS.POST,
  },
  SELECT_CUSTOMER_ADDRESS: {
    url: `${BASE_URL}rest/V1/api/cartsData/mine/shipping-address`,
    method: REQUEST_METHODS.POST,
  },
  GET_SHIPPING_METHODS: {
    url: `${BASE_URL}rest/V1/api/cartsData/mine/estimate-shipping-methods`,
    method: REQUEST_METHODS.POST,
  },
  SET_SHIPPING_METHOD: {
    url: `${BASE_URL}rest/V1/api/carts/mine/shipping-informationnew`,
    method: REQUEST_METHODS.POST,
  },
  CREATE_ORDER: {
    url: `${BASE_URL}rest/V1/api/cartsData/mine/payment-information-new`,
    method: REQUEST_METHODS.POST,
  },
  CREATE_RAZORPAY_ORDER: {
    url: `${BASE_URL}rest/V1/api/create_rzp_order`,
    method: REQUEST_METHODS.POST,
  },
  VERIFY_PAYMENT: {
    url: `${BASE_URL}rest/V1/api/rzp_signature_verify`,
    method: REQUEST_METHODS.POST,
  },
  SET_PAYMENT_RESPONSE: {
    url: `${BASE_URL}rest/V1/customer/setPaymentResponse`,
    method: REQUEST_METHODS.POST,
  },
  UPDATE_PRODUCT_QTY_IN_CART: {
    url: `${BASE_URL}rest/V1/cartsData/mine/items`,
    method: REQUEST_METHODS.PUT,
  },
  CREATE_OR_GET_CART: {
    url: `${BASE_URL}rest/V1/cartsData/mine`,
    method: REQUEST_METHODS.POST,
  },
  PAGE_URLS: {
    url: `${BASE_URL}rest/V1/api/page_urls`,
    method: REQUEST_METHODS.GET,
  },
  GET_CATEGORY_PAGE_DATA: {
    //url: `${BASE_URL}rest/V1/api/product/listPageByCategoryNames`,
    url: `${BASE_URL}rest/V1/api/product/listPageByCategoryNamesNew`,
    method: REQUEST_METHODS.POST,
  },
  GET_STORE_PAGE_DATA: {
    //url: `${BASE_URL}rest/V1/api/product/getListPageByVendorNames`,
    url: `${BASE_URL}rest/V1/api/product/getListPageByVendorNamesNew`,
    method: REQUEST_METHODS.POST,
  },
  SEARCH_PRODUCTS: {
    url: `${BASE_URL}rest/V1/product/search`,
    method: REQUEST_METHODS.POST,
  },
  AVAILABLE_COUPONS: {
    url: `${BASE_URL}rest/V1/cart/available/coupons`,
    method: REQUEST_METHODS.GET,
  },
  APPLY_COUPON: {
    url: `${BASE_URL}rest/V1/cartsData/mine/coupons`,
    method: REQUEST_METHODS.PUT,
  },
  REMOVE_COUPON: {
    url: `${BASE_URL}rest/V1/cartsData/mine/coupons`,
    method: REQUEST_METHODS.DELETE,
  },
  APPLY_EJ_CASH: {
    url: `${BASE_URL}rest/V1/cart/setrewardpoints`,
    method: REQUEST_METHODS.POST,
  },
  ADD_PRODUCT_IMPRESSION:{
    url: `${BASE_URL}rest/V1/api/customer/addProductImpression`,
    method: REQUEST_METHODS.POST,
  },
  GET_CURRENTLOCATION_BY_USING_IP:{
    //url: 'https://geolocation-db.com/json/',
    url: 'https://ipapi.co/json',
    method: REQUEST_METHODS.GET
  }
};