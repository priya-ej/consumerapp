import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import font from '../../../styles/font';
import {colors} from '../../../styles/color';
import dimesions from '../../../styles/margins';
import CheckBox from './SubComponents/CheckBoxSubComponent';

const CheckoutCheckBox = ({text, ...props}) => (
  <View style={styles.container}>
    <CheckBox {...props} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 1,
  },
  text: {
    ...font.h14_m,
    fontWeight: 'bold',
    color: colors.eclipse,
    marginLeft: dimesions.w4,
    marginTop: dimesions.h5,
  },
});

export default memo(CheckoutCheckBox);
