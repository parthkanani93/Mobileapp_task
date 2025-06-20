import React from 'react';
import {render} from '@testing-library/react-native';
import CLoader from '../../../components/common/CLoader';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

const {useIsFocused} = require('@react-navigation/native');

describe('CLoader', () => {
  it('renders ActivityIndicator inside Modal when focused', () => {
    useIsFocused.mockReturnValue(true);
    const {getByTestId} = render(<CLoader />);
    expect(getByTestId('loader-indicator')).toBeTruthy();
  });

  it('renders empty View when not focused', () => {
    useIsFocused.mockReturnValue(false);
    const {toJSON} = render(<CLoader />);
    expect(toJSON().type).toBe('View');
  });
});
