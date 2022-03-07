import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import margins from '../../styles/margins';
import {colors} from '../../styles/color';
import {useSelector} from 'react-redux';
import Actions from '../../redux/actions';
import StoreKeys from '../../redux/storeKeys';
import {get, isEmpty, isNumber} from 'lodash';
import {getPriceToDisplay} from '../../Util/Functions';

const FIELDS = [
  {
    name: 'Cart Subtotal',
    fieldName: 'sub_total',
  },
  {
    name: 'Delivery Charges',
    fieldName: 'shipping_address.collect_shipping_rates',
  },
  {
    name: 'Shipping & Taxes',
    fieldName: 'shipping_address.shipping_amount',
  },
  {
    name: 'Discount Applied',
    fieldName: 'shipping_address.discount_amount',
  },
  {
    name: 'Ej cash Applied',
    fieldName: 'ejcash',
  },
  {
    name: 'GRAND TOTAL',
    fieldName: 'grand_total',
  },
];

const Styles = StyleSheet.create({
  seperator: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blackOpacity,
    paddingBottom: margins.h10,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  fieldName: {
    color:'#212529',
    fontFamily:'Montserrat',
    fontSize:13,
    fontWeight: '400',
    lineHeight:16
  },
  fieldVal: {
    color:'#212529',
    fontFamily:'Montserrat',
    fontSize:13,
    fontWeight: '400',
    lineHeight:16
  },
});

const Seperator = (props) => {
  return <View style={[{...props.style},Styles.seperator]} />;
};

const GrandTotal = () => {
  const cart = useSelector(
    state => state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA]?.data?.list,
  );
//console.log('aaaaa: ',cart);
  const iterator = useCallback(
    ({name, fieldName}, index) => {
      const shouldShow =
        isNumber(get(cart, fieldName)) || !isEmpty(get(cart, fieldName));
      if (!shouldShow) {
        return null;
      }      
      const fldVal = getPriceToDisplay(get(cart, fieldName));
      let shwFldVal = '';
      if(['shipping_address.collect_shipping_rates', 'shipping_address.shipping_amount'].indexOf(fieldName) !== -1){
        shwFldVal = Number(fldVal) === 0 ? 'Free' : ('\u20B9' + fldVal);
      }else if(['shipping_address.discount_amount', 'ejcash'].indexOf(fieldName) !== -1){
        shwFldVal = '-' + '\u20B9' + ' ' + fldVal;
      }else{
        shwFldVal = '\u20B9' + ' ' + fldVal;
      }

      return (
        <>
        {fieldName === 'grand_total' &&
          <Seperator style ={{marginBottom:margins.h10}}/>
        }
        <View key={name + index} style={Styles.fieldContainer}>
        {(fieldName === 'grand_total') &&
          <>
          <Text style={[Styles.fieldName,{fontSize:14, fontWeight:'600'}]}>{name}:</Text>
          <Text style={[Styles.fieldVal,{fontSize:14, fontWeight:'600'}]}>{shwFldVal}</Text>
          </>
        }
        {(fieldName === 'ejcash') &&
          <>
          <Text style={[Styles.fieldName,{color:'#cdb083'}]}>{name}:</Text>
          <Text style={[Styles.fieldVal,{color:'#cdb083'}]}>{shwFldVal}</Text>
          </>
        }
        {['grand_total','ejcash'].indexOf(fieldName) == -1 &&
          <>
          <Text style={Styles.fieldName}>{name}:</Text>
          <Text style={Styles.fieldVal}>{shwFldVal}</Text>
          </>
        }
        </View>
        </>
      );
    },
    [cart],
  );

  return (
    <View>
      <Seperator />
      {FIELDS.map(iterator)}
      <Seperator />
    </View>
  );
};

export default GrandTotal;

/*
{
  "Items": [
    {
      "avalable_qty": 10, "brand_image_url": "https://image.ejohri.com/vendor%2F266%2Fv-logo-1626187774819.jpg", "image": "https://image.ejohri.com/catalog/product/266/JNJ-221-1.jpg", "item_id": "82754", "max_sale_qty": 10000, "metal": "Gold 18kt", "price": "7,652", "price1": "₹7,652", "price_usd": "117", "productId": "43378", "productName": "Traditional Enamel Floral Yellow Gold 18kt Ring-JNJ-221", "productUrl": "traditional-enamel-floral-yellow-gold-18kt-ring-jnj-221", "product_qty": 1, "sku": "266-JNJ-221", "store_brand_address": "328/21/001, Old Subzi Mandi Chowk, In Gol Darwaza, Lucknow - 226003", "store_brand_city": "Lucknow", "store_brand_id": 266, "store_brand_name": "Jagat Narayan Jewels"
    }], 
    "billing_address": {
      "address_id": "142100", "address_type": "billing", "applied_taxes": "null", "base_discount_amount": "0.0000", "base_discount_tax_compensation_amount": "0.0000", "base_grand_total": "0.0000", "base_rewardpoints": null, "base_shipping_amount": "0.0000", "base_shipping_discount_amount": "0.0000", "base_shipping_discount_tax_compensation_amnt": null, "base_shipping_incl_tax": "0.0000", "base_shipping_tax_amount": "0.0000", "base_subtotal": "0.0000", "base_subtotal_total_incl_tax": null, "base_subtotal_with_discount": "0.0000", "base_tax_amount": "0.0000", "city": "Santa", "collect_shipping_rates": "0", "company": null, "country_id": "IN", "created_at": "2021-12-24 11:04:58", "customer_address_id": null, "customer_id": "17791", "customer_notes": null, "discount_amount": "0.0000", "discount_description": null, "discount_tax_compensation_amount": "0.0000", "email": "mitesh@ejohri.com", "fax": null, "firstname": "Padeep", "free_shipping": "0", "gift_message_id": null, "grand_total": "0.0000", "lastname": "Sharma", "middlename": null, "postcode": "400055", "prefix": null, "quote_id": "55106", "region": "Bihar", "region_id": "489", "rewardpoints": null, "rewardpoints_description": null, "rewardpoints_gathered": "0.0000", "rewardpoints_quantity": null, "rewardpoints_referrer": null, "same_as_billing": "0", "save_in_address_book": "0", "shipping_amount": "0.0000", "shipping_description": null, "shipping_discount_amount": "0.0000", "shipping_discount_tax_compensation_amount": "0.0000", "shipping_incl_tax": "0.0000", "shipping_method": null, "shipping_tax_amount": "0.0000", "street": "Line1Line2", "subtotal": "0.0000", "subtotal_incl_tax": "0.0000", "subtotal_with_discount": "0.0000", "suffix": null, "tax_amount": "0.0000", "telephone": "9167658406", "updated_at": "2021-12-24 11:04:58", "validated_country_code": null, "validated_vat_number": null, "vat_id": null, "vat_is_valid": null, "vat_request_date": null, "vat_request_id": null, "vat_request_success": null, "weight": "0.0000"
    }, 
    "created_at": "2021-07-30 09:53:42", 
    "currency": "INR", 
    "ejcash": 765.211, 
    "grand_total": "6,887", 
    "grand_total_usd": "105", 
    "quote_id": "55106", 
    "shipping_address": {
      "address_id": "119841", 
      "address_type": "shipping", 
      "applied_taxes": "[]", 
      "base_discount_amount": "0.0000", 
      "base_discount_tax_compensation_amount": "0.0000", 
      "base_grand_total": "6886.8990", 
      "base_rewardpoints": null,
       "base_shipping_amount": "0.0000", 
       "base_shipping_discount_amount": "0.0000", 
       "base_shipping_discount_tax_compensation_amnt": null, 
       "base_shipping_incl_tax": "0.0000", 
       "base_shipping_tax_amount": "0.0000", 
       "base_subtotal": "7652.1100", 
       "base_subtotal_total_incl_tax": "7652.1100", 
       "base_subtotal_with_discount": "7652.1100", 
       "base_tax_amount": "0.0000", 
       "carrier_code": "", 
       "city": "Santa", 
       "collect_shipping_rates": "0", 
       "company": null, 
       "country_id": "IN", 
       "created_at": "2021-07-30 09:53:42", 
       "customer_address_id": null, 
       "customer_id": "17791", 
       "customer_notes": null, 
       "discount_amount": "0.0000", 
       "discount_description": null, 
       "discount_tax_compensation_amount": "0.0000", 
       "email": "mitesh@ejohri.com", 
       "fax": null, "firstname": "Padeep", 
       "free_shipping": "0", 
       "gift_message_id": null, 
       "grand_total": "6886.8990", 
       "lastname": "Sharma",
      "middlename": null, 
      "postcode": "400055", 
      "prefix": null, 
      "quote_id": "55106", 
      "region": "Bihar", 
      "region_id": "489", 
      "rewardpoints": null, 
      "rewardpoints_description": null, 
      "rewardpoints_gathered": "0.0000", 
      "rewardpoints_quantity": null, 
      "rewardpoints_referrer": null, 
      "same_as_billing": "0", 
      "save_in_address_book": "0", 
      "shipping_amount": "0.0000", 
      "shipping_amount_usd": 0, 
      "shipping_description": "Free Shipping - Free", 
      "shipping_discount_amount": "0.0000", 
      "shipping_discount_tax_compensation_amount": "0.0000", 
      "shipping_incl_tax": "0.0000", 
      "shipping_method": "freeshipping_freeshipping", 
      "shipping_tax_amount": "0.0000", 
      "street": "Line1Line2", 
      "subtotal": "7652.1100", 
      "subtotal_incl_tax": "7652.1100", 
      "subtotal_with_discount": "7652.1100", 
      "suffix": null, 
      "tax_amount": "0.0000", 
      "telephone": "9167658406", 
      "updated_at": "2021-12-24 11:31:21", 
      "validated_country_code": null, 
      "validated_vat_number": null, 
      "vat_id": null, 
      "vat_is_valid": null, 
      "vat_request_date": null, 
      "vat_request_id": null, 
      "vat_request_success": null, "weight": "1.5000"
    }, 
    "sub_total": "7,652", 
    "sub_total_usd": "117", 
    "total_ejcash": "11,000"
}
*/