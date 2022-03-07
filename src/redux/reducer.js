import {combineReducers} from 'redux';
import UserReducer from './Reducers/userReducers';
import LayoutReducer from './Reducers/LayoutReducer';
import CartReducer from './Reducers/cartReducer';
import Actions from './actions';

const rootReducer = combineReducers({
  [Actions.USER.KEY]: UserReducer,
  [Actions.CART_DATA.KEY]: CartReducer,
  [Actions.LAYOUT.KEY]: LayoutReducer,
});

export default rootReducer;
