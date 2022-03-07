import Actions from '../actions';
import StoreKeys from '../storeKeys';

const defaultState = {
  [StoreKeys.LAYOUT.LOADER]: 0,
  [StoreKeys.LAYOUT.CART_BADGE]: 0
};

const LayoutReducer = (state = defaultState, {type, ...payload}) => {
  switch (type) {
    case `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.SHOW_LOADER}`: {
      //console.log('A:',type);
      return {
        ...state,
        [StoreKeys.LAYOUT.LOADER]: state[StoreKeys.LAYOUT.LOADER] + 1,
      };
    }
    case `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.HIDE_LOADER}`: {
      //console.log('B:',type);
      return {
        ...state,
        [StoreKeys.LAYOUT.LOADER]: state[StoreKeys.LAYOUT.LOADER] - 1,
      };
    }
    case `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.CART_BADGE}`: {
      return {
        ...state,
        [StoreKeys.LAYOUT.CART_BADGE]: payload.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default LayoutReducer;
