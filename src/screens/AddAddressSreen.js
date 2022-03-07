import React, { useCallback, useReducer, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import countries from '../constants/countries.json';
import DropdownComponent from '../Components/Dropdown/Dropdown';
import { SAVE_ADDRESS } from '../redux/DispatcherFunctions/UserDispatchers';

const Countries = [];
countries.forEach(
  i =>
    i.regions.length &&
    Countries.push({ label: i.label, value: i.value, regions: i.regions }),
);

const defaultState = {
  firstname: '',
  lastname: '',
  moblie: '',
  address1: '',
  address2: '',
  country_id: '',
  state: '',
  city: '',
  postcode: '',
  showCountryDropDown: false,
};

const reducer = (state, { key, value }) => {
  const newState = { ...state, [key]: value };
  return newState;
};

function AddAddressSreen({ route, navigation }) {
  const dispatch = useDispatch();
  const [formState, formDispatch] = useReducer(reducer, defaultState);
  const [saveAddress, setSaveAddress] = useState(false);
  const [makeDefault, setMakeDefault] = useState(false);
  const states = (
    Countries.find(i => i.value === formState.country_id) ?.regions || []
  ).map(i => ({
      label: i.name,
      value: i.id,
    }));

  const firstnameChangeHandler = useCallback(
    text => formDispatch({ key: 'firstname', value: text }),
    [],
  );

  const lastnameChangeHandler = useCallback(
    text => formDispatch({ key: 'lastname', value: text }),
    [],
  );

  const moblieChangeHandler = useCallback(text => {
    if (isNaN(text)) {
      return;
    }
    formDispatch({ key: 'moblie', value: text });
  }, []);

  const adrs1ChangeHandler = useCallback(
    text => formDispatch({ key: 'address1', value: text }),
    [],
  );

  const adrs2ChangeHandler = useCallback(
    text => formDispatch({ key: 'address2', value: text }),
    [],
  );

  const countryChangeHandler = useCallback(value => {
    formDispatch({ key: 'country_id', value });
  }, []);

  const stateChangeHandler = useCallback(value => {
    formDispatch({ key: 'state', value });
  }, []);

  const cityChangeHandler = useCallback(
    text => formDispatch({ key: 'city', value: text }),
    [],
  );

  const postcodeChangeHandler = useCallback(
    text => formDispatch({ key: 'postcode', value: text }),
    [],
  );

  const SaveDate = () => {
    const address = {
      firstname: formState.firstname,
      lastname: formState.lastname,
      moblie: formState.moblie,
      street: [formState.address1, formState.address2],
      country_id: formState.country_id,
      state: formState.state,
      city: formState.city,
      postcode: formState.postcode,
      same_as_billing: 1,
      telephone: formState.moblie,
    };
    dispatch(SAVE_ADDRESS(address, navigation));
    // alert('save');
    // navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'column' }}>
            <View style={style.rw}>
              <TextInput
                label="First Name"
                underlineColor={inputUnderlineColor}
                underlineColorAndroid={inputUnderlineColor}
                theme={inputTheme}
                value={formState.firstname}
                onChangeText={firstnameChangeHandler}
              />
            </View>
            <View style={style.rw}>
              <TextInput
                label="Last Name"
                underlineColor={inputUnderlineColor}
                theme={inputTheme}
                value={formState.lastname}
                onChangeText={lastnameChangeHandler}
              />
            </View>
            <View style={style.rw}>
              <TextInput
                label="Mobile Number"
                underlineColor={inputUnderlineColor}
                theme={inputTheme}
                value={formState.moblie}
                keyboardType="numeric"
                maxLength={10} //setting limit of input
                onChangeText={moblieChangeHandler}
              />
            </View>
            <View style={style.rw}>
              <TextInput
                label="Address Line 1"
                underlineColor={inputUnderlineColor}
                theme={inputTheme}
                value={formState.address1}
                onChangeText={adrs1ChangeHandler}
              />
            </View>
            <View style={style.rw}>
              <TextInput
                label="Address Line 2"
                underlineColor={inputUnderlineColor}
                theme={inputTheme}
                value={formState.address2}
                onChangeText={adrs2ChangeHandler}
              />
            </View>
            <View style={style.rw}>
              <DropdownComponent
                label="Country"
                value={formState.country_id}
                setValue={countryChangeHandler}
                list={Countries}
              />
            </View>
            <View style={style.rw}>
              <DropdownComponent
                label="State"
                value={formState.state}
                setValue={stateChangeHandler}
                list={states}
              />
            </View>
            <View style={style.rw}>
              <TextInput
                label="City"
                underlineColor={inputUnderlineColor}
                theme={inputTheme}
                value={formState.city}
                onChangeText={cityChangeHandler}
              />
            </View>
            <View style={style.rw}>
              <TextInput
                label="Pin"
                underlineColor={inputUnderlineColor}
                theme={inputTheme}
                value={formState.pin}
                onChangeText={postcodeChangeHandler}
                keyboardType="numeric"
                maxLength={10} //setting limit of input
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View>
                <TouchableOpacity
                  onPress={() => setSaveAddress(!saveAddress)}
                  style={{ paddingRight: 5 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                      color="blue"
                      status={saveAddress ? 'checked' : 'unchecked'}
                    />
                    <Text>Save Address</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => setMakeDefault(!makeDefault)}
                  style={{ paddingRight: 5 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                      color="blue"
                      status={makeDefault ? 'checked' : 'unchecked'}
                    />
                    <Text>Make Default</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[style.rw, { marginTop: 25 }]}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#CDAF84',
                  alignItems: 'center',
                }}
                onPress={() => SaveDate()}>
                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>SAVE ADDRESS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
export default AddAddressSreen;

const inputTheme = {
  colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
  roundness: 0,
};
const inputUnderlineColor = '#CDAF84';

const style = StyleSheet.create({
  rw: {
    flex: 1,
    paddingBottom: 10,
  },
});
