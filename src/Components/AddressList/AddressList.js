import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Actions from '../../redux/actions';
import StoreKeys from '../../redux/storeKeys';
import margins from '../../styles/margins';
import CheckOutCard from './AddressCard/CheckOutCard';
import List from '../List';
import dimensions from '../../styles/margins';
import HeadingText from '../HeadingText/HeadingText';

const Styles = StyleSheet.create({
  head: {alignItems: 'center', paddingTop: margins.h5},
  button: {
    paddingHorizontal: dimensions.w16,
    paddingTop: 0,
  },
  buttonText: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.1)',
  },
  listContainer: {
    paddingHorizontal: dimensions.w5,
    marginBottom: 5,
  },
});

const AddressList = ({route, navigation}) => {
  const {addresses: paginatedData} = useSelector(state => {
    return {
      addresses: state[Actions.USER.KEY][StoreKeys.USER.ADDRESSES],
    };
  });

  const renderItem = useCallback(({item}) => {
    return (
      <CheckOutCard address={item} key={`${item?.address_id}_Math.random`} />
    );
  }, []);
  return (
    <View>
      <HeadingText text="Select Shipping Address" />
      <View>
        <List
          data={paginatedData}
          renderItem={renderItem}
          containerStyle={Styles.listContainer}
        />
      </View>
      <View style={Styles.button}>
        <TouchableOpacity
          style={Styles.buttonText}
          onPress={() => {
            navigation.navigate('CheckoutAddress');
          }}>
          <Text 
            style={{
              fontFamily:'Montserrat',
              fontWeight:'500',
              fontSize:12,
              color:'#000000',
              lineHeight:18
            }}
          >+ NEW ADDRESS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressList;
