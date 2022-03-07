const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: {
    CODE: 'cashondelivery',
    TITLE: 'Cash On Delivery',
  },
  RAZORPAY: {
    CODE: 'razorpay',
    TITLE: 'Credit Card / Debit Card / Net Banking - Razorpay',
  },
  PAYPAL: {
    CODE: 'checkmo',
    TITLE: 'Check / Money order',
  },
};

const ORDER_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const PAGE_TYPES = {
  CATEGORY: 'category',
  STORE: 'store',
  CMS: 'cms',
  SEARCH: 'search',
};

const IMPRESSION_PAGE_TYPE = {
  CATEGORY: 'Category',
  OTHERS: 'Others Page',
  HOME: 'home_page',
  PRODUCT_VIEW: 'product_view_page',
  PRODUCT_VIEW_OTHERS:{
    "You May Also Like" : 'you_may_also_like_product_view_page',
    "Recommendations": 'recommendation_product_view_page',
    "New Arrivals": 'new_arrival_product_view_page',
    "More Jewellery From": 'more_jewellery_from_jeweller',  
  }
}

export {
  PAYMENT_METHODS,
  ORDER_STATUS,
  PAGE_TYPES,
  IMPRESSION_PAGE_TYPE
};
