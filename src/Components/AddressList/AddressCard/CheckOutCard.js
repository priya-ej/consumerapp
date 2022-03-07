/* eslint-disable react-native/no-inline-styles */
import React, {memo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {cardContainer, cardContent} from '../../../styles/common';
import CheckBox from '../AddressCheckBox/CheckoutCheckBox';
import margins from '../../../styles/margins';
import {colors} from '../../../styles/color';

import {useDispatch, useSelector} from 'react-redux';
import {
  REMOVE_ADDRESS,
  SELECT_ADDRESS_FOR_PAYMENT,
} from '../../../redux/DispatcherFunctions/UserDispatchers';
import StoreKeys from '../../../redux/storeKeys';
import Actions from '../../../redux/actions';

const Styles = StyleSheet.create({
  container: {
    ...cardContainer,
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.1)',
  },
});

const Card = memo(
  ({containerStyle, address, touchable, onPress, onLongPress}) => {
    const addressId = address?.address_id;
    const dispatch = useDispatch();
    const removeAddress = useCallback(
      () => dispatch(REMOVE_ADDRESS(addressId)),
      [addressId, dispatch],
    );

    const selectedAddressId = useSelector(
      state =>
        state[Actions.USER.KEY][StoreKeys.USER.SELECTED_ADDRESS_ID_FOR_PAYMENT],
    );

    const Wrapper = touchable ? TouchableOpacity : View;
    return (
      <View style={containerStyle || cardContainer}>
        <View style={cardContent}>
          <Wrapper onPress={onPress} onLongPress={onLongPress}>
            <CheckBox
              data={true}
              text={`${address.firstname} ${address.lastname}`}
              handleCheckBox={onPress}
              isChecked={address.address_id === selectedAddressId}
            />
            <View
              style={{
                marginLeft: margins.h26,
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Text>{`${address.street.join(' ')}, `}</Text>
              <Text>{`${address.country_id}, ${address.postcode}`}</Text>
              <Text>{address.telephone}</Text>
              <Text>{`${address.email}`}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <View style={{marginLeft: margins.h26}}>
                <TouchableOpacity onPress={removeAddress}>
                  <Text style={{color: colors.subBlue}}>Remove</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <View style={{marginLeft: margins.h26}}>
                  <Text style={{color: colors.subBlue}}>Edit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Wrapper>
        </View>
      </View>
    );
  },
);

const CheckOutCard = ({address}) => {
  const dispatch = useDispatch();
  const {address_id: addressId} = address;
  const onSelectAddress = useCallback(() => {
    dispatch(SELECT_ADDRESS_FOR_PAYMENT(addressId));
  }, [addressId, dispatch]);
  return (
    <View>
      <Card
        containerStyle={Styles.container}
        address={address}
        touchable
        onPress={onSelectAddress}
      />
    </View>
  );
};
export default CheckOutCard;
