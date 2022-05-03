/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TextInput, HelperText, Checkbox } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { WebView } from 'react-native-webview';

import SmartLoader from './SmartLoader';
import { pathSettings } from '../api/pathSettings';
import { login, signup } from '../api/auth';
import { moveAsyncToServer } from '../screens/CartUtil';
import countries from '../constants/signUpCountries.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { SAVE_USER_DATA } from '../redux/DispatcherFunctions/UserDispatchers';
import validator from 'validator';

function LoginScreen({ route, navigation }) {
  var { navigatePage } = route.params;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(true);
  const [username, setUsername] = React.useState(undefined);
  const [password, setPassword] = React.useState(undefined);
  const [loginMsg, setLoginMsg] = React.useState('');

  const [firstname, setFirstname] = React.useState(undefined);
  const [lastname, setLastname] = React.useState(undefined);
  const [moblie, setMoblie] = React.useState(undefined);
  const [email, setEmail] = React.useState(undefined);
  const [country, setCountry] = React.useState('IN');
  const [signup_password, setSignup_password] = React.useState(undefined);
  const [signup_conf_password, setSignup_conf_password] = React.useState(undefined);
  const [is_show_signup_otp, set_Is_show_signup_otp] = React.useState(false);
  const [signup_otp, Setsignup_otp] = React.useState(undefined);
  const [signup_otp_verify_msg, Setsignup_otp_verify_msg] = React.useState('');

  const [isCountryVisible, setIsCountryVisible] = React.useState(false);
  const [isTermcond, setIsTermcond] = React.useState(true);
  const [termModalVisible, setTermModalVisible] = React.useState(false);


  const dispatch = useDispatch();

  const navigateAfterLoginorSignup = () => {
    switch (navigatePage) {
      case 'checkout':
        navigation.navigate('checkout', { screen: 'Checkout' });
        break;
      case 'account':
        navigation.navigate('account', { screen: 'Account' });
        break;
    }
  }

  const onLogin = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    let t_msg = await login({ username: username, password: password });
    console.log('login success', t_msg);
    //const userData = await AsyncStorage.getItem('ej_store').then(JSON.parse);
    //dispatch(SAVE_USER_DATA(userData.user));

    if (t_msg?.length == 0) {
      const userData = await AsyncStorage.getItem('ej_store').then(JSON.parse);
      dispatch(SAVE_USER_DATA(userData.user));

      await moveAsyncToServer();
      //console.log('xxxxxxxxx: ',navigatePage);
      setIsLoading(false);
      navigateAfterLoginorSignup();
      
      //navigation.navigate(navigatePage ? navigatePage : 'account');
    } else {
      setIsLoading(false);
      setLoginMsg(t_msg);
    }
  };

  const onSignup = async () => {
    setIsLoading(true);

    let t_msg = await signup({
      firstname: firstname,
      lastname: lastname,
      moblie: moblie,
      email: email,
      countryId: country,
      password: signup_password,
    });

    if (t_msg.length == 0) {
      const userData = await AsyncStorage.getItem('ej_store').then(JSON.parse);
      dispatch(SAVE_USER_DATA(userData.user));

      await moveAsyncToServer();
      setIsLoading(false);
      navigateAfterLoginorSignup();
    } else {
      setIsLoading(false);
      set_Is_show_signup_otp(false);
      Alert.alert(t_msg);
    }
    console.log('Msg:', t_msg);

    /*
    {
      "code":"OK",
      "data":{
        "list":[
          {
            "name":"chaubey manishx",
            "token":"cwcfgcfb01ugj640dpwavm9wjqp33aw1",
            "email":"mit1234@gmail.com",
            "customerId":"31765",
            "moblie_verified":"0",
            "mobile":"9167658406",
            "storevisit":0,
            "wishlist":0,
            "quote_id":null,
            "cart":0
          }
        ],
        "token":"cwcfgcfb01ugj640dpwavm9wjqp33aw1"
      },
      "status":200,
      "message":"Customer Register Successfully."
    }
    */
    /*
    {
      "code":"BAD_REQUEST",
      "data":[],
      "status":400,
      "message":"A customer with the same email address already exists in an associated website."
    }
    */
  };

  const getSignupOtp = async (isRetry) => {
    const url = 'https://api.msg91.com/api/v5/otp';
    const authkey = '126721AxmhRdXb5lS57ece7d3';
    const template_id = '5fc64601a8c55d6eca645493';
    const mobile = '91' + moblie;

    //const url = 'https://api.msg91.com/api/v5/otp?authkey=126721AxmhRdXb5lS57ece7d3&template_id=5fc64601a8c55d6eca645493&mobile=91' + mobno;

    const requestUrl = url
      + (isRetry ? '/retry/' : '')
      + ('?authkey=' + authkey)
      + (isRetry ? '' : '&template_id=' + template_id)
      + ('&mobile=' + mobile);

    //console.log(requestUrl);
    setIsLoading(true);
    set_Is_show_signup_otp(true);
    Setsignup_otp(undefined);
    Setsignup_otp_verify_msg('');

    try {
      let response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          //'Accept': 'application/json',
          'Content-Type': 'application/json',
          //'User-Agent': '*'
        }
      });

      let resJson = await response.json();
      if (resJson.type === 'success') {
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  const VerifySignupOtp = async () => {
    const url = 'https://api.msg91.com/api/v5/otp/verify/';
    const authkey = '126721AxmhRdXb5lS57ece7d3';
    const mobile = '91' + moblie;

    let formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', signup_otp);
    formData.append('authkey', authkey);

    setIsLoading(true);
    Setsignup_otp_verify_msg('');

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      let resJson = await response.json();
      setIsLoading(false);
      console.log(resJson);
      if (resJson.type === 'success') {
        onSignup();
      } else {
        Setsignup_otp_verify_msg(resJson.message);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  const Valid_Signup_moblie = () => {
    return (moblie !== undefined && validator.isNumeric(moblie) && moblie.length == 10);
  }
  const Valid_Signup_email = () => {
    return (email !== undefined && validator.isEmail(email));
  }
  const Valid_Signup_password = () => {
    return (signup_password !== undefined && validator.isStrongPassword(signup_password));
  }
  const Valid_Signup_conf_password = () => {
    return (signup_conf_password !== undefined && signup_conf_password === signup_password);
  }

  return (
    <View style={{ flex: 1 }}>
      <SmartLoader isLoading={isLoading} />
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <View
          style={[
            isLogin ? { borderBottomWidth: 3, borderBottomColor: '#063374' } : '',
            { padding: 5 },
          ]}>
          <TouchableOpacity onPress={() => {
            setIsLogin(true);
            set_Is_show_signup_otp(false);
          }}>
            <Text style={{ color: '#063374', fontSize: 17, fontWeight: '700' }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            isLogin ? '' : { borderBottomWidth: 3, borderBottomColor: '#063374' },
            { padding: 5 },
          ]}>
          <TouchableOpacity onPress={() => setIsLogin(false)}>
            <Text style={{ color: '#063374', fontSize: 17, fontWeight: '700' }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={[{ flex: 1, padding: 15 }, isLogin ? '' : { display: 'none' }]}>
          <View>
            <TextInput
              label="Email Address / Mobile"
              autoCapitalize='none'
              autoCorrect={false}
              underlineColor="#CDAF84"
              underlineColorAndroid="#CDAF84"
              theme={{
                colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                roundness: 0,
              }}
              value={username}
              onChangeText={text => setUsername(text)}
            />
            <HelperText
              type="error"
              visible={username !== undefined && username.length == 0}>
              This field is required
            </HelperText>
            <HelperText
              type="error"
              visible={loginMsg !== undefined && loginMsg.length !== 0}>
              Invalid Email Address
            </HelperText>
          </View>
          <View style={{ marginTop: 15 }}>
            <TextInput
              secureTextEntry={true}
              label="Password"
              underlineColor="#CDAF84"
              underlineColorAndroid="#CDAF84"
              theme={{
                colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                roundness: 0,
              }}
              right={
                <TextInput.Icon
                  style={{
                    minWidth: 70,                     
                    marginRight: 30,
                    borderRadius:0
                  }}
                  name={() => <Text style={{fontSize: 16, margin:5,}}>Forgot?</Text>}
                  onPress={() => {
                    navigation.navigate('ForgotPassword');
                  }}
                />
              }
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <HelperText
              type="error"
              visible={password !== undefined && password.length == 0}>
              This field is required
            </HelperText>
            <HelperText
              type="error"
              visible={loginMsg !== undefined && loginMsg.length !== 0}>
              {loginMsg}
            </HelperText>
          </View>
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                width: '70%',
                borderRadius: 2,
                alignItems: 'center',
                padding: 13,
                backgroundColor: '#CDAF84',
              }}
              onPress={() => {
                if (username === undefined) setUsername('');
                if (password === undefined) setPassword('');

                if (
                  username !== undefined &&
                  username.length > 0 &&
                  password !== undefined &&
                  password.length > 0
                ) {
                  onLogin();
                }
              }}>
              <Text style={{ color: '#FFFFFF', fontSize: 16 }}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[{ flex: 1, padding: 15 }, isLogin ? { display: 'none' } : '']}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={150}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}>
              {!is_show_signup_otp &&
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingRight: 7 }}>
                      <TextInput
                        label="First Name"
                        underlineColor="#CDAF84"
                        underlineColorAndroid="#CDAF84"
                        theme={{
                          colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                          roundness: 0,
                        }}
                        value={firstname}
                        onChangeText={text => setFirstname(text)}
                      />
                      <HelperText
                        type="error"
                        visible={firstname !== undefined && firstname.length == 0}>
                        This field is required
                      </HelperText>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 7 }}>
                      <TextInput
                        label="Last Name"
                        underlineColor="#CDAF84"
                        underlineColorAndroid="#CDAF84"
                        theme={{
                          colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                          roundness: 0,
                        }}
                        value={lastname}
                        onChangeText={text => setLastname(text)}
                      />
                      <HelperText
                        type="error"
                        visible={lastname !== undefined && lastname.length == 0}>
                        This field is required
                      </HelperText>
                    </View>
                  </View>
                  <View>
                    <TextInput
                      label="Mobile Number"
                      underlineColor="#CDAF84"
                      underlineColorAndroid="#CDAF84"
                      theme={{
                        colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                        roundness: 0,
                      }}
                      value={moblie}
                      onChangeText={text => setMoblie(text)}
                    />
                    <HelperText
                      type="error"
                      //visible={moblie !== undefined && (moblie.length == 0 || !validator.isNumeric(moblie) || moblie.length !== 10)}
                      visible={moblie !== undefined && !Valid_Signup_moblie()}
                    >
                      {moblie ?.length == 0 ? 'This field is required' : 'Mobile Number is not valid'}
                    </HelperText>
                  </View>
                  <View>
                    <TextInput
                      label="Email Address"
                      autoCapitalize='none'
                      autoCorrect={false}
                      underlineColor="#CDAF84"
                      underlineColorAndroid="#CDAF84"
                      theme={{
                        colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                        roundness: 0,
                      }}
                      value={email}
                      onChangeText={text => setEmail(text)}
                    />
                    <HelperText
                      type="error"
                      //visible={email !== undefined && (email.length == 0 || !validator.isEmail(email))}
                      visible={email !== undefined && !Valid_Signup_email(email)}
                    >
                      {email ?.length == 0 ? 'This field is required' : 'Email address is not valid'}
                    </HelperText>
                  </View>
                  <View style={{ paddingBottom: 22 }}>
                    <DropDown
                      //underlineColor="#CDAF84"
                      //underlineColorAndroid="#CDAF84"

                      label="Country"
                      visible={isCountryVisible}
                      showDropDown={() => setIsCountryVisible(true)}
                      onDismiss={() => setIsCountryVisible(false)}
                      value={country}
                      setValue={val => {
                        //console.log(val);
                        setCountry(val);
                      }}
                      list={countries}
                      theme={{
                        colors: { surface: '#FFFFFF', text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                        roundness: 0,
                      }}
                      activeColor='#FFFFFF'

                      //dropDownStyle={{color:'pink', backgroundColor:'red', margin:0, padding:0}}
                      dropDownItemStyle={{ backgroundColor: '#FFFFFF' }}
                      dropDownItemSelectedStyle={{ backgroundColor: '#3985ff' }}

                    />
                  </View>
                  <View>
                    <TextInput
                      secureTextEntry={true}
                      label="Password"
                      underlineColor="#CDAF84"
                      underlineColorAndroid="#CDAF84"
                      theme={{
                        colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                        roundness: 0,
                      }}
                      value={signup_password}
                      onChangeText={text => setSignup_password(text)}
                    />
                    <HelperText
                      type="error"
                      //visible={signup_password !== undefined && (signup_password.length == 0 || !validator.isStrongPassword(signup_password))}
                      visible={signup_password !== undefined && !Valid_Signup_password()}
                    >
                      {signup_password ?.length == 0 ?
                        'This field is required' :
                        (Valid_Signup_password() ? '' : 'Password should be alphanumeric, minimum 8 charaters with one upper case')
                      }
                    </HelperText>
                  </View>
                  <View>
                    <TextInput
                      secureTextEntry={true}
                      label="Confirm Password"
                      underlineColor="#CDAF84"
                      underlineColorAndroid="#CDAF84"
                      theme={{
                        colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                        roundness: 0,
                      }}
                      value={signup_conf_password}
                      onChangeText={text => setSignup_conf_password(text)}
                    />
                    <HelperText
                      type="error"
                      //visible={signup_conf_password !== undefined && (signup_conf_password.length == 0 || signup_conf_password !== signup_password)}
                      visible={signup_conf_password !== undefined && !Valid_Signup_conf_password()}
                    >
                      {
                        signup_conf_password ?.length == 0 ? 'This field is required' : 'Password does not match'
                      }
                    </HelperText>

                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={() => setIsTermcond(!isTermcond)}
                      style={{ paddingRight: 5 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox.Android
                          color="blue"
                          status={isTermcond ? 'checked' : 'unchecked'}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setTermModalVisible(true);
                      }}>
                      <Text style={{ fontSize: 17 }}>
                        I accept the Terms and Conditions
                </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <TouchableOpacity
                      style={{
                        width: '70%',
                        borderRadius: 2,
                        alignItems: 'center',
                        padding: 13,
                        backgroundColor: '#CDAF84',
                      }}
                      onPress={async () => {
                        // Password should be alphanumeric, minimum 8 charaters with one upper case
                        // Password does not match
                        if (firstname === undefined) setFirstname('');
                        if (lastname === undefined) setLastname('');
                        if (moblie === undefined) setMoblie('');
                        if (email === undefined) setEmail('');
                        if (country === undefined) setCountry('');
                        if (signup_password === undefined) setSignup_password('');
                        if (signup_conf_password === undefined) setSignup_conf_password('');

                        if (
                          isTermcond &&
                          firstname.length > 0 &&
                          lastname.length > 0 &&
                          Valid_Signup_moblie() &&
                          Valid_Signup_email() &&
                          country.length > 0 &&
                          Valid_Signup_password() &&
                          Valid_Signup_conf_password()
                        ) {
                          getSignupOtp();
                        }
                      }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 16 }}>SIGN UP</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              {is_show_signup_otp &&
                <View>
                  <View>
                    <View style={{ flex: 1, paddingRight: 7 }}>
                      <TextInput
                        label="OTP"
                        underlineColor="#CDAF84"
                        underlineColorAndroid="#CDAF84"
                        theme={{
                          colors: { text: '#000000', placeholder: '#000000', primary: '#CDAF84', background: '#F7F7F7' },
                          roundness: 0,
                        }}
                        value={signup_otp}
                        onChangeText={text => {
                          Setsignup_otp(text);
                          Setsignup_otp_verify_msg('');
                        }}
                      />
                      <HelperText
                        type="error"
                        visible={(signup_otp !== undefined && signup_otp.length == 0) || signup_otp_verify_msg.length > 0}>
                        {
                          //signup_otp_verify_msg.length >0 ? signup_otp_verify_msg : 'This field is required'
                          signup_otp ?.length == 0 ? 'This field is required' : signup_otp_verify_msg
                        }
                      </HelperText>
                    </View>
                    <View style={{ paddingVertical: 30 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#cdb083',
                          padding: 10,
                          alignItems: 'center',
                          marginHorizontal: '10%'
                        }}
                        onPress={() => {
                          if (signup_otp ?.length > 0) {
                            VerifySignupOtp();
                          }
                        }}
                      >
                        <Text
                          style={[style.baseText, { color: '#FFFFFF', fontSize: 13, fontWeight: '500' }]}
                        >VERIFY</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#cdb083',
                          padding: 10,
                          alignItems: 'center',
                          marginHorizontal: '10%'
                        }}
                        onPress={() => {
                          getSignupOtp(true);
                        }}
                      >
                        <Text
                          style={[style.baseText, { color: '#FFFFFF', fontSize: 13, fontWeight: '500' }]}
                        >RESEND OTP</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={termModalVisible}
        // onRequestClose={() => {
        //     //Alert.alert("Modal has been closed.");
        //     setTermModalVisible(!termModalVisible);
        // }}
        style={{ backgroundColor: '#FFFFFF' }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={{ flex: 1, margin: 5, backgroundColor: '#FFFFFF' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>Terms And Conditions</Text>
              </View>
              <View style={{}}>
                <Pressable
                  style={{ padding: 8 }}
                  onPress={() => setTermModalVisible(!termModalVisible)}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold' }}>X</Text>
                </Pressable>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  <Text style={style.termText}>
                    Welcome to www.ejohri.com (“Website”).
                </Text>
                </View>
                <View>
                  <Text style={style.termText}>
                    This document is an electronic record in terms of the
                    Information Technology Act, 2000 and rules made thereunder and
                    as the same may be amended from time to time. Being a system
                    generated electronic record, it does not require any physical
                    or digital signature.
                </Text>
                </View>
                <View>
                  <Text style={style.termText}>
                    Greetings from www.ejohri.com (“Website”). The Website is
                    owned by EJOHRI JEWEL HUB PRIVATE LIMITED, a company
                    incorporated under the Companies Act, 2013 having CIN
                    U74900MH2015PTC265432, and having its registered office at
                    105, Adhyaru Industrial Premises Co-op Society Ltd., Near Sun
                    Mill Compound, Lower Parel (W), Mumbai 400013, India
                    ("eJOHRI").
                </Text>
                </View>
                <View>
                  <Text style={style.termText}>
                    If you use the Website, you are required to first carefully
                    read as well as fully understand the following Website related
                    terms and conditions (“Terms of Use”) which are applicable
                    when you view/access/use (collectively “use” or “using”) the
                    Website from any computer, computer device or mobile. Please
                    also carefully and fully understand read our Privacy Policy
                    available at the link (“Privacy Policy”), which is
                    incorporated in these Terms of Use by reference.
                </Text>
                </View>
                <View>
                  <Text style={style.termText}>
                    If, for any reason, you do not agree to these Terms of Use,
                    Privacy Policy and/or other Website guidelines and policies
                    (Website guidelines and policies collectively referred to as
                    “Other Policies”) as communicated to you when you avail the
                    Website or wish to be bound by them, please do not use the
                    Website in any way whatsoever. By using the Website, you have
                    indicated to us that you acknowledge, understand as well as
                    fully agree, to be bound by these Terms of Use, Privacy Policy
                    and all Other Policies, irrespective whether you register with
                    the Website as a member or not.
                </Text>
                </View>
                <View>
                  <Text style={style.termText}>
                    As long as you adhere to the Terms of Use, Privacy Policy and
                    Other Policies, we grant you a personal, revocable,
                    non-exclusive, non-transferable and limited right and license
                    to use the Website.
                </Text>
                </View>
                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Acceptance of Terms, etc
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    These Terms of Use is in the form of an electronic and legally
                    binding contract that establishes the terms and conditions you
                    have accepted before using the Website. These include our
                    Privacy Policy and Other Policies as mentioned in these Terms
                    of Use as well as other specific policies and terms and
                    conditions disclosed to you, in case you avail any
                    subscription or any additional features, products or services
                    we offer on or through the Website, whether free or otherwise,
                    including but not limited to terms governing features,
                    billing, free trials, discounts, promotions, refunds,
                    cancellations and shipping. By using the Website, you hereby
                    unconditionally consent and accept to these Terms, Privacy
                    Policy and such Other Policies. To withdraw such consent, you
                    must immediately cease using the Website and terminate your
                    account with us. You are requested to keep a physical copy of
                    these Terms of Use and all other referred policies herein for
                    your records.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={[style.termTextB]}>
                    Every time you use the Website, you confirm your agreement
                    with these Terms of Use, Privacy Policy and Other Policies.
                </Text>
                </View>
                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Eligibility
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Use of the Website is available only to persons who can form
                    legally binding contracts under Indian Contract Act, 1872 and
                    who have attained a minimum age of 18 (eighteen) years. By
                    using the Website, you represent and warrant that you are at
                    least 18 (eighteen) years of age or not a minor in any other
                    jurisdiction from where you access our Website. As a minor if
                    you wish to use or make any transaction on the Website, such
                    use or transaction may be made by you through your parents or
                    legal guardian. We reserve the right to terminate your
                    membership and/or refuse to provide you with access to the
                    Website if it is brought to our notice or if it is discovered
                    that you are under the age of 18 (eighteen)cyears.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Using the Website may be prohibited or restricted in certain
                    jurisdictions. If you use the Website from such
                    prohibited/restricted jurisdiction, you are solely responsible
                    and liable and responsible for any compliance/non-compliance
                    with the laws and regulations thereof.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    By using the Website, you hereby represent and warrant to us
                    that you have all right, authority and capacity to enter into
                    these Terms of Use and to abide by all of the terms and
                    conditions thereof.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Unless otherwise specified, the Website is currently offered
                    in India only. We make no representation that the Website will
                    be offered to be appropriate or available for use in other
                    jurisdictions. Those who choose to access the Website from
                    outside India can do so on their own account and we shall not
                    be responsible for any circumstances thereof.
                </Text>
                </View>
                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Creating an Account
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    In order to use all the features of the Website, you must
                    register yourself with the Website. If you do not wish to
                    register, all of the Website features may not be available to
                    you. However, if you do so, you authorize us to access and use
                    certain account information of yours, including but not
                    limited to your profile information your interests and
                    dislikes and other information as detailed under our Privacy
                    Policy. For more information regarding the type/nature of
                    information we collect from you and how we use it, please
                    refer our Privacy Policy at the link.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You shall be responsible for maintaining the utmost privacy
                    and confidentiality of your membership and account details you
                    provide to us and the same must always be kept private and
                    confidential and should not be disclosed to or permitted to be
                    used by anyone else and you are solely responsible and liable
                    for any and all usage and activity on the Website that takes
                    place under your account. You agree to immediately notify us
                    of any disclosure or unauthorized use of your Website account
                    details or any other breach of security at and ensure that you
                    log-out from your Website account at the end of each session.
                    Further, you agree that if you provide any information that is
                    untrue, incomplete, inaccurate, or not updated or we have
                    reasonable grounds to suspect that such information is untrue,
                    incomplete, inaccurate or not updated, or not in accordance
                    with this Terms of Use, we shall have the right to temporarily
                    suspend or permanently terminate your Website membership.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    By agreeing to these Terms of Use, you grant us the permission
                    to send electronic communications to you as part of our
                    offering. This includes but is not limited to sending
                    "emails", newsletters and promotional offers from us and our
                    partner websites. Should you no longer wish to receive these
                    electronic communications, you may write to us at.
                </Text>
                </View>
                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Proprietary Rights
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You confirm and agree that we and/or our vendor partners are
                    the owners of the proprietary information made available to
                    you through the Website and hereby retain all proprietary
                    rights in the same.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We or other Website users or vendor partners may
                    upload/publish/post any copyrighted information and materials,
                    whether having copyright protection or not and whether bearing
                    any trademark or not, or which may be identified as copyright
                    or a trademark. You undertake not to post, copy, reproduce,
                    modify, publish, transmit, distribute, perform, display,
                    commercially use/exploit, sell or use such information or
                    materials in any way, whether partly or fully, and for any
                    purpose whatsoever.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    By posting information or content to any permitted area of the
                    Website, or making it accessible to us by linking your account
                    to any social network accounts (e.g. via Facebook, etc.), you
                    grant us unconditionally and in perpetuity, and represent and
                    warrant that you have the right to grant to us, an
                    irrevocable, perpetual, non-exclusive,
                    fully-paid/royalty-free, worldwide right and license to use,
                    reproduce, store, publicly display and distribute such
                    information and content, and to prepare derivative works of,
                    or incorporate into other works, such information and content,
                    and to grant and authorize sub-licenses of the foregoing
                    anywhere in the world. From time to time, we may modify, add
                    or vary existing features or programs of the Website or
                    create, add, test or implement new features or programs on the
                    Website in which you may voluntarily choose to participate or
                    may be a part of a test group with special access, in
                    accordance with the additional terms and conditions of such
                    features or programs. By participating in such features or
                    programs, you grant us an unconditional and perpetual right
                    and consent to the terms and conditions (if any) of such
                    features or programs which will be in addition to these Terms
                    of Use.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Website as a Platform
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    eJOHRI is merely an intermediary and provides the Website
                    which serves as a platform to the Website users to interact
                    and transact and therefore, as per the Information Technology
                    Act, 2000 and rules made thereunder, eJOHRI is neither the
                    creator nor the publisher of any content available on the
                    Website. eJOHRI is not and cannot be a party to or control in
                    any manner any transaction between the Website users. By
                    acting merely as an intermediary, eJOHRI assumes no
                    responsibility or liability of any sort whatsoever for
                    providing the said platform to the Website users. To protect
                    the integrity of the platform, eJOHRI reserves the right, but
                    has no obligation, to exercise editorial control over any
                    content, including the right to block any Website user from
                    accessing the Website, whether temporarily or permanently.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    All commercial and contractual terms are offered by and agreed
                    to between Website users (buyers and sellers). Such terms
                    include without limitation pricing, payment methods and
                    payment terms, shipping and delivery, warranties related to
                    products and services and after sales services related to
                    products and services. We neither have nor exercise any
                    control or advise or get involved in any way in any
                    transaction between such buyers and sellers.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We do not make any representation or warranty as to the
                    creditworthiness or identity of any Website user. You are
                    advised to independently verify the bona fides of any
                    particular Website user that you choose to deal or interact
                    with on the Website.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We do not make any representation or warranty as to the
                    specifics or features of any of the products or services
                    offered on the Website. Further, we do not in any way support
                    or endorse the sale or purchase of any products or services on
                    the Website. We accept no liability of any nature whatsoever
                    for any errors or omissions, whether on our behalf or on
                    behalf of any third parties.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We are not responsible for any non-performance or breach of
                    any contract entered into between buyers and sellers. We
                    cannot and do not guarantee that the concerned buyers and/or
                    sellers will perform any transaction concluded on or through
                    the Website. We are further not entitled to resolve any
                    dispute or disagreement between the buyers and sellers.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We do not at any point of time have any right, title, claim or
                    interest over the products or services offered by any Website
                    user on the Website.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You hereby agree that pricing of any product or services as
                    reflected on the Website, due to inadvertence or some
                    technical issue, typographical error or product information
                    published by the seller, may be incorrectly reflected and in
                    such an event, the seller may cancel any of your such order.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You release and indemnify eJOHRI and/or any of its directors,
                    partners, officers and representatives from any and all cost,
                    damage, liability or other consequence of any of the actions
                    of any of the Website users and waive any claims that you may
                    have in this behalf under any applicable law.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Website Charges
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Membership on the Website is free for buyers. We do not charge
                    any fee for browsing and buying on the Website. However, we
                    expressly reserve our right to levy a fee from time to time.
                    If any such fee is levied, we will post the same on the
                    Website and such fees shall automatically become effective
                    immediately after they are posted on the Website. Unless
                    otherwise stated, all fees shall be quoted in Indian Rupees.
                    You shall be solely responsible for compliance of all
                    applicable laws including those in India for making payments
                    to eJOHRI.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Prohibited Activities
                </Text>
                  <Text
                    style={[style.termText, { paddingTop: 0, paddingBottom: 0 }]}>
                    We reserve the right to investigate, suspend and/or terminate,
                    whether temporarily or permanently, your Website account with
                    us if you undertake any of the following acts:
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    breach these Terms of Use, Privacy Policy or Other Policies.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    abuse, impersonate or defame any Website user or any other
                    person, entity or any religious community.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    displaying, publishing, transmitting or sharing any
                    information or content that is grossly harmful, harassing,
                    blasphemous, defamatory, obscene, pornographic, paedophilic,
                    libellous, invasive of another's privacy, hateful, or
                    racially, ethnically objectionable, disparaging, relating or
                    encouraging money laundering or gambling, or otherwise
                    unlawful in any manner whatever; or unlawfully threatening or
                    unlawfully harassing including but not limited to "indecent
                    representation of women" within the meaning of the Indecent
                    Representation of Women (Prohibition) Act, 1986.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    displaying, publishing, transmitting or sharing any
                    information or content that is misleading in any way.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    displaying, publishing, transmitting or sharing any video,
                    photograph, or image of any Website user or any other third
                    party.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    use the Website for any commercial use or activity not
                    expressly permitted under these Terms of Use.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    “stalk” or otherwise harass any Website user or any other
                    person
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    make any statements, whether expressed or implied, and whether
                    privately or publicly, as those endorsed by us without our
                    specific prior written consent.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    use the Website in an illegal manner or commit an illegal act
                    or use the Website not expressly authorized by us
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    access the Website from a jurisdiction in which it is illegal
                    or unauthorized or barred
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    making use of any information or content that infringes upon
                    or violates any third party's rights (including, but not
                    limited to, intellectual property rights, rights of privacy or
                    rights of publicity)
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    undertake, ask, solicit or use Website users to conceal the
                    identity, source, or destination of any illegally gained
                    money, services or products.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    use any robot, spider, tool, site search/retrieval
                    application, or other manual or automatic device or process to
                    retrieve, index, “data mine”, or in any way reproduce or
                    circumvent the navigational structure or presentation of the
                    Website.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    collect any personal information, including contact details,
                    of any Website users by electronic or any other means and for
                    any purpose, not expressly permitted under these Terms of Use
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    send any unsolicited email or any other communication in any
                    way whatsoever not expressly permitted under these Terms of
                    Use.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    collect any personal information, including contact details,
                    of any Website users by electronic or any other means and for
                    any purpose, not expressly permitted under these Terms of Use
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    undertake any unauthorized framing of or linking to the
                    Website or “frame” or “mirror” any part of the Website,
                    without our prior written authorization.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    interfere with, obstruct, destroy or disrupt the Website or
                    the servers or networks connected to the Website, whether
                    partly or fully and whether permanently or temporarily.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    email or otherwise transmit any content or material that
                    contains software viruses, malware, spyware or any other
                    computer code, files or programs designed to interrupt,
                    destroy, disrupt or limit the functionality of the Website or
                    of any computer software or hardware or telecommunications
                    equipment connected with the Website.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    forge headers or otherwise manipulate identifiers in order to
                    disguise the origin of any information transmitted to or
                    through the Website (either directly or indirectly through use
                    of any third party software).
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    use meta tags or code or programs or other devices, tools or
                    technology containing any reference to us or the Website (or
                    any trademark, trade name, service mark, logo or slogan of
                    ours or any Website user) to direct any person to any other
                    website for any purpose.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    directly or indirectly modify, adapt, sublicense, translate,
                    sell, reverse engineer, decipher, decompile or otherwise
                    disassemble any portion of the Website.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    post, use, transmit or distribute, directly or indirectly,
                    (e.g. screen scrape) in any manner or media any content
                    (whether textual, graphical, images, audio, video, audio-video
                    or any combination thereof) or information obtained from the
                    Website other than solely in connection with your use of the
                    Website in accordance with these Terms of Use.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Content Posted by You
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You are solely responsible for any and all content or
                    information that you post, upload, share, publish, link to,
                    transmit, record, display or otherwise make available
                    (hereinafter, “post”) on the Website or transmit to other
                    Website users, including text messages, chat, audio, video
                    (including streaming videos), photographs, images, graphics,
                    or profile text, whether publicly posted or privately
                    transmitted (collectively, “Content”).
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We do not verify the accuracy or truth of any Content You post
                    on or through the Website. We are not the publisher of the
                    Content and only provide you with a technology platform to
                    facilitate you to post such Content. Further, we are merely
                    acting as an ‘intermediary’ as per the Information Technology
                    Act, 2000 and rules (Information Technology (Intermediaries
                    Guidelines) Rules, 2011) made thereunder. We assume no
                    responsibility or liability of any sort for providing a
                    technology platform to our Website users to facilitate them to
                    post their Content. To protect the integrity of the Website,
                    we reserve the right to exercise editorial control over your
                    Content, including the right to block any member from
                    accessing the Website, whether temporarily or permanently.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You shall not post to us or to any other Website user (either
                    on or off the Website), any offensive, inaccurate, incomplete,
                    inappropriate, abusive, obscene, profane, threatening,
                    intimidating, harassing, racially offensive, or illegal
                    material or content that infringes or violates ours or any
                    person’s rights (including intellectual property rights, and
                    rights of privacy and publicity).
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[style.termBullet, { lineHeight: 21, top: 7 }]}>
                    {'\u2022'}
                  </Text>
                  <Text style={style.termTextB}>
                    You represent and warrant that
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>1.</Text>
                  <Text style={style.termTextBN}>
                    all information and Content that you submit upon creation of
                    your Website account is accurate and truthful and that you
                    will promptly update any information provided by you that
                    subsequently becomes inaccurate, incomplete, misleading or
                    false and
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>2.</Text>
                  <Text style={style.termTextBN}>
                    you have the right to post the Content on the Website and
                    grant the licenses as agreed in these Terms of Use.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You understand and agree that we may monitor or review any
                    Content You post on the Website. We may delete any Content, in
                    whole or in part, that in our sole judgment violates these
                    Terms of Use or may harm the reputation of the Website or
                    ours.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    By posting Content on the Website, you automatically grant us
                    and to our affiliates, licensees and successors, an
                    irrevocable, perpetual, non-exclusive, transferable,
                    sub-licensable, fully paid-up/royalty-free, worldwide right
                    and license to
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>1.</Text>
                  <Text style={style.termTextBN}>
                    use, copy, store, perform, display, reproduce, record, play,
                    adapt, modify and distribute the Content,
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>2.</Text>
                  <Text style={style.termTextBN}>
                    prepare derivative works of the Content or incorporate the
                    Content into other works, and
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>3.</Text>
                  <Text style={style.termTextBN}>
                    grant and authorize sublicenses of the foregoing in any media
                    now known or hereafter created. You represent and warrant that
                    any posting and use of Your Content by us will not infringe or
                    violate the rights of any third party.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You shall not post, upload, modify, display, publish,
                    transmit, update, share or otherwise make available Content
                    that:
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>1.</Text>
                  <Text style={style.termTextBN}>
                    promotes racism, bigotry, hatred or physical harm or injury of
                    any kind against any religion, group, community or individual;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>2.</Text>
                  <Text style={style.termTextBN}>
                    advocates harassment or intimidation of another person;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>3.</Text>
                  <Text style={style.termTextBN}>
                    relates to or promotes or encourages money laundering, sex
                    trafficking or gambling;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>4.</Text>
                  <Text style={style.termTextBN}>
                    requests money from, or is intended to otherwise defraud,
                    other users of the Website;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>5.</Text>
                  <Text style={style.termTextBN}>
                    involves the transmission of “junk mail”, “chain letters,” or
                    unsolicited mass mailing or “spamming” (or “spimming”,
                    “phishing”, “trolling” or similar activities);
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>6.</Text>
                  <Text style={style.termTextBN}>
                    is misleading, offensive, false, misleading, untrue, unlawful,
                    illegal, defamatory, harassing, disparaging, obscene, sexually
                    explicit, blasphemous, scandalous, libelous, threatening,
                    abusive, hateful, harmful, bigoted, racially offensive,
                    invasive of privacy right of any person, or otherwise
                    objectionable or inappropriate;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>7.</Text>
                  <Text style={style.termTextBN}>
                    belongs to another person and to which you are already aware
                    that the same does not belong to you or that you do not have
                    any right to the same;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>8.</Text>
                  <Text style={style.termTextBN}>
                    directly or indirectly alludes to child pornography;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>9.</Text>
                  <Text style={style.termTextBN}>
                    is an illegal or unauthorized copy of another person’s
                    copyrighted work, including but not limited to providing
                    pirated computer programs or links to them, providing
                    information to circumvent manufacture- installed copy-protect
                    devices, or providing pirated images, audio or video, or links
                    to pirated images, audio or video files;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>10.</Text>
                  <Text style={style.termTextBN}>
                    contains video, audio, photographs or images of another person
                    without his or her permission (or in the case of a minor, the
                    minor’s legal guardian);
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>11.</Text>
                  <Text style={style.termTextBN}>
                    contains restricted or password only access pages, or hidden
                    pages or images (those not linked to or from another
                    accessible page);
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>12.</Text>
                  <Text style={style.termTextBN}>
                    provides material that exploits people in a sexual, violent,
                    obscene or other illegal manner, or solicits personal
                    information from anyone under the age of 18 years;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>13.</Text>
                  <Text style={style.termTextBN}>
                    provides instructional information about illegal activities
                    such as making or buying illegal weapons or drugs, violating
                    someone’s privacy, or providing, disseminating or creating
                    computer viruses;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>14.</Text>
                  <Text style={style.termTextBN}>
                    contains viruses, time bombs, trojan horses, bots, worms or
                    other harmful, or disruptive codes, components or devices;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>15.</Text>
                  <Text style={style.termTextBN}>
                    impersonates, or otherwise misrepresents affiliation,
                    connection or association with, any person or entity;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>16.</Text>
                  <Text style={style.termTextBN}>
                    provides information or data you do not have a right to make
                    available under law or under contractual or fiduciary
                    relationships (such as inside information, proprietary and
                    confidential information);
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>17.</Text>
                  <Text style={style.termTextBN}>
                    disrupts the normal flow of dialogue, causes a screen to
                    “scroll” faster than other users are able to type, or
                    otherwise negatively affects other users’ ability to engage in
                    real time exchanges;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>18.</Text>
                  <Text style={style.termTextBN}>
                    solicits passwords or personal identifying information for
                    commercial or unlawful purposes from other users or
                    disseminates another person’s personal information without his
                    or her permission;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>19.</Text>
                  <Text style={style.termTextBN}>
                    contains any advertising or commercial messages;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>20.</Text>
                  <Text style={style.termTextBN}>
                    infringes upon or violates any third party's rights, including
                    any intellectual property rights;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>21.</Text>
                  <Text style={style.termTextBN}>
                    hinders the Website functionality in any way or interferes or
                    affects other Website users’ use and enjoyment of the Website;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>22.</Text>
                  <Text style={style.termTextBN}>
                    publicizes or promotes commercial activities and/or sales
                    without our prior written consent such as contests,
                    sweepstakes, barter, advertising, and pyramid schemes; or
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>23.</Text>
                  <Text style={style.termTextBN}>
                    violates any law for the time being in force.
                </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We reserve the right, in our sole discretion, to investigate
                    and take any legal action against anyone who violates the
                    aforesaid Clause 8(g), including deleting or removing the
                    offending Content from the Website and/or terminating or
                    suspending the Website account of such violating members.
                    Whilst we reserve our right to delete or remove such Content,
                    we do not guarantee that such offensive Content will be
                    removed or deleted. Failure by us to remove or delete such
                    Content does not waive our right to remove or delete the same
                    in subsequent or similar cases.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Your use of the Website, including all Content you post, must
                    comply with all applicable laws and regulations. You agree
                    that we may access, preserve and disclose your account
                    information and Content if required to do so by law or in a
                    good faith belief that such access, preservation or disclosure
                    is reasonably necessary, such as to:
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>1.</Text>
                  <Text style={style.termTextBN}>
                    comply with applicable laws, requests or orders from law
                    enforcement agencies, appropriate authorities ( such as
                    without limitation, child protection agencies, court
                    officials, expert professional investigative agencies and the
                    like ) or for any legal process;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>2.</Text>
                  <Text style={style.termTextBN}>
                    protect or defend ours, or any third party's rights or
                    property;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>3.</Text>
                  <Text style={style.termTextBN}>
                    enforce these Terms of Use, Privacy Policy and Other Policies;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>4.</Text>
                  <Text style={style.termTextBN}>
                    in support of any fraud/ legal investigation/ verification
                    checks;
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>5.</Text>
                  <Text style={style.termTextBN}>
                    respond to your requests for customer service or allow you to
                    use the Website in the future; or
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>6.</Text>
                  <Text style={style.termTextBN}>
                    safeguard a party who may be a victim of any abuse in any
                    form.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We assume no responsibility or liability for any deletion of
                    or failure to store any of your Content.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Adherence to Laws
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You shall at all times ensure full compliance with the
                    applicable provisions of the Information Technology Act, 2000
                    and rules thereunder as applicable and as amended from time to
                    time and also all applicable State and Central laws, statutes,
                    ordinance, rules and regulations.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Modifications to the Website
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We reserve the right at any time to modify or discontinue,
                    temporarily or permanently, the Website (or any part thereof)
                    with or without notice. You agree that we shall not be liable
                    to you or to any third party for any modification, suspension
                    or discontinuance of the Website. Any access or usage by you
                    of the Website shall imply that you have accepted any new or
                    modified Terms of Use.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Please re-visit these Terms of Use from time to time to stay
                    abreast of any changes that we may introduce.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Please contact us on [•] [ with any questions you may have
                    regarding these Terms of Use.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Disclaimer of Warranty
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    O THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW. WE HAVE
                    PROVIDED THE WEBSITE ON AN "AS IS" AND "AS AVAILABLE" AND
                    “BEST EFFORTS” BASIS AND GRANT NO WARRANTIES OF ANY KIND,
                    WHETHER EXPRESS, IMPLIED, DIRECT, INDIRECT STATUTORY OR
                    OTHERWISE WITH RESPECT TO THE WEBSITE OR THE RESULT OF THE
                    WEBSITE (INCLUDING ALL INFORMATION CONTAINED THEREIN),
                    INCLUDING ANY IMPLIED WARRANTIES OF CORRECTNESS, VALIDITY,
                    ACCURACY APPRORPRIATENESS, FITNESS, COMPATIBILITY FOR A
                    PARTICULAR PURPOSE OR OUTCOME OR NON-INFRINGEMENT. WE DO NOT
                    WARRANT THAT THE USE OF THE WEBSITE WILL ALWAYS BE SECURED,
                    UNINTERRUPTED, AVAILABLE, ERROR-FREE OR WILL MEET YOUR
                    REQUIREMENTS OR EXPECTATIONS, OR THAT ANY DEFECTS IN THE
                    SERVICE WILL BE CORRECTED OR RESULT IN THE DESIRED RESULTS. WE
                    DISCLAIM LIABILITY FOR, AND NO WARRANTY IS MADE WITH RESPECT
                    TO, THE CONNECTIVITY AND AVAILABILITY OF THE WEBSITE AT ALL
                    TIMES AND THE RESULTS OF THE USE OF THE WEBSITE.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Opinions, advice, statements, offers, or other information or
                    content made available through the Website, but not directly
                    by us, are those of the respective Website users, and should
                    not necessarily be relied upon. Such users are solely
                    responsible for such content. WE DO NOT
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>1.</Text>
                  <Text style={style.termTextBN}>
                    GUARANTEE THE ACCURACY, COMPLETENESS OR USEFULNESS OF ANY
                    INFORMATION PROVIDED ON THE WEBSITE, OR
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>2.</Text>
                  <Text style={style.termTextBN}>
                    ADOPT, ENDORSE OR ACCEPT RESPONSIBILITY FOR THE ACCURACY OR
                    RELIABILITY OF ANY OPINION, ADVICE, OR STATEMENT MADE BY ANY
                    PARTY OTHER THAN US
                </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    From time to time, We may offer new features or tools which
                    our Website users may experiment or experience. Such features
                    or tools are offered solely for experimental purposes and
                    without any warranty of any kind, and may be modified or
                    discontinued at our sole discretion. The provisions of this
                    Disclaimer of Warranty section shall apply with full force to
                    such features and tools.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We accept no responsibility for any damage, loss, liabilities,
                    injury or disappointment incurred or suffered by you as a
                    result of the Website.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Limitation of Liability
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                    WILL WE BE LIABLE FOR ANY INCIDENTAL, SPECIAL, CONSEQUENTIAL
                    OR INDIRECT DAMAGES ARISING OUT OF OR RELATING TO THE USE OR
                    INABILITY TO USE THE WEBSITE, RESULT OF USING THE WEBSITE
                    INCLUDING, WITHOUT LIMITATION, DAMAGES FOR RECOMMENDATION OF
                    THE WEBSITE, LOSS OR CORRUPTION OF DATA OR PROGRAMS, SERVICE
                    INTERRUPTIONS AND PROCUREMENT OF SUBSTITUTE SERVICES, EVEN IF
                    WE KNOW OR HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
                    DAMAGES. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
                    UNDER NO CIRCUMSTANCES WILL WE BE LIABLE FOR ANY LIQUIDATED OR
                    PUNITIVE DAMAGES.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                    WILL WE BE LIABLE FOR ANY DAMAGES WHATSOEVER, WHETHER DIRECT,
                    INDIRECT, GENERAL, SPECIAL, COMPENSATORY, CONSEQUENTIAL,
                    AND/OR INCIDENTAL, LIQUIDATED, PUNITIVE ARISING OUT OF OR
                    RELATING TO RECOMMENDATION OF THE WEBSITE, THE CONDUCT OF ANY
                    WEBSITE USER OR ANYONE ELSE IN CONNECTION WITH THE USE OF THE
                    WEBSITE, INCLUDING WITHOUT LIMITATION, BODILY INJURY,
                    EMOTIONAL DISTRESS, FINANCIAL LOSS AND/OR ANY OTHER DAMAGES
                    RESULTING FROM COMMUNICATIONS OR MEETINGS WITH OTHER WEBSITE
                    USERS OR AS A RESULT OF USING THE WEBSITE. THIS INCLUDES ANY
                    CLAIMS, LOSSES OR DAMAGES ARISING FROM THE CONDUCT OF WEBSITE
                    USERS WHO HAVE REGISTERED OR LOGGED-IN ON THE WEBSITE UNDER
                    FALSE PRETENSES OR WHO ATTEMPT TO DEFRAUD OR HARM OTHER USERS.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Indemnification
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You agree to indemnify, defend and hold harmless eJOHRI,
                    affiliates, subsidiaries and parent/holding companies, and
                    each of their officers, directors, employees, agents,
                    consultants, partner sites and related third parties, from and
                    against any and all losses, claims, costs, liabilities and
                    expenses (including reasonable attorneys’ fees) relating to or
                    arising out of your use of the Website, including but not
                    limited to
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>1.</Text>
                  <Text style={style.termTextBN}>
                    any violation by you of these Terms of Use, or
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>2.</Text>
                  <Text style={style.termTextBN}>
                    any action arising from the content that you publish/post on
                    the Website that infringes the intellectual property rights
                    (e.g. copyright, trade secrets, trademark or patent) of any
                    third party, or
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBulletNumber}>3.</Text>
                  <Text style={style.termTextBN}>
                    any content or communication that denigrates, libels or
                    invades the privacy right of any third party. We reserve the
                    right, at our own cost, to assume the exclusive defence and
                    control of any matter otherwise subject to indemnification by
                    you, and you will co-operate fully in asserting any available
                    defences in such case.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Caution
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We may check Website user’s profiles strictly for verifying
                    any unsuitable, objectionable or inappropriate content.
                    However, we may not be able to verify the identity of any
                    Website user or the accuracy of their content, nor can we
                    guarantee that we will be able to identify all unsuitable,
                    objectionable or inappropriate content. Please do not take any
                    Website user content as fully true and/or complete. We will
                    not be liable or responsible for any false and misleading
                    content and information given by any Website user. If you have
                    any concerns over any member content, please write to us on
                    [•] with the details thereof.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    You hereby acknowledge and agree that you shall ensure that at
                    all times your interaction with other Website users will
                    always be lawful and appropriate and that you alone shall be
                    responsible for all consequences thereof.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    We caution you that there may be risks of dealing with any
                    Website user acting under a false pretense or with a criminal
                    intent. We have no control as to what happens between Website
                    users inter se once they decide to meet in person. Should you
                    encounter any such meeting whereby the behaviour of the other
                    member may be deemed inappropriate or harmful in any way to
                    other members of the Website, you are requested to contact us
                    with full details of such offending member and we may, if
                    deemed appropriate and at our sole discretion, suspend or
                    delete the offending Website user’sprofile.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Miscellaneous
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Entire Agreement: These Terms of Use constitutes the entire
                    agreement between you and eJOHRI regarding the subject matter
                    hereof, and replaces and supersedes any and all prior
                    agreements/ understandings/ correspondences, whether written
                    or oral, between you and us.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Amendment: We reserve the right to amend these Terms of Use
                    from time to time. Any such amendments will be applicable to
                    all persons viewing/accessing/using the Website once the
                    revisions have been posted onto the same. You should therefore
                    check the Website from time to time to review the current
                    Terms of Use.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Survival: Termination or suspension of your Website account
                    shall not affect those provisions hereof that by their nature
                    are intended to survive such termination or suspension.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Governing Law and Jurisdiction: These Terms of Use shall be
                    governed and construed in accordance with the laws of India in
                    relation to any legal action or proceedings to enforce the
                    same. The Parties irrevocably submit to the exclusive
                    jurisdiction of any competent courts situated at Mumbai and
                    waive any objection to such proceedings on grounds of venue or
                    on the grounds that the proceedings have been brought in an
                    inconvenient forum.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    No Assignment: These Terms of Use are personal to you. You
                    cannot assign your rights or obligations, whether partly or
                    fully, to anyone.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Severability: If any provisions of these Terms of Use are held
                    invalid or unenforceable under applicable law, such provision
                    will be inapplicable, but the remainder will continue in full
                    force and effect.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Waiver: No waiver of any term, provision or condition of this
                    Agreement whether by conduct or otherwise in any one or more
                    instances shall be deemed to be or construed as a further or
                    continuing waiver of any such term, provision or condition or
                    of any other term, provision or condition of these Terms of
                    Use.
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Grievance Officer
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    In accordance with Information Technology Act, 2000 and rules
                    made there under, the name and contact details of the
                    Grievance Officer are provided below:
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[style.termTextB, { paddingLeft: 34, paddingTop: 8 }]}>
                    <Text style={{ fontWeight: 'bold' }}>Name:</Text> Mr. Shailen
                    Mehta
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[style.termTextB, { paddingLeft: 34, paddingTop: 8 }]}>
                    <Text style={{ fontWeight: 'bold' }}>Address:</Text> 1402, Naman
                    Midtown,A Wing 14th Floor,Behind Kamgar Kala
                    Kendra,Dr.Ambedkar Nagar,Senapati Bapat
                    marg,Elphistone(W),Mumbai:400013
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[style.termTextB, { paddingLeft: 34, paddingTop: 8 }]}>
                    <Text style={{ fontWeight: 'bold' }}>Phone:</Text> +91
                    7718044457
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[style.termTextB, { paddingLeft: 34, paddingTop: 8 }]}>
                    <Text style={{ fontWeight: 'bold' }}>Email:</Text>{' '}
                    customerservice@ejohri.com
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[style.termTextB, { paddingLeft: 34, paddingTop: 8 }]}>
                    <Text style={{ fontWeight: 'bold' }}>Time:</Text> Monday to
                    Saturday (11 am to 6 pm)
                </Text>
                </View>

                <View>
                  <Text style={[style.termText, { paddingBottom: 0 }]}>
                    Contact Us
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Please contact us by email on{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      customerservice@ejohri.com
                  </Text>{' '}
                    for any questions or comments regarding these Terms of Use.
                </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={style.termBullet}>{'\u2022'}</Text>
                  <Text style={style.termTextB}>
                    Last updated on: 26-Aug-2015
                </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
/*
<View>
    <Text style={style.termText}></Text>
</View>
*/
const style = StyleSheet.create({
  termText: {
    fontSize: 16,
    color: '#000000',
    padding: 10,
    flex: 1,
  },

  termBullet: {
    fontSize: 26,
    paddingLeft: 15,
    lineHeight: 28,
  },
  termTextB: {
    fontSize: 16,
    color: '#000000',
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },

  termBulletNumber: {
    fontSize: 16,
    paddingLeft: 35,
  },
  termTextBN: {
    fontSize: 16,
    color: '#000000',
    paddingLeft: 5,
    paddingRight: 10,
    flex: 1,
  },
  baseText: {
    color: '#212529',
    fontFamily: 'Montserrat'
  }
});

export default LoginScreen;

/*
{
   "customer" : {
      "lastname" : "manish",
      "firstname" : "chaubey",
      "email" : "para1m@gmail.com",
      "custom_attributes":{
            "moblie":152787861
      },
      "addresses" : [
         {
            "defaultBilling" : true,
            "defaultShipping" : true,
            "firstname" : "Jane",
            "lastname" : "Doe",

            "region" : {
               "regionCode" : "MH",
               "regionId" : 505,
               "region" : "Maharashtra"

            },

            "countryId" : "IN",

            "postcode" : "395003",
            "city" : "Surat",
            "street" : [
               "123 Oak Ave"
            ],
            "telephone" : "7096289811"


         }
      ]
   },
   "password" : "Admin@123"
}
*/
