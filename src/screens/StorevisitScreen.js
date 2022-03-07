import React from 'react';
import { Dimensions, View, Text, TouchableOpacity, FlatList, Image, Pressable, TextInput, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';
//import IconDel from '../images/delete.svg';
import VectorImage from 'react-native-vector-image';
import SmartLoader from './SmartLoader';
import { useFocusEffect } from '@react-navigation/native';
import { getAppointmentData, updateAppointment, addAppointmentGuest } from './AppointmentUtil';

const PageWidth = Dimensions.get('window').width;

function StorevisitScreen({ route, navigation }) {
    //console.log(route);
    //const { data } = route.params;

    const [isLoading, setIsLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState('location');
    const [isScheduleClickable, setIsScheduleClickable] = React.useState(false);
    //const [scheduleData, setScheduleData] = React.useState({});

    const [isDateopen, setIsDateopen] = React.useState(false);
    const [isTimeopen, setIsTimeopen] = React.useState(false);

    const [date, setDate] = React.useState(new Date());
    const [brand_image_url, setBrand_image_url] = React.useState('');
    const [city, setCity] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [mobile, setMobile] = React.useState(undefined);
    const [coupon, setCoupon] = React.useState(undefined);
    const [vendor_id, setVendor_id] = React.useState(0);
    const [vendor_name, setLocativendor_name] = React.useState('');

    const [lstData, setLstData] = React.useState([]);

    //const [time, setTime] = React.useState(new Date());

    async function getAsyncstoragedata() {
        let t_data = await getAppointmentData();        
        setLstData(t_data);
    }

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            setIsLoading(true);
            getAsyncstoragedata();
            setIsLoading(false);

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );

    /*
    const lstData = [
        {
            brand_image_url: 'https://image.ejohri.com/vendor/439/v-logo-1630399068857.jpg',
            store_brand_name: 'Alankar Jewellers',
            store_brand_city: 'Patna'
        },
        {
            brand_image_url: 'https://image.ejohri.com/vendor/379/v-logo-1626189351485.jpg',
            store_brand_name: 'Kasturi Jewellers',
            store_brand_city: 'Mumbai'
        }
    ]
    */

    // M 200+100+51 = 351
    // Z 250+41 = 291-4 = 287
    // T 330

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <SmartLoader isLoading={isLoading} />
            {/* <View style={{alignItems:'center', padding:5}}>
                <Text style={{fontSize:26, color:'#063374'}}>Book an Appointment</Text>
            </View> */}
            <View style={{ margin: 10, flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 2, borderBottomColor: '#D5D8DC' }}>
                <View style={{ padding: 5 }}>
                    <Pressable onPress={() => {
                        setCurrentPage('location');
                        setIsScheduleClickable(false);
                    }}>
                        <Text style={[style.baseText, { color: (currentPage === 'location' ? '#063374' : '#0d6efd'), fontSize: 14, lineHeight:21, fontWeight: '500' }]}>Location</Text>
                    </Pressable>
                </View>
                <View style={{ padding: 5 }}>
                    <Pressable onPress={() => {
                        if (isScheduleClickable) {
                            setCurrentPage('schedule');
                        }
                    }}>
                        <Text style={[style.baseText, { color: (currentPage === 'schedule' ? '#063374' : '#0d6efd'), fontSize: 14, lineHeight:21, fontWeight: '500' }]}>Schedule</Text>
                    </Pressable>
                </View>
                <View style={{ padding: 5 }}>
                    <Pressable onPress={() => { }}>
                        <Text style={[style.baseText, { color: (currentPage === 'confirm' ? '#063374' : '#0d6efd'), fontSize: 14, lineHeight:21, fontWeight: '500' }]}>Confirm</Text>
                    </Pressable>
                </View>
            </View>
            <View style={{ flex: 1, margin: 10, marginTop: 0 }}>
                <View style={[{ flex: 1 }, currentPage === 'location' ? '' : { display: 'none' }]}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={style.htext}>Select Any Jeweler To Book Appointment</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={lstData}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={{
                                    margin: 5,
                                    marginTop: 0,
                                    padding: 5,
                                    shadowColor: '#2C3E50',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 1,
                                    elevation: 1,
                                }}>
                                    <View style={{}}>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <TouchableOpacity
                                                style={{ flex: 1, flexDirection: 'row' }}
                                                onPress={() => {
                                                    setBrand_image_url(item.brand_image_url);
                                                    setCity(item.city);
                                                    setLocation(item.location);
                                                    setVendor_id(item.vendor_id);
                                                    setLocativendor_name(item.vendor_name);

                                                    setCurrentPage('schedule');
                                                }}
                                            >
                                                <View style={{ width: (PageWidth / 100 * 30) }}>
                                                    <Image
                                                        source={{ uri: item.brand_image_url }}
                                                        style={{ resizeMode: 'contain', width: '100%', height: 80 }}
                                                    />
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'center' }}>
                                                    <View>
                                                        <Text style={[style.baseText, { color:'#000000', padding: 5, fontSize: 15, lineHeight:19, fontWeight: '600' }]}>{item.vendor_name}</Text>
                                                    </View>
                                                    {/* <View>
                                                        <Text style={{ fontSize: 20, alignContent: 'center' }}>{item.city}</Text>
                                                    </View> */}
                                                    <View>
                                                        <Text style={[style.baseText, {color:'#000000', fontSize: 13, lineHeight:19, fontWeight:'400', alignContent: 'center' }]}>{item.location}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', marginTop: 10, marginRight: 15 }}>
                                            <View>
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        setIsLoading(true);
                                                        const t_data = await updateAppointment({ vendor_id: item.vendor_id }, 'remove');
                                                        setLstData(t_data);
                                                        setCurrentPage('location');
                                                        setIsLoading(false);
                                                    }}
                                                >
                                                    {/* <IconDel width={20} height={22} fill="none" /> */}
                                                    <VectorImage source={require('../images/delete.svg')} style={{width:23, height:23, tintColor:'#063374'}} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}>
                        </FlatList>
                    </View>
                </View>
                <View style={[{ flex: 1 }, currentPage === 'schedule' ? '' : { display: 'none' }]}>
                    <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                        <Text style={style.htext}>Schedule Date and Time</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={[style.htext, { fontSize: 16, lineHeight:24, textDecorationLine: 'underline' }]}>Location Details:</Text>
                        </View>
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={[style.baseText,{ fontSize: 14, lineHeight:21, fontWeight:'500' }]}>{location}</Text>
                        </View>
                        <View style={{ paddingBottom: 10 }}>
                            <TouchableOpacity onPress={() => setIsDateopen(true)}>
                                <View pointerEvents="none">
                                    <TextInput
                                        editable={false}
                                        placeholder="Select Date"
                                        value={Moment(date).format('DD/MM/YYYY')}
                                        style={[style.baseText,{padding:8, backgroundColor: '#f7f7f7', color: 'rgb(0,0,0.87)', fontSize: 13, lineHeight:15, fontWeight:'400' }]}
                                    />
                                </View>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                mode="date"
                                androidVariant="nativeAndroid"
                                minimumDate={new Date()}
                                open={isDateopen}
                                date={date}
                                onConfirm={(date) => {
                                    setIsDateopen(false)
                                    setDate(date)
                                }}
                                onCancel={() => {
                                    setIsDateopen(false)
                                }}
                            />
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setIsTimeopen(true)}>
                                <View pointerEvents="none">
                                    <TextInput
                                        editable={false}
                                        placeholder="Select Time"
                                        value={Moment(date).format('hh:mm A')}
                                        style={[style.baseText,{padding:8, backgroundColor: '#f7f7f7', color: 'rgb(0,0,0.87)', fontSize: 13, lineHeight:15, fontWeight:'400' }]}
                                    />
                                </View>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                mode="time"
                                androidVariant="nativeAndroid"
                                minimumDate={new Date()}
                                open={isTimeopen}
                                date={date}
                                onConfirm={(date) => {
                                    setIsTimeopen(false)
                                    setDate(date)
                                }}
                                onCancel={() => {
                                    setIsTimeopen(false)
                                }}
                            />
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#2b54a3', borderRadius: 5, padding: 8, width: '40%', alignItems: 'center', alignSelf: 'flex-start' }}
                                onPress={() => {
                                    setIsScheduleClickable(true);
                                    setCurrentPage('confirm');
                                }}
                            >
                                <Text style={[style.baseText,{ fontSize: 15, lineHeight:21, fontWeight:'400', color: '#FFFFFF' }]}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[{ flex: 1 }, currentPage === 'confirm' ? '' : { display: 'none' }]}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={style.htext}>Appointment Summary</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={[style.htext, { fontSize: 16, lineHeight:24, textDecorationLine: 'underline' }]}>Appointment Details</Text>
                        </View>
                        <View style={{ paddingBottom: 10 }}>
                            <Text style={[style.htext, { fontSize: 16, lineHeight:24 }]}>
                                <Text style={{ textDecorationLine: 'underline' }}>Date and Time:</Text>
                                <Text style={{ color: '#212529', fontSize:14, lineHeight:21 }}>&nbsp;{Moment(date).format('DD/MM/YYYY hh:mm A')}</Text>
                            </Text>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={[style.htext, { fontSize: 16, lineHeight:24 }]}>
                                <Text style={{ textDecorationLine: 'underline' }}>Location:</Text>
                                <Text style={{ color: '#212529', fontSize:14, lineHeight:21 }}>&nbsp;{location}</Text>
                            </Text>
                        </View>
                        <View style={{ paddingBottom: 0 }}>
                            <PaperTextInput
                                label="Mobile"
                                underlineColor='#CDAF84'
                                theme={{
                                    colors: { fontFamily:'Montserrat', fontSize:12, primary: '#CDAF84', background: '#F7F7F7' },
                                    roundness: 0
                                }}
                                value={mobile}
                                onChangeText={text => setMobile(text)}
                            />
                            <HelperText type="error" visible={mobile !== undefined && mobile.length == 0}>
                                This field is required
                            </HelperText>
                        </View>
                        <View style={{ paddingBottom: 10 }}>
                            <PaperTextInput
                                label="Coupon"
                                underlineColor='#CDAF84'
                                theme={{
                                    colors: { fontFamily:'Montserrat', fontSize:12, primary: '#CDAF84', background: '#F7F7F7' },
                                    roundness: 0
                                }}
                                value={coupon}
                                onChangeText={text => setCoupon(text)}
                            />
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#2b54a3', borderRadius: 5, padding: 8, width: '70%', alignItems: 'center', alignSelf: 'flex-end' }}
                                onPress={async() => {
                                    //setIsScheduleClickable(true);
                                    //setCurrentPage('confirm');
                                    setIsLoading(true);
                                    await addAppointmentGuest({
                                        appointment_date: Moment(date).format('YYYY-MM-DD'),
                                        appointment_time: Moment(date).format('hh:mm A'),
                                        brand_image_url: brand_image_url,
                                        city: city,
                                        location: location,
                                        mobile: mobile,
                                        vendor_id: vendor_id,
                                        vendor_name: vendor_name
                                    });
                                    await getAsyncstoragedata();
                                    setCurrentPage('location');
                                    setIsScheduleClickable(false);
                                    setIsLoading(false);
                                }}
                            >
                                <Text style={[style.baseText,{ fontSize: 15, lineHeight:21, fontWeight:'400', color: '#FFFFFF' }]}>Confirm Booking</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>

        </View>
    )
}

export default StorevisitScreen;

const style = StyleSheet.create({
    baseText:{
        color: '#212529',
        fontFamily:'Montserrat'   
    },
    htext: {
        fontFamily:'Montserrat',
        color: '#063374',
        fontSize: 13,
        lineHeight:20,
        fontWeight: '600'
    }
});



/*

rest/V1/addAppointmentGuestCustomer
appointment_date: "2021-10-05"
appointment_time: "1:26 PM"
brand_image_url: "https://image.ejohri.com/vendor/266/v-logo-1593591400133.jpg"
city: "Lucknow"
location: "328/21/001, Old Subzi Mandi Chowk, In Gol Darwaza, Lucknow - 226003"
mobile: "8700371480"
vendor_id: "266"
vendor_name: "Jagat Narayan Jewels"

http://3.7.7.215/rest/V1/getvendoraddresslist

// a1i2y3a4n#

*/