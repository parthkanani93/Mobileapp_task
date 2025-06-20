import React from 'react';
import {render, act} from '@testing-library/react-native';
import SplashScreen from '../../../containers/auth/SplashScreen';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('../../../navigation/NavigationKeys', () => ({
  StackNav: {TabNavigation: 'TabNavigation', Login: 'Login'},
}));

jest.useFakeTimers();

describe('SplashScreen', () => {
  const navigation = {reset: jest.fn()};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ActivityIndicator', () => {
    const {getByTestId} = render(<SplashScreen navigation={navigation} />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('navigates to TabNavigation if IS_LOGIN exists', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue('true');
    render(<SplashScreen navigation={navigation} />);
    await act(async () => {
      jest.runAllTimers();
    });
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{name: 'TabNavigation'}],
    });
  });

  it('navigates to Login if IS_LOGIN does not exist', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(null);
    render(<SplashScreen navigation={navigation} />);
    await act(async () => {
      jest.runAllTimers();
    });
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{name: 'Login'}],
    });
  });

  it('handles asyncProcess error gracefully', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    AsyncStorage.getItem.mockRejectedValue(new Error('Async error'));
    render(<SplashScreen navigation={navigation} />);
    await act(async () => {
      jest.runAllTimers();
    });
    expect(errorSpy).toHaveBeenCalledWith(
      'Error in asyncProcess:',
      expect.any(Error),
    );
    errorSpy.mockRestore();
  });
});
