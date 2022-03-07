// -lc++
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
/*
import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
*/

/*
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const App: () => Node = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Hellox</Text>
        <Icon name="rocket" size={30} color="#900" />
      </View>
    </SafeAreaView>
  )
}

export default App;
*/

import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { isLoggedIn } from './src/api/auth';

import { getCartData } from './src/screens/CartUtil';
import { getAppointmentData } from './src/screens/AppointmentUtil';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VectorImage from 'react-native-vector-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import { GlobalVariable } from './src/screens/GlobalVariable';

import ListPageByCategoryNamesScreen from './src/screens/ListPageByCategoryNamesScreen';
import ProductScreen from './src/screens/ProductScreen';
import ShoppingBag from './src/screens/ShoppingBag';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AddAddressSreen from './src/screens/AddAddressSreen';
import UserActionScreen from './src/screens/UserActionScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import AccountScreen from './src/screens/AccountScreen';
import StorevisitScreen from './src/screens/StorevisitScreen';
//import HomeMenu from './src/screens/HomeMenu';
import HomeScreen from './src/screens/HomeScreen';
import SideMenu from './src/screens/SideMenu';
import SearchBar from './src/screens/SearchBar';
import store from './src/redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Actions from './src/redux/actions';
import StoreKeys from './src/redux/storeKeys';
import SmartLoader from './src/screens/SmartLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GET_AND_SAVE_PAGE_TYPES,
  SAVE_USER_DATA,
} from './src/redux/DispatcherFunctions/UserDispatchers';

import {CART_BADGE} from './src/redux/DispatcherFunctions/LayoutDispatchers';
import PaymentConfirmationScreen from './src/screens/PaymentConfirmationScreen';
import { GET_CART_DATA } from './src/redux/DispatcherFunctions/CartDispatchers';
//  118 - 120 - 122 - 125

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
//const Stack = createNativeStackNavigator();
const w_width = Dimensions.get('window').width;

const HeaderOptions = ({
  navigation,
  issearch,
  setIssearch,
  storevisitBadgecount,
  cartBadgecount,
}) => {
  return {
    headerMode: 'screen',
    headerStyle: {
      backgroundColor: '#063374',
      elevation: 0,
      shadowColor: 'transparent',
      //height:50
    },
    headerTitleAlign: (Platform.OS ? 'left' : 'center'),
    headerTitleStyle: {
      width: 300,
    },
    headerLeft: () => (
      <TouchableOpacity
        style={{
          flex: 1,
          width: 40,
          justifyContent: 'center',
          paddingLeft: 10,
          paddingRight: 10
        }}
        onPress={() => {
          if (issearch) {
            setIssearch(false);
          } else {
            navigation.openDrawer('SideMenu');
          }
        }}>
        {!issearch && <Image source={require('./src/images/drawer.png')} />}
        {issearch && (
          <IconAntDesign
            name="arrowleft"
            color="#CDAF84"
            size={25}
            style={{ padding: 0, margin: 0 }}
          />
        )}
      </TouchableOpacity>
    ),

    headerTitle: () => {
      return (
        <View style={{ flex: 1, width: w_width - 40 - 20 }}>
          {issearch && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <SearchBar navigation={navigation} />
            </View>
          )}
          {!issearch && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: 20
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  style={{ flexDirection: 'row' }}
                  onPress={() => navigation.navigate('home')}>
                  <View>
                    <Image source={require('./src/images/logo.png')} />
                  </View>
                  <View>
                    <Image source={require('./src/images/ejohri_white.png')} />
                  </View>
                </Pressable>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => setIssearch(true)}>
                  <VectorImage
                    source={require('./src/images/search-res.svg')}
                    style={{ width: 23, height: 23, tintColor: '#CDAF84' }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('storevisit', { screen: 'Storevisit' })
                  }>
                  <View>
                    <Image source={require('./src/images/bookappointment.png')} />
                  </View>
                  {storevisitBadgecount > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        right: -10,
                        top: -8,
                        backgroundColor: '#000000',
                        borderRadius: 15,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 'normal',
                        }}>
                        {storevisitBadgecount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('cart', { screen: 'Shoppingbag' })
                  }>
                  <View>
                    <Image source={require('./src/images/cart.png')} />
                  </View>
                  {cartBadgecount > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        right: -10,
                        top: -8,
                        backgroundColor: '#000000',
                        borderRadius: 15,
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 'normal',
                        }}>
                        {cartBadgecount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={async () => {
                    // const loggedIn = await isLoggedIn();
                    // if (loggedIn) {
                    //   navigation.navigate('account', { screen: 'Account' });
                    // } else {
                    //   navigation.navigate('login', { screen: 'Login', params: { navigatePage: 'checkout' } });
                    // }
                    navigation.navigate('useraction', { screen: 'Useraction' });
                  }}>
                  <Image source={require('./src/images/account.png')} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    },
  };
};

const Home = ({ navigation }) => {
  const { storevisitBadgecount } = React.useContext(GlobalVariable);
  const [issearch, setIssearch] = React.useState(false);
  let cartBadgecount = useSelector(state =>  state[Actions.LAYOUT.KEY][StoreKeys.LAYOUT.CART_BADGE],);

  return (
    <Stack.Navigator
      screenOptions={({ navigation: navigationArgs }) =>
        HeaderOptions({
          navigation: navigationArgs,
          cartBadgecount,
          storevisitBadgecount,
          issearch,
          setIssearch,
        })
      }>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

const ListPageByCategoryNames = ({ route, navigation }) => {
  const { storevisitBadgecount } = React.useContext(GlobalVariable);
  const [issearch, setIssearch] = React.useState(false);
  //const cartData = useSelector(state => state[Actions.CART_DATA.KEY][StoreKeys.CART_DATA],);
  //const cartBadgecount = cartData ?.data ?.count || cartData ?.length;
  let cartBadgecount = useSelector(state =>  state[Actions.LAYOUT.KEY][StoreKeys.LAYOUT.CART_BADGE],);
  return (
    <Stack.Navigator
      screenOptions={({ navigation: navigationArgs }) =>
        HeaderOptions({
          navigation: navigationArgs,
          cartBadgecount,
          storevisitBadgecount,
          issearch,
          setIssearch,
        })
      }>
      <Stack.Screen
        name="itemLst"
        component={ListPageByCategoryNamesScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="product"
        component={ProductScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

const Cart = ({ route, navigation }) => {
  const { storevisitBadgecount } = React.useContext(GlobalVariable);
  const [issearch, setIssearch] = React.useState(false);
  let cartBadgecount = useSelector(state =>  state[Actions.LAYOUT.KEY][StoreKeys.LAYOUT.CART_BADGE],);

  return (
    <Stack.Navigator
      screenOptions={({ navigation: navigationArgs }) =>
        HeaderOptions({
          navigation: navigationArgs,
          cartBadgecount,
          storevisitBadgecount,
          issearch,
          setIssearch,
        })
      }>
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: '' }} />
      <Stack.Screen
        name="Shoppingbag"
        component={ShoppingBag}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

const Storevisit = ({ route, navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: '#063374',
          elevation: 0,
          shadowColor: 'transparent',
        },
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              <IconAntDesign name="arrowleft" color="#CDAF84" size={25} />
            </TouchableOpacity>
            <Text style={{ color: '#CDAF84', fontSize: 19 }}>
              Book an Appointment
            </Text>
          </View>
        ),
      }}>
      <Stack.Screen
        name="Storevisit"
        component={StorevisitScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

const Checkout = ({ route, navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: '#063374',
          elevation: 0,
          shadowColor: 'transparent',
        },
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              <IconAntDesign name="arrowleft" color="#CDAF84" size={25} />
            </TouchableOpacity>
            <Text style={{ color: '#CDAF84', fontSize: 19 }} />
          </View>
        ),
      }}>
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout', headerTitleStyle: { color: '#CDAF84' } }}
      />
      <Stack.Screen
        name="CheckoutAddress"
        component={AddAddressSreen}
        options={{ title: 'Add Address', headerTitleStyle: { color: '#CDAF84' } }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentConfirmationScreen}
        options={{
          title: 'Order Successfully Placed',
          headerTitleStyle: { color: '#CDAF84' },
        }}
      />
    </Stack.Navigator>
  );
};

const UserAction = ({ route, navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: '#063374',
          elevation: 0,
          shadowColor: 'transparent',
        },
        headerLeft: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              onPress={() => {
                navigation.goBack();
              }}>
              <IconAntDesign name="arrowleft" color="#CDAF84" size={25} />
            </TouchableOpacity>
            <Text style={{ color: '#CDAF84', fontSize: 19 }}>Account</Text>
          </View>
        ),
      }}>
      <Stack.Screen
        name="Useraction"
        component={UserActionScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

const Account = ({ route, navigation }) => {
  const { storevisitBadgecount } = React.useContext(GlobalVariable);
  const [issearch, setIssearch] = React.useState(false);
  let cartBadgecount = useSelector(state =>  state[Actions.LAYOUT.KEY][StoreKeys.LAYOUT.CART_BADGE],);

  return (
    <Stack.Navigator
      screenOptions={({ navigation: navigationArgs }) =>
        HeaderOptions({
          navigation: navigationArgs,
          cartBadgecount,
          storevisitBadgecount,
          issearch,
          setIssearch,
        })
      }>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

const Login = ({ route, navigation }) => {
  const { storevisitBadgecount } = React.useContext(GlobalVariable);
  const [issearch, setIssearch] = React.useState(false);
  let cartBadgecount = useSelector(state =>  state[Actions.LAYOUT.KEY][StoreKeys.LAYOUT.CART_BADGE],);

  return (
    <Stack.Navigator
      screenOptions={({ navigation: navigationArgs }) =>
        HeaderOptions({
          navigation: navigationArgs,
          cartBadgecount,
          storevisitBadgecount,
          issearch,
          setIssearch,
        })
      }>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

function App() {
  //const [issearch, setIssearch] = React.useState(false);
  const [cartBadgecount, setCartBadgecount] = React.useState(0);
  const [storevisitBadgecount, setStorevisitBadgecount] = React.useState(0);
  const dispatch = useDispatch();
  const isLoading = useSelector(
    state => !!state[Actions.LAYOUT.KEY][StoreKeys.LAYOUT.LOADER],
  );
  async function getAsyncCartData() {
    let t_data = await getCartData();
    //setCartBadgecount(t_data.length);
    
    //let actionType= `${Actions.LAYOUT.KEY}.${Actions.LAYOUT.TYPE.CART_BADGE}`;
    dispatch(CART_BADGE(t_data.length));
  }

  async function getAsyncStorevisitData() {
    let t_data = await getAppointmentData();
    setStorevisitBadgecount(t_data.length);
  }

  React.useEffect(() => {
    //getAsyncCartData();
    getAsyncStorevisitData();
    dispatch(GET_AND_SAVE_PAGE_TYPES());
    dispatch(GET_CART_DATA());
    AsyncStorage.getItem('ej_store')
      .then(JSON.parse)
      .then(storage => {
        storage ?.user && dispatch(SAVE_USER_DATA(storage.user));
      });
  }, []);

  return (
    <SafeAreaProvider>
      <SmartLoader isLoading={isLoading} />
      <GlobalVariable.Provider
        value={{
          cartBadgecount,
          setCartBadgecount,
          storevisitBadgecount,
          setStorevisitBadgecount,
        }}>
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={props => <SideMenu {...props} />}
            initialRouteName="home"
            drawerStyle={{
              backgroundColor: '#063374',
            }}
            screenOptions={{
              labelStyle: {
                fontSize: 16,
                color: '#CDAF84',
              },
            }}
          //unmountInactiveRoutes={true}
          //initialRouteName="checkout"
          >
            <Drawer.Screen
              name="home"
              component={Home}
              options={{ headerShown: false, drawerLabel: 'Home' }}
            />
            <Drawer.Screen
              name="itemlst"
              component={ListPageByCategoryNames}
              options={{ headerShown: false, drawerLabel: 'Item List' }}
            />
            <Drawer.Screen
              name="cart"
              component={Cart}
              options={{ headerShown: false, drawerLabel: 'Cart' }}
            />
            <Drawer.Screen
              name="storevisit"
              component={Storevisit}
              options={{ headerShown: false, drawerLabel: 'Storevisit' }}
            />

            <Drawer.Screen
              name="checkout"
              component={Checkout}
              options={{ headerShown: false, drawerLabel: 'Checkout' }}
            />
            <Drawer.Screen
              name="useraction"
              component={UserAction}
              options={{ headerShown: false, drawerLabel: 'User Action' }}
            />
            <Drawer.Screen
              name="login"
              component={Login}
              options={{ headerShown: false, drawerLabel: 'Login' }}
            />
            <Drawer.Screen
              name="account"
              component={Account}
              options={{ headerShown: false, drawerLabel: 'Account' }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </GlobalVariable.Provider>
    </SafeAreaProvider>
  );
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);



// https://chriscourses.com/blog/redux


// muz, darbhnaga, sasaram, begusarai, madubani, 