import Actions from '../actions';
import {getCartData} from '../../api/apis';
import {isLoggedIn} from '../../api/auth';
import {getAsyncCartData} from '../../screens/CartUtil';
import {CART_BADGE} from './LayoutDispatchers';

const GET_CART_DATA = () => async (dispatch, getState) => {
  try {
    const isLogin = await isLoggedIn();
    const actionType = `${Actions.CART_DATA.KEY}.${Actions.CART_DATA.TYPE.GET_CART_DATA}`;
    const cartData = isLogin ? await getCartData() : await getAsyncCartData();
    //console.log('GET_CART_DATA: ',cartData?.data?.list?.Items);
    dispatch({type: actionType, data: cartData});
    if(isLogin){
      dispatch(CART_BADGE(cartData?.data?.list?.Items?.length));
    }else{
      dispatch(CART_BADGE(cartData.length));
    }

  } catch (err) {
    console.log('cartDispatchers.js -> GET_CART_DATA() -> Error: ', err);
  }
};

const BLANK_CART_DATA = () => async dispatch => {
  const actionType = `${Actions.CART_DATA.KEY}.${Actions.CART_DATA.TYPE.GET_CART_DATA}`;
  dispatch({type: actionType, data: []});
}

export {
  GET_CART_DATA,
  BLANK_CART_DATA
};
