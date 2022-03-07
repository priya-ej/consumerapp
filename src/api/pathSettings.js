export const BASE_URL = 'https://prod.ejohri.com/'; //For Live
//export const BASE_URL = 'http://beta.ejohri.com/'; // For Development/Beta

export const pathSettings = {
  login: `${BASE_URL}rest/V1/api/customer/token`,
  forgotPassword: `${BASE_URL}rest/V1/customer/forgotPassword`,
  createAccounts: `${BASE_URL}rest/V1/customers/createAccounts`,
  getHomepageData: `${BASE_URL}rest/V1/api/getHomepageData`,
  getSearch: `${BASE_URL}rest/V1/product/search`,
  getCategoryList: `${BASE_URL}rest/V1/api/getCategoryListJson`,
  getListByCategoryName: `${BASE_URL}rest/V1/api/product/listPageByCategoryNames`,
  getProductByUrl: `${BASE_URL}rest/V1/product/productByUrl`,
  createCart: `${BASE_URL}rest/V1/cartsData/mine`,
  addToCart: `${BASE_URL}rest/V1/cartsData/mine/items`,
  getVendorAddress: `${BASE_URL}rest/V1/getvendoraddresslist`,
  getCoupan: `${BASE_URL}rest/V1/cart/available/coupons`,
  addAppointmentGuestCustomer: `${BASE_URL}rest/V1/addAppointmentGuestCustomer`,
};
