import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CText from '../../components/common/CText';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import {colors, styles} from '../../themes';
import {IS_LOGIN, moderateScale} from '../../common/constants';
import CKeyBoardAvoidWrapper from '../../components/common/CKeyBoardAvoidWrapper';
import CountryPicker, {FlagButton} from 'react-native-country-picker-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {validatePassword, validatePhoneNumber} from '../../utils/validators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNav} from '../../navigation/NavigationKeys';
import strings from '../../i18n/strings';

export default function Login({navigation}) {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneNoError, setPhoneNoError] = useState('');
  const [callingCodeLib, setCallingCodeLib] = useState('+91');
  const [countryCodeLib, setCountryCodeLib] = useState('IN');
  const [visiblePiker, setVisiblePiker] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (
      phoneNo?.length > 0 &&
      password?.length > 0 &&
      !passwordError &&
      !phoneNoError
    ) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [phoneNo, password, phoneNoError, passwordError]);

  const onPressPasswordEyeIcon = () => setIsPasswordVisible(!isPasswordVisible);
  const onSelectCountry = country => {
    const newCountryCode = '+' + country.callingCode[0];
    setCountryCodeLib(country.cca2);
    setCallingCodeLib(newCountryCode);
    closeCountryPicker();

    const {status, msg} = validatePhoneNumber(phoneNo.trim(), newCountryCode);
    setPhoneNoError(!status && msg);
  };

  const onChangedPassword = val => {
    const {msg} = validatePassword(val.trim());
    setPassword(val.trim());
    setPasswordError(msg);
  };

  const onPressLogin = async () => {
    await AsyncStorage.setItem(IS_LOGIN, 'true');
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.TabNavigation}],
    });
  };

  const RightPasswordEyeIcon = () => (
    <TouchableOpacity testID="password-eye" onPress={onPressPasswordEyeIcon}>
      <Ionicons
        name={!!isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
        size={moderateScale(20)}
        color={colors.textColor1}
      />
    </TouchableOpacity>
  );

  const openCountryPicker = () => setVisiblePiker(true);
  const closeCountryPicker = () => setVisiblePiker(false);

  const onChangePhoneNo = val => {
    const {status, msg} = validatePhoneNumber(val.trim(), callingCodeLib);
    setPhoneNo(val.trim());
    setPhoneNoError(!status ? msg : '');
  };

  const countryIcon = () => {
    return (
      <View testID="country-icon" style={localStyles.leftIconStyle}>
        <FlagButton
          value={callingCodeLib}
          onOpen={openCountryPicker}
          withEmoji={true}
          countryCode={countryCodeLib}
          withCallingCodeButton={true}
        />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CKeyBoardAvoidWrapper contentContainerStyle={localStyles.containerStyle}>
        <CText type={'S24'} style={localStyles.titleStyle}>
          {strings.loginAccount}
        </CText>
        <CText
          type={'R14'}
          color={colors.textColor2}
          style={localStyles.descStyle}>
          {strings.loginAccountDesc}
        </CText>
        <CInput
          placeholder={strings.phoneNo}
          _value={phoneNo}
          _errorText={phoneNoError}
          toGetTextFieldValue={onChangePhoneNo}
          keyboardType="number-pad"
          maxLength={12}
          insideLeftIcon={countryIcon}
        />
        <CInput
          placeHolder={strings.password}
          keyBoardType={'default'}
          _value={password}
          _errorText={passwordError}
          autoCapitalize={'none'}
          toGetTextFieldValue={onChangedPassword}
          _isSecure={!isPasswordVisible}
          rightAccessory={RightPasswordEyeIcon}
        />
      </CKeyBoardAvoidWrapper>
      <View style={styles.ph20}>
        <CButton
          title={strings.login}
          containerStyle={[styles.mt30, styles.mb20]}
          disabled={isSubmitDisabled}
          onPress={onPressLogin}
        />
        <CountryPicker
          countryCode={'IN'}
          withFilter={true}
          visible={visiblePiker}
          withFlag={true}
          withFlagButton={true}
          onSelect={country => onSelectCountry(country)}
          withCallingCode={true}
          withAlphaFilter={true}
          withCountryNameButton={true}
          onClose={closeCountryPicker}
          renderFlagButton={() => {
            return null;
          }}
        />
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  signUpContainer: {
    ...styles.mv15,
    ...styles.rowCenter,
  },
  leftIconStyle: {
    ...styles.mr5,
    width: '100%',
  },
  titleStyle: {
    ...styles.mb10,
  },
  containerStyle: {
    ...styles.ph20,
    ...styles.pt30,
  },
  termsTextStyle: {
    lineHeight: moderateScale(18),
    width: '90%',
  },
  descStyle: {
    width: '90%',
    ...styles.mb8,
    lineHeight: moderateScale(20),
  },
});
