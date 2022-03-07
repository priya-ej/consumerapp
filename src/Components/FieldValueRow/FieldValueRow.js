import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  fieldName: {
    fontFamily:'Montserrat',
    fontWeight: '600',
    fontSize:13
  },
  fieldVal: {
    fontFamily:'Montserrat',
    fontWeight:'400',
    fontSize:13
  },
});

const FieldValueRow = ({name, value, fieldNameStyle, fieldValueStyle}) => (
  <View style={Styles.fieldContainer}>
    <Text style={fieldNameStyle || Styles.fieldName}>{name}:</Text>
    <Text style={fieldValueStyle || Styles.fieldVal}>{value}</Text>
  </View>
);

export default FieldValueRow;
