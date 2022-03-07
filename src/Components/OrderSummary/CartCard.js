import React, {memo} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {cardContainer, cardContent} from '../../styles/common';
import margins from '../../styles/margins';

const Styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  innerCard: {
    borderRadius: 5,
  },
  productPrice: {
    paddingTop:15,
    fontFamily: 'Montserrat',
    fontSize:16,
    lineHeight:14,
    fontWeight: '600',
  },
  image: {width: margins.w69, height: margins.h75},
  dataContainer: {flex: 1, flexDirection: 'row'},
  imageContainer: {flex: 1},
  baseText: {
    color: '#212529',
    fontFamily: 'Montserrat'
  }
});

const Card = memo(
  ({containerStyle, productData, touchable, onPress, onLongPress}) => {
    const Wrapper = touchable ? TouchableOpacity : View;
    return (
      <View style={containerStyle || cardContainer}>
        <View style={{...cardContent, ...Styles.innerCard}}>
          <Wrapper onPress={onPress} onLongPress={onLongPress}>
            <View style={Styles.dataContainer}>
              <View style={Styles.imageContainer}>
                <Image source={{uri: productData.image}} style={Styles.image} />
              </View>
              <View style={{marginLeft: margins.w82}}>
                <Text style={[Styles.baseText, {fontSize:12, lineHeight:15, fontWeight:'400'}]}>{`${productData.productName}`.slice(0, 70) + '...'}</Text>
                {/* <Text style={Styles.productPrice}>{`SKU: ${productData.sku}`}</Text> */}
                <Text style={Styles.productPrice}>{productData.price1}</Text>
              </View>
            </View>
          </Wrapper>
        </View>
      </View>
    );
  },
);

const CartCard = ({cart}) => {
  return (
    <View>
      <Card
        containerStyle={Styles.container}
        productData={cart}
        // touchable
        // onPress={() ? onLongPress : onPress}
      />
    </View>
  );
};
export default CartCard;
