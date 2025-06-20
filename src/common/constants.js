import {Dimensions, Platform, StatusBar} from 'react-native';

let iPhoneX = screenHeight === 812;

// StatusBar Height
export const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? (iPhoneX ? 44 : 22) : StatusBar.currentHeight;
export const screenHeight = Dimensions.get('window').height - STATUSBAR_HEIGHT;
export const screenWidth = Dimensions.get('window').width;
export const screenFullHeight = Dimensions.get('window').height;
export const isAndroid = Platform.OS === 'ios' ? false : true;

let sampleHeight = 812;
let sampleWidth = 375;

export const isShowLog = true;

//Get Height of Screen
export function getHeight(value) {
  return (value / sampleHeight) * screenHeight;
}
const scale = size => (screenWidth / sampleWidth) * size;

// Moderate Scale Function
export function moderateScale(size, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

export const iosReelHeight = screenFullHeight - getHeight(100);
export const androidReelHeight = screenFullHeight - getHeight(70);

export const IS_LOGIN = 'IS_LOGIN';

export const ApiType = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};
