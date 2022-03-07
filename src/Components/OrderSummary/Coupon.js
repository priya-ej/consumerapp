import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Button,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../redux/actions';
import StoreKeys from '../../redux/storeKeys';
import margins from '../../styles/margins';
import { colors } from '../../styles/color';
import Icon from 'react-native-vector-icons/Entypo';
import { availableCoupon, applyCoupon, deleteCouponCode } from '../../api/apis';
import { GET_CART_DATA } from '../../redux/DispatcherFunctions/CartDispatchers';
import { DELETE_COUPON_CODE, VALIDATE_COUPON_CODE} from '../../redux/DispatcherFunctions/UserDispatchers';
import {SHOW_LOADER, HIDE_LOADER} from '../../redux/DispatcherFunctions/LayoutDispatchers';
import RadioButton from '../RadioButton/RadioButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Coupon = () => {
  const dispatch = useDispatch();
  const { appliedCoupon, isCouponValid, couponMsg, quote_id } = useSelector(state => ({
    appliedCoupon: state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA] ?.data ?.list ?.shipping_address ?.discount_description,
    isCouponValid: state[Actions.USER.KEY][StoreKeys.USER.VALID_COUPON_CODE],
    couponMsg: state[Actions.USER.KEY][StoreKeys.USER.COUPON_MSG],
    quote_id: state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA] ?.data ?.list ?.quote_id
  }));

  //console.log('appliedCoupon, isCouponValid, quote_id', appliedCoupon, isCouponValid, quote_id);

  const [success, setSuccess] = useState(false);
  const [avCoupon, setAvCoupon] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [chooseFromAvCoupon, SetChooseFromAvCoupon] = useState(undefined);

  const buttonColor = success ? 'red' : 'green';

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setAvCoupon([]);
      }
    }, [])
  );

  useEffect(() => {
    //console.log('Valid Coupan: ', isCouponValid);
    //console.log('appliedCoupon:vvv:', appliedCoupon, coupon);
    setCoupon(appliedCoupon);
    //if (applyCoupon.length === 0) {
    if(appliedCoupon != null && appliedCoupon.length != 0){
      setSuccess(true);
    }
  }, [appliedCoupon]);

  const handleCoupon = useCallback(async () => {
    dispatch(VALIDATE_COUPON_CODE(coupon));
  }, [coupon, dispatch]);

  const handleRemoveCoupon = useCallback(async () => {
    setCoupon('');
    dispatch(DELETE_COUPON_CODE());
  }, [dispatch]);

  const handleAvailableCoupons = useCallback(async () => {
    dispatch(SHOW_LOADER());
    const couponResponse = await availableCoupon(quote_id);
    setAvCoupon(couponResponse.list);
    dispatch(HIDE_LOADER());
    //console.log('Available Coupon :', couponResponse);
  }, [quote_id, dispatch]);

  useEffect(()=>{
    //console.log('coupon Apply:', chooseFromAvCoupon);
    if(chooseFromAvCoupon !=null){
      //console.log('coupon Apply *************');
      handleCoupon();
    }
  },[chooseFromAvCoupon]);

  return (
    <>
      <View style={{ alignItems: 'flex-start' }}>
        <Text style={[style.baseText, { fontWeight: '400', fontSize: 16, lineHeight: 19 }]}>{'Have a Coupon Code?'}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          placeholder='ENTER COUPON CODE'
          value={coupon}
          onChangeText={text => setCoupon(text)}
          style={[style.baseText, {
            backgroundColor: '#f7f7f7',
            fontWeight: '400',
            fontSize: 14,
            lineHeight: 18,
            height: margins.h32,
            borderWidth: (isCouponValid && appliedCoupon) ? 1 : 0,
            //width: margins.h186,
            borderColor: '#2ab71f',
            paddingLeft: 5,
            flex: 1
          }]}
        // onChangeText={onChangeText}
        // value={text}
        />
        <View
          style={{
            paddingVertical: margins.h4,
            backgroundColor: (isCouponValid && appliedCoupon) ? '#2ab71f' : '#cdb083',
            paddingHorizontal: margins.w12,
            //borderWidth:1,
            //borderColor: '#008000',
          }}>
          <TouchableOpacity onPress={() => {
            if (coupon ?.length > 0) {
              handleCoupon();
            }
          }}
            style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              {isCouponValid && appliedCoupon ? (
                <View>
                  <TouchableOpacity onPress={handleRemoveCoupon} style={{ marginRight: 10 }}>
                    <Icon name="cross" size={margins.w17} color="black" />
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={{ justifyContent: 'center' }}>
                <Text style={[style.baseText, { color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: '400' }]}>
                  {isCouponValid && appliedCoupon ? 'APPLIED' : 'APPLY COUPON'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ color: ( !isCouponValid && couponMsg) ? 'red' : '#2ab71f' }}>{couponMsg}
            
        {/* {
          isCouponValid && appliedCoupon
          ? "coupon code applied successfully"
          :  "The coupon code isn't valid. Verify the code and try again."
        } */}
      </Text>

      <View style={{ paddingTop: margins.h5 }}>
        <TouchableOpacity
          style={{ alignSelf: 'flex-start' }}
          onPress={() => {
            handleAvailableCoupons();
          }}
        >
          <Text
            style={[style.baseText, { fontSize: 16, lineHeight: 24, fontWeight: '400', textDecorationLine: 'underline', color: '#063374' }]}>
            {'Check Available Coupons'}
          </Text>
        </TouchableOpacity>
        <View>
          {
            avCoupon.map((item, index) => {
              return (
                <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                  <View style={{ width: (windowWidth / 2.7), marginRight: 10 }}>
                    <TouchableOpacity 
                      style={{ flex: 1 }}
                      onPress={async()=>{
                        await handleRemoveCoupon();
                        setCoupon(item.code.toUpperCase());
                        SetChooseFromAvCoupon(!chooseFromAvCoupon);
                        //handleCoupon();
                      }}
                      >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 25, alignItems: 'center' }}>
                          <RadioButton selected={coupon == item.code.toUpperCase()}></RadioButton>
                        </View>
                        <View style={[{borderColor: coupon == item.code.toUpperCase() ? '#2ab71f':'#000'},{ flex: 1, borderWidth: 1, alignItems: 'center', marginLeft: 8, paddingHorizontal: 5, paddingVertical: 10, }]}>
                          <Text numberOfLines={1} style={[style.baseText, { fontSize: 12, fontWeight: '500', textTransform: 'uppercase' }]}>{item.code}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={[style.baseText, { color: '#9f9f9f', fontSize: 14, fontWeight: '400' }]}>{item.description}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  baseText: {
    fontFamily: 'Montserrat',
    color: '#000000'
  }
})

export default Coupon;
