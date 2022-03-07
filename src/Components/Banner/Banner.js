import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import Carousel from 'react-native-banner-carousel';

const windowWidth = Dimensions.get('window').width;
const Styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {color: '#212529',
  fontFamily:'Montserrat',
  fontSize:10,
  lineHeight:12,
  fontWeight:'400'
},
  mview:{
    padding:8
  },
  view: {alignItems: 'center'},
  image: {width: 60, height: 50, resizeMode: 'contain'},
  touchable: {height: 200, width: windowWidth},
  flex: {flex: 1},
  mainImage: {resizeMode: 'stretch', flex: 1},
});

const Banner = ({items, navigation}) => {
  return (
    <View id={items.key_attr}>
      <View>
        <Carousel
          showsPageIndicator={false}
          autoplay={true}
          autoplayTimeout={7000}
          loop
          index={0}
          //pageSize={windowWidth}
        >
          {items.banner_data.map((item, index) => {
            return (
              <View key={index} style={Styles.flex}>
                <TouchableOpacity
                  style={Styles.touchable}
                  onPress={() => {
                    navigation.navigate('itemlst', {
                      screen: 'itemLst',
                      params: {apiurl: item.link},
                    });
                  }}>
                  <Image
                    source={{uri: item.mobile_image}}
                    style={Styles.mainImage}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </Carousel>
      </View>
      <View style={Styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={Styles.mview}>
          <View style={Styles.view}>
              <Image
                style={Styles.image}
                source={require('../../images/insurance.png')}
              />
          </View>
          <View style={Styles.view}>
            <Text style={Styles.text}>Free Transit</Text>
            <Text style={Styles.text}>Insurance</Text>
          </View>
        </View>
        <View style={Styles.mview}>
          <View style={Styles.view}>
              <Image
                style={Styles.image}
                source={require('../../images/jewellery.png')}
              />
          </View>
          <View style={Styles.view}>
            <Text style={Styles.text}>Certified Jewellery</Text>
          </View>
        </View>
        <View style={Styles.mview}>
          <View style={Styles.view}>
              <Image
                style={Styles.image}
                source={require('../../images/return7days.png')}
              />
          </View>
          <View style={Styles.view}>
            <Text style={Styles.text}>7 Days Returns</Text>
          </View>
        </View>
        <View style={Styles.mview}>
          <View style={Styles.view}>
              <Image
                style={Styles.image}
                source={require('../../images/freedelivery.png')}
              />
          </View>
          <View style={Styles.view}>
            <Text style={Styles.text}>Free Delivery</Text>
          </View>
        </View>
        <View style={Styles.mview}>
          <View style={Styles.view}>
              <Image
                style={Styles.image}
                source={require('../../images/cod-icon.png')}
              />
          </View>
          <View style={Styles.view}>
            <Text style={Styles.text}>COD Available</Text>
          </View>
        </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Banner;
