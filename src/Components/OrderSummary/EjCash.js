import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../../redux/actions';
import StoreKeys from '../../redux/storeKeys';
import margins from '../../styles/margins';
import {colors} from '../../styles/color';
import Icon from 'react-native-vector-icons/Entypo';
import {applyCoupon, deleteCouponCode} from '../../api/apis';
import {GET_CART_DATA} from '../../redux/DispatcherFunctions/CartDispatchers';
import {
  APPLY_EJ_CASH,
  DELETE_COUPON_CODE,
  VALIDATE_COUPON_CODE,
} from '../../redux/DispatcherFunctions/UserDispatchers';

const EjCashComponent = () => {
  const dispatch = useDispatch();
  const appliedEjCash = useSelector(
    state =>
      state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA]?.data?.list?.ejcash,
  );
  console.log('appliedCoupon, isCouponValid', appliedEjCash);
  const [ejCash, updateEjCash] = useState('');

  const buttonColor = '#2ab71f';

  useEffect(() => {
    updateEjCash(appliedEjCash);
  }, [appliedEjCash]);

  const handleEjCash = useCallback(async () => {
    dispatch(APPLY_EJ_CASH(ejCash));
  }, [ejCash, dispatch]);

  return (
    <>
      <View style={{alignItems: 'flex-start'}}>
        <Text style={[style.baseText,{fontSize:14, fontWeight:'400',}]}>{'Apply Ej Cash'}</Text>
      </View>
      <View style={{flexDirection: 'row',marginTop:2}}>
        <TextInput
          value={ejCash}
          onChangeText={text => updateEjCash(text)}
          style={{
            height: margins.h32,
            borderWidth: 1,
            flex:1,
            paddingLeft:5,
            //width: margins.h186,
            borderColor: buttonColor,
          }}
        />
        <View
          style={{
            backgroundColor: buttonColor,
            paddingHorizontal: margins.w12,
            justifyContent:'center',
          }}>
          <TouchableOpacity onPress={handleEjCash} style={{paddingVertical:8}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[style.baseText, {fontSize:14, fontWeight:'400', color: colors.white}]}>
                {appliedEjCash ? 'Ej Cash Applied' : 'Apply Ej Cash'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const style=StyleSheet.create({
  baseText:{
    fontFamily:'Montserrat',
    color:'#000000'
  }
})

export default EjCashComponent;
