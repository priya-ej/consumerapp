/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

const RadioButton = props => {
  return (
    <View
      style={[
        {
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: props.selected ? '#247cfd' : '#9f9f9f',
          backgroundColor: props.selected ? '#247cfd' : '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}>
      
        <View
          style={{
            height: 11,
            width: 11,
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
          }}
        />
    </View>
  );
};

const RadioButton2 = props => {
  return (
    <View
      style={[
        {
          height: 16,
          width: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: props.selected ? '#247cfd' : '#9f9f9f',
          backgroundColor: props.selected ? '#247cfd' : '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}>
      
        <View
          style={{
            height: 7,
            width: 7,
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
          }}
        />
    </View>
  );
};

export default RadioButton;
export {
  RadioButton2
}
