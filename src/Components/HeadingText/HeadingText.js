import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Styles = StyleSheet.create({
  head: {
    alignItems: 'flex-start',
    paddingTop: 7,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  text: {
    fontFamily:'Montserrat',
    fontWeight: '600',
    fontSize: 13,
    lineHeight:16,
    color:'#212529'
  },
});

const HeadingText = ({text}) => (
  <View style={Styles.head}>
    <Text style={Styles.text}>{text}</Text>
  </View>
);

export default HeadingText;
