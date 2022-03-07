import Actions from '../actions';
import StoreKeys from '../storeKeys';

const defaultState = {
  [StoreKeys.USER.ADDRESSES]: [],
  [StoreKeys.USER.SHIPPING_METHODS]: [],
  [StoreKeys.USER.SELECTED_SHIPPING_METHOD_CODE]: null,
  [StoreKeys.USER.ORDER_DETAILS]: null,
  [StoreKeys.USER.RAZORPAY_ORDER_DETAILS]: null,
  [StoreKeys.USER.COUPON_CODE]: '',
  [StoreKeys.USER.VALID_COUPON_CODE]: false,
  [StoreKeys.USER.COUPON_MSG]: '',
};

const UserReducer = (state = defaultState, {type, ...payload}) => {
  switch (type) {
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_USER_DATA}`: {
      return {
        ...state,
        [StoreKeys.USER.DATA]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.CLEAR_USER_DATA}`: {
      return {
        ...state,
        [StoreKeys.USER]: null,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.GET_USER_ADDRESSES}`: {
      return {
        ...state,
        [StoreKeys.USER.ADDRESSES]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SELECT_ADDRESS_FOR_PAYMENT}`: {
      return {
        ...state,
        [StoreKeys.USER.SELECTED_ADDRESS_ID_FOR_PAYMENT]: payload.addressId,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SELECT_ADDRESS_AND_SAVE_SHIPPING_METHODS}`: {
      const {addressId, shippingMethods} = payload;
      return {
        ...state,
        [StoreKeys.USER.SELECTED_ADDRESS_ID_FOR_PAYMENT]: addressId,
        [StoreKeys.USER.SHIPPING_METHODS]: shippingMethods,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_SELECTED_SHIPPING_METHOD_CODE}`: {
      return {
        ...state,
        [StoreKeys.USER.SELECTED_SHIPPING_METHOD_CODE]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_AVAILABLE_PAYMENT_METHODS}`: {
      return {
        ...state,
        [StoreKeys.USER.AVAILABLE_PAYMENT_METHODS]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_ORDER_DETAILS}`: {
      return {
        ...state,
        [StoreKeys.USER.ORDER_DETAILS]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_RAZORPAY_ORDER_DETAILS}`: {
      return {
        ...state,
        [StoreKeys.USER.RAZORPAY_ORDER_DETAILS]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_RAZORPAY_CONFIRMATION_RES}`: {
      return {
        ...state,
        [StoreKeys.USER.RAZORPAY_CONFIRMATION_RES]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_SUCCESS_ORDER_WITH_DATA}`: {
      return {
        ...state,
        [StoreKeys.USER.ORDER_STATUS]: payload.data.status,
        [StoreKeys.USER.ORDERED_ITEMS]: payload.data.orderItems,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.CLEAR_ALL_ORDER_DETAILS}`: {
      return {
        ...state,
        [StoreKeys.USER.RAZORPAY_CONFIRMATION_RES]: null,
        [StoreKeys.USER.ORDERED_ITEMS]: null,
        [StoreKeys.USER.RAZORPAY_ORDER_DETAILS]: null,
        [StoreKeys.USER.ORDER_DETAILS]: null,
        [StoreKeys.USER.AVAILABLE_PAYMENT_METHODS]: null,
        [StoreKeys.USER.SELECTED_SHIPPING_METHOD_CODE]: null,
        [StoreKeys.USER.SELECTED_ADDRESS_ID_FOR_PAYMENT]: null,
        [StoreKeys.USER.SHIPPING_METHODS]: [],
        [StoreKeys.USER.ORDER_STATUS]: null,

        [StoreKeys.USER.ADDRESSES]: [],
        [StoreKeys.USER.COUPON_CODE]: '',
        [StoreKeys.USER.VALID_COUPON_CODE]: false,
        [StoreKeys.USER.COUPON_MSG] : '',
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_PAGE_URLS}`: {
      return {
        ...state,
        [StoreKeys.USER.PAGE_URLS]: payload.data,
      };
    }
    case `${Actions.USER.KEY}.${Actions.USER.TYPE.SAVE_COUPON_CODE}`: {
      return {
        ...state,
        [StoreKeys.USER.COUPON_CODE]: payload.data.couponCode,
        [StoreKeys.USER.VALID_COUPON_CODE]: payload.data.valid,
        [StoreKeys.USER.COUPON_MSG]: payload.data.message
      };
    }
    case `${Actions.RESET}`:{
      return defaultState ;
    }
    default: {
      return state;
    }
  }
};

export default UserReducer;
