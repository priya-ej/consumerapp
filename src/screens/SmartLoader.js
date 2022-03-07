import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorHolder: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const SmartLoader = props => {
  const {isLoading} = props;
  //const { isLoading, ...attributes } = props;

  return (
    <Modal
      transparent
      animationType={'none'}
      visible={isLoading}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorHolder}>
          <ActivityIndicator
            animating={isLoading}
            color="#CDAF84"
            size="large"
          />
          {/* <Image source={require('../images/ejohri_loader.gif')} /> */}
        </View>
      </View>
    </Modal>
  );
};

export default SmartLoader;
