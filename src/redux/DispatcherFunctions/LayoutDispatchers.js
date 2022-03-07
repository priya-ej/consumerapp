import Actions from '../actions';

const SHOW_LOADER = () => async dispatch => {
  try {
    const actionType = `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.SHOW_LOADER}`;
    dispatch({type: actionType});
  } catch (err) {
    console.log('LayouttDispatchers.js -> SHOW_LOADER() -> Error: ', err);
  }
};

const HIDE_LOADER = () => async (dispatch, getState) => {
  try {
    const actionType = `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.HIDE_LOADER}`;
    dispatch({type: actionType});
  } catch (err) {
    console.log('LayouttDispatchers.js -> HIDE_LOADER() -> Error: ', err);
  }
};

const CART_BADGE = (count) => async (dispatch, getState) => {
  try{
    const actionType = `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.CART_BADGE}`;
    //console.log('hello:', actionType, count);
    dispatch({type: actionType, data: count});
  }catch(err){
    console.log('LayouttDispatchers.js -> CART_BADGE() -> Error: ', err);
  }
}

export {SHOW_LOADER, HIDE_LOADER, CART_BADGE};
