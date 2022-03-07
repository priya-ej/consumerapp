/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import SmartLoader from './SmartLoader';
import {
  getLocalStorageDataFromAsyncStorage,
  getLocalStorageString,
} from '../Util/Functions';

function AccountScreen({route, navigation}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [scriptToRun, updateScriptToRun] = React.useState('');

  React.useEffect(() => {
    getLocalStorageDataFromAsyncStorage()
      .then(data => {
        const scriptToRunx = getLocalStorageString(data);
        updateScriptToRun(scriptToRunx);
        setIsLoading(false);
      })
      .catch(err => console.log('AccountScreen -> useEffect -> Error: ', err));
  }, []);

  const getWebview = React.useCallback(() => {
    return (
      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{uri: 'https://www.ejohri.com/customer/account'}}
        injectedJavaScript={scriptToRun}
      />
    );
  }, [scriptToRun]);

  return (
    <View style={{flex: 1}}>
      <SmartLoader isLoading={isLoading} />
      {!isLoading && getWebview()}
    </View>
  );
}
// chrome://inspect
// https://www.ejohri.com/customer/account
// https://fb35d1736c49.ngrok.io/customer/account
export default AccountScreen;
