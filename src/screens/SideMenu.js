/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/FontAwesome';
import {getCategoryList} from '../api/apis';
import {Fragment} from 'react';

function SideMenu(props) {
  const [listData, updateListData] = useState([]);
  const [parentHeaderData, updateParentHeaderData] = useState([]);
  const [expandedHeaderName, updateExpandedHeaderName] = React.useState('');

  useEffect(() => {
    getCategoryList()
      .then(data => {
        updateListData(data);
        updateParentHeaderData(
          data
            .map(item => ({...item, categorys: null}))
            .sort((a, b) => a.position - b.position),
        );
      })
      .catch(err =>
        console.log(
          'SideMenu -> useEffect() -> getCategoryList() -> Error',
          err,
        ),
      );
  }, []);

  const getLeafSubItem = categoryData => {
    if (!categoryData?.length) {
      return <Fragment />;
    }
    return categoryData.map((l2Header, idx) =>{
      //console.log(l2Header);
      return(
      <View key={idx}>
        <View>
          <DrawerItem
            style={{marginVertical:2}}
            label={l2Header.Label || ''}
            onPress={() => {
              if (l2Header.url !== undefined) {
                props.navigation.navigate('itemlst', {
                  screen: 'itemLst',
                  params: {apiurl: l2Header.url},
                });
              }
            }}
            labelStyle={{
              marginTop:-12,
              marginBottom:-7,              
              color: '#000000',
              fontWeight: l2Header.url === undefined ? '600' : '400',
              fontSize: l2Header.url === undefined ? 14 : 12, 
              lineHeight: l2Header.url === undefined ? 30 : 15,
            }}
          />
        </View>
        <View>{getLeafSubItem(l2Header.categorys, props)}</View>
      </View>
    )});
  };

  const GetDrawerSubItems = headerName => {
    if (headerName !== expandedHeaderName) {
      return <Fragment />;
    }
    const l2CategoryData =
      listData.find(item => item.Label === expandedHeaderName) || {};
    return getLeafSubItem(l2CategoryData.categorys);
  };

  const GetDrawerItems = () => {
    return parentHeaderData.map((l1Category, idx) => {
      return (
        <View key={l1Category.Label}>
          <View style={{paddingLeft: 8, paddingRight: 8}}>
            <TouchableOpacity
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => {
                if (expandedHeaderName === '') {
                  updateExpandedHeaderName(l1Category.Label);
                } else {
                  if (expandedHeaderName === l1Category.Label) {
                    updateExpandedHeaderName('');
                  } else {
                    updateExpandedHeaderName(l1Category.Label);
                  }
                }
              }}>
              <View>
                <Text style={{fontFamily:'Montserrat', fontSize: 15, lineHeight:24, fontWeight:'400', color: '#CDAF84'}}>
                  {l1Category.Label}
                </Text>
              </View>
              <View>
                <Icon
                  name={
                    expandedHeaderName === l1Category.Label
                      ? 'caret-up'
                      : 'caret-down'
                  }
                  size={23}
                  color="#CDAF84"
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={[
              {backgroundColor: '#FFFFFF', paddingLeft: 8, paddingRight: 8},
              expandedHeaderName === l1Category.Label ? '' : {display: 'none'},
            ]}>
            {GetDrawerSubItems(l1Category.Label)}
          </View>
        </View>
      );
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#063374'}}>
      <DrawerContentScrollView {...props}>
        <View style={{height: 30}} />
        {GetDrawerItems()}
      </DrawerContentScrollView>
    </View>
  );
}

export default SideMenu;
