import fonts from './font';
import dimensions from './margins';
import {backgroundColors, colors} from './color';

export const flexContStyle = {
  flex: 1,
};

export const screenContainerStyle = {
  ...flexContStyle,
  backgroundColor: backgroundColors.appBackgroundColor,
  // alignItems: 'center',
};

export const contactScreenStyle = {
  ...screenContainerStyle,
  backgroundColor: colors.snow,
};

export const modalContentStyle = {
  marginTop: dimensions.h5,
  width: '100%',
};

export const cardContainer = {
  // width: dimensions.w288,
  // flex: 1,
  // flexDirection: 'row',
  // paddingTop: dimensions.h4,
  paddingBottom: dimensions.h5,
  // paddingRight: dimensions.w12,
  // paddingLeft: dimensions.w12,
  // paddingHorizontal: dimensions.w12,
};

export const cardContent = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const listContainerStyle = {
  flexGrow: 1,
  paddingBottom: dimensions.h40,
  paddingLeft: dimensions.w16,
  paddingRight: dimensions.w16,
  paddingTop: dimensions.w4,
};

export const cardLeftContainer = {
  flexDirection: 'row',
  flex: 1,
};

export const cardInfoContainer = {
  marginLeft: dimensions.w12,
  flex: 1,
};

export const cardLabelInfo = {
  flexDirection: 'row',
  flex: 1,
  alignItems: 'center',
  // borderWidth: 1,
};

export const cardText = {
  ...fonts.h14_r,
  maxWidth: '96%',
  color: colors.eclipse,
  textAlign: 'left',
};
export const padding_16 = {
  paddingLeft: dimensions.w16,
  paddingRight: dimensions.w16,
};

export const rowSb = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

export const shadow = {
  //shadowColor: colors.,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  elevation: 5,
};

export const shadowContainer = {
  marginTop: dimensions.h16,
  paddingTop: dimensions.h16,
  paddingBottom: dimensions.h16,
  backgroundColor: colors.white,
  borderRadius: dimensions.h10,
  ...shadow,
};

export const paddedContainer = {
  backgroundColor: colors.snow,
  flex: 1,
  width: '100%',
  ...padding_16,
};

export const lightSubText = {
  ...fonts.h12_m,
  color: colors.nobel,
  ...padding_16,
};

export const btnGroupContainer = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: dimensions.h16,
};

export const greyCenteredView = {
  ...screenContainerStyle,
  ...padding_16,
  alignItems: 'center',
  backgroundColor: colors.grey,
  justifyContent: 'center',
};

export const statusBarStyle = {};

export const msgCardContainer = {
  ...shadowContainer,
  backgroundColor: colors.white,
  borderRadius: 8,
  paddingTop: dimensions.h9,
  paddingRight: dimensions.w16,
  paddingLeft: dimensions.w16,
  paddingBottom: dimensions.h9,
};

export const footerActivityIndicater = {
  marginTop: dimensions.h4,
  marginBottom: dimensions.h4,
};

export const seprator = {
  borderBottomWidth: 1,
  borderBottomColor: colors.balticSeaOp,
};

export const headerTitle = {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'flex-start',
};

export const scrollViewContentContainer = {
  flexGrow: 1,
};

export const contactFormContainer = {
  backgroundColor: colors.snow,
  padding: dimensions.w16,
  borderRadius: dimensions.w16,
};

export const contactFormScroll = {
  marginTop: -dimensions.h32,
  flex: 1,
  // zIndex: 5000,
  marginBottom: dimensions.h44,
};

export const contactHeaderNav = {
  flexDirection: 'row',
  position: 'absolute',
  top: dimensions.h6,
  left: dimensions.w5,
  alignItems: 'center',
  padding: dimensions.w5,
};

export const bottomBtn = {
  width: dimensions.SCREEN_WIDTH,
  height: dimensions.h40,
  position: 'absolute',
  bottom: 0,
  zIndex: 500000,
};
