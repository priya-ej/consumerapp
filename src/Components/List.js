import React, {memo} from 'react';
import {FlatList} from 'react-native';

import {listContainerStyle} from '../styles/common';

const List = ({...props}) => (
  <FlatList
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    {...props}
    contentContainerStyle={{...listContainerStyle, ...props.containerStyle}}
  />
);

List.defaultProps = {
  seprator: true,
  style: {},
  containerStyle: {},
};

export default memo(List);
