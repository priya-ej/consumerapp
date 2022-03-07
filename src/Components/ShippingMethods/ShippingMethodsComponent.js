/* eslint-disable react-native/no-inline-styles */
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../../redux/actions';
import {SELECT_SHIPPING_METHOD} from '../../redux/DispatcherFunctions/UserDispatchers';
import StoreKeys from '../../redux/storeKeys';

const ShippingMethodsComponent = () => {
  const shippingMethods = useSelector(
    state => state[Actions.USER.KEY][StoreKeys.USER.SHIPPING_METHODS],
  );

  const dispatch = useDispatch();

  const selectShippingMethodHandler = useCallback(
    selectedShippingMethod =>
      dispatch(SELECT_SHIPPING_METHOD(selectedShippingMethod)),
    [dispatch],
  );

  const selectedShippingMethod = useSelector(
    state =>
      state[Actions.USER.KEY][StoreKeys.USER.SELECTED_SHIPPING_METHOD_CODE],
  );

  return (
    <View>
      {shippingMethods.map(shippingMethod =>
        shippingMethod.carrier_available ? (
          <View
            key={`${shippingMethods.carrier_code}_${Math.random()}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '70%',
              alignSelf: 'center',
            }}>
            <View style={{width: '15%', paddingTop: 3}}>
              <RadioButton
                status={
                  shippingMethod.carrier_methodecode === selectedShippingMethod
                    ? 'checked'
                    : 'unchecked'
                }
                color="#008000"
                value={shippingMethod.carrier_code}
                onPress={() => selectShippingMethodHandler(shippingMethod)}
              />
            </View>
            <View style={{width: '70%', paddingTop: 10}}>
              <Text
                style={{
                  color:'#008000',
                  fontFamily:'Montserrat',
                  fontWeight:'400',
                  fontSize:14,
                  lineHeight:17
                }}
              >
                {shippingMethod.carrier_methodtitle} - {shippingMethod.carrier_title}
              </Text>
            </View>
          </View>
        ) : null,
      )}
    </View>
  );
};

export default ShippingMethodsComponent;
