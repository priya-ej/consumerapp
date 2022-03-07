import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { pathSettings } from '../api/pathSettings';
import validator from 'validator';
import SmartLoader from './SmartLoader';

function ForgotPasswordScreen({ route, navigation }) {

    const [email, setEmail] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgCode, setMsgCode] = useState(0);

    const Valid_Signup_email = () => {
        return (email !== undefined && validator.isEmail(email));
    }

    const SetRequest = async() => {
        try {
            setIsLoading(true);
            let response = await fetch(pathSettings.forgotPassword, {
              method: 'POST',
              headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'User-Agent': '*'
              },
              body: JSON.stringify({
                  "email": email
              })
            });
        
            // {"code":"OK","status":200,"data":{"token":""},"message":"Password link send successfully."}
            // {"code":"OK","status":400,"message":"Email is not valid"}
            let resJson = await response.json();
            //console.log(JSON.stringify(resJson));

            setMsgCode(resJson.status);
            setMsg(resJson.message);
            setTimeout(()=>{
                if(resJson.status == 200){
                    setEmail('');
                }
                setMsgCode(0);
                setMsg('');
            },4000)
            setIsLoading(false);
        }catch(err){
            setIsLoading(false);
            console.log(err);
        }

    }
    
    return (
        <View style={{ flex: 1, padding:20, justifyContent:'center' }}>
        <SmartLoader isLoading={isLoading} />
            <View style={{flexDirection:'column'}}>
                <View style={{alignItems:'center', }}>
                    <Text style={[style.baseText,{color:'#063374', fontSize:24 , lineHeight:36, fontWeight:'600'}]}>Forgot Password</Text>
                </View>
                <View style={{alignItems:'center', }}>
                    <Text style={[style.baseText,{fontSize:13, lineHeight:18, fontWeight:'400'}]}>Please enter your email address below to</Text>
                    <Text style={[style.baseText,{fontSize:13, lineHeight:18, fontWeight:'400'}]}>receive a password reset link.</Text>
                </View>
                <View style={{marginVertical:20}}>
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
                        visible={email !== undefined && !Valid_Signup_email(email)}
                        >
                        {email?.length == 0 ? 'This field is required' : 'Email address is not valid'}
                    </HelperText>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <View>
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.goBack();
                            }}    
                        >
                            <Text style={[style.baseText,{color:'#063374', fontSize:13, fontWeight:'400'}]}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity 
                            style={{backgroundColor:'#cdb083', borderRadius:3, paddingVertical:2, paddingHorizontal:50}}
                            onPress={()=>{
                                if (email === undefined) setEmail('');

                                if(Valid_Signup_email(email)){
                                    SetRequest();
                                }
                            }}    
                        >
                            <Text  style={[style.baseText,{color:'#FFFFFF', fontSize:13, lineHeight:40, fontWeight:'500'}]}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginTop:30, height:25}}>
                    <Text style={[style.baseText, {fontSize:14, color: (msgCode == 200 ? '#17A61B' : '#A62617')}]}>{msg}</Text>
                </View>
            </View>
        </View>
    )
}


const style = StyleSheet.create({
    baseText: {
        color: '#212529',
        fontFamily: 'Montserrat'
      }
});
export default ForgotPasswordScreen;