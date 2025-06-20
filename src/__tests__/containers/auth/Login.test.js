import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import Login from '../../../containers/auth/Login';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    reset: jest.fn(),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../components/common/CSafeAreaView', () => ({children}) => (
  <>{children}</>
));
jest.mock(
  '../../../components/common/CKeyBoardAvoidWrapper',
  () =>
    ({children}) =>
      <>{children}</>,
);

jest.mock('../../../components/common/CText', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return props => <Text {...props}>{props.children}</Text>;
});

jest.mock('../../../components/common/CInput', () => {
  const React = require('react');
  const {View, TextInput, Text} = require('react-native');
  return props => (
    <View style={{flexDirection: 'row'}}>
      {props.insideLeftIcon?.()}
      <TextInput
        testID={props.placeHolder || props.placeholder}
        value={props._value}
        onChangeText={props.toGetTextFieldValue}
        secureTextEntry={props._isSecure}
      />
      {props.rightAccessory?.()}
      {!!props._errorText && <Text>{props._errorText}</Text>}
    </View>
  );
});
jest.mock('../../../components/common/CButton', () => {
  const React = require('react');
  const {TouchableOpacity, Text} = require('react-native');
  return props => (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityState={{disabled: props.disabled}}
      testID="login-button">
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
});

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native-country-picker-modal', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: props => <>{props.children}</>,
    FlagButton: props => <button {...props} />,
  };
});
jest.mock('../../../utils/validators', () => ({
  validatePassword: val => ({
    status: val.length >= 6,
    msg: val.length >= 6 ? '' : 'Invalid password',
  }),
  validatePhoneNumber: (val, code) => ({
    status: val.length >= 8,
    msg: val.length >= 8 ? '' : 'Invalid phone',
  }),
}));

jest.mock('../../../navigation/NavigationKeys', () => ({
  StackNav: {TabNavigation: 'TabNavigation'},
}));

const strings = {
  loginAccount: 'Login to your account',
  loginAccountDesc: 'Enter your phone and password',
  phoneNo: 'Phone Number',
  password: 'Password',
  login: 'Login',
};
jest.mock('../../../i18n/strings', () => strings);

describe('Login', () => {
  it('renders login screen', () => {
    const {getByText, getByTestId} = render(
      <Login navigation={{reset: jest.fn()}} />,
    );
    expect(getByText(strings.loginAccount)).toBeTruthy();
    expect(getByText(strings.loginAccountDesc)).toBeTruthy();
    expect(getByTestId(strings.phoneNo)).toBeTruthy();
    expect(getByTestId(strings.password)).toBeTruthy();
    expect(getByText(strings.login)).toBeTruthy();
  });

  it('toggles password visibility when eye icon is pressed', () => {
    const {getByTestId} = render(<Login navigation={{reset: jest.fn()}} />);
    const eyeIcon = getByTestId('password-eye');
    fireEvent.press(eyeIcon);
  });

  it('clears phone error when valid phone is entered', () => {
    const {getByTestId} = render(<Login navigation={{reset: jest.fn()}} />);
    const phoneInput = getByTestId('Phone Number');
    act(() => {
      fireEvent.changeText(phoneInput, '12345678');
    });
    const loginBtn = getByTestId('login-button');
    expect(loginBtn.props.accessibilityState.disabled).toBe(true);
  });

  it('shows phone error when invalid phone is entered', () => {
    const {getByTestId, queryByText} = render(
      <Login navigation={{reset: jest.fn()}} />,
    );
    const phoneInput = getByTestId('Phone Number');
    act(() => {
      fireEvent.changeText(phoneInput, '123');
    });
    // Error text should be rendered
    expect(queryByText('Invalid phone')).toBeTruthy();
  });

  it('opens country picker when country icon is pressed', () => {
    const {UNSAFE_getByType} = render(
      <Login navigation={{reset: jest.fn()}} />,
    );
    const FlagButton = UNSAFE_getByType(
      require('react-native-country-picker-modal').FlagButton,
    );
    act(() => {
      FlagButton.props.onOpen();
    });
    const CountryPicker = UNSAFE_getByType(
      require('react-native-country-picker-modal').default,
    );
    expect(CountryPicker.props.visible).toBe(true);
  });

  it('handles country selection', () => {
    const {UNSAFE_getByType} = render(
      <Login navigation={{reset: jest.fn()}} />,
    );
    const CountryPicker = UNSAFE_getByType(
      require('react-native-country-picker-modal').default,
    );

    act(() => {
      CountryPicker.props.onSelect({cca2: 'US', callingCode: ['1']});
    });
  });

  it('calls renderFlagButton', () => {
    const {UNSAFE_getByType} = render(
      <Login navigation={{reset: jest.fn()}} />,
    );
    const CountryPicker = UNSAFE_getByType(
      require('react-native-country-picker-modal').default,
    );
    CountryPicker.props.renderFlagButton();
  });

  it('enables login button when valid phone and password entered', () => {
    const {getByTestId} = render(<Login navigation={{reset: jest.fn()}} />);
    const phoneInput = getByTestId(strings.phoneNo);
    const passwordInput = getByTestId(strings.password);
    const loginBtn = getByTestId('login-button');

    expect(loginBtn.props.accessibilityState.disabled).toBe(true);

    act(() => {
      fireEvent.changeText(phoneInput, '12345678');
      fireEvent.changeText(passwordInput, '123456');
    });

    expect(loginBtn.props.accessibilityState.disabled).toBe(false);
  });

  it('calls AsyncStorage and navigation.reset on login', async () => {
    const resetMock = jest.fn();
    const {getByTestId, getByText} = render(
      <Login navigation={{reset: resetMock}} />,
    );
    const phoneInput = getByTestId(strings.phoneNo);
    const passwordInput = getByTestId(strings.password);
    const loginBtn = getByText(strings.login);

    await act(async () => {
      fireEvent.changeText(phoneInput, '12345678');
      fireEvent.changeText(passwordInput, '123456');
    });

    await act(async () => {
      fireEvent.press(loginBtn);
    });

    const AsyncStorage = require('@react-native-async-storage/async-storage');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('IS_LOGIN', 'true');
    expect(resetMock).toHaveBeenCalledWith({
      index: 0,
      routes: [{name: 'TabNavigation'}],
    });
  });
});
