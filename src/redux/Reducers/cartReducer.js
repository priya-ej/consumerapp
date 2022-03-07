import Actions from '../actions';
import StoreKeys from '../storeKeys';

const defaultState = {
  [StoreKeys.CART_DATA]: []
};

const CartReducer = (state = defaultState, {type, ...payload}) => {
  switch (type) {
    case `${Actions.CART_DATA.KEY}.${Actions.CART_DATA.TYPE.GET_CART_DATA}`: {
      return {
        ...state,
        [StoreKeys.CART_DATA]: payload.data,
      };
    }
    default: {
      return state;
    }
  }
};
export default CartReducer;
