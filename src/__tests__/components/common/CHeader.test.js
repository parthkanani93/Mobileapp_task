import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CHeader from '../../../components/common/CHeader';
import {View} from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('../../../components/common/CText', () => props => {
  const {Text} = require('react-native');
  global.cTextTypeProp = props.type;
  return <Text {...props}>{props.children}</Text>;
});

describe('CHeader', () => {
  it('renders title', () => {
    const {getByText} = render(<CHeader title="My Header" />);
    expect(getByText('My Header')).toBeTruthy();
  });

  it('calls navigation.goBack when onPressBack is not provided', () => {
    const goBackMock = jest.fn();
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({goBack: goBackMock});
    const {getByTestId} = render(<CHeader title="Back Test" />);
    const backBtn = getByTestId('backBtn');
    fireEvent.press(backBtn);
    expect(goBackMock).toHaveBeenCalled();
  });

  it('uses default type "s22" when type prop is not provided', () => {
    render(<CHeader title="Default Type" />);
    expect(global.cTextTypeProp).toBe('s22');
  });

  it('uses passed type prop when provided', () => {
    render(<CHeader title="With Type" type="m18" />);
    expect(global.cTextTypeProp).toBe('m18');
  });

  it('calls onPressBack when back button is pressed', () => {
    const onPressBack = jest.fn();
    const {getByTestId} = render(
      <CHeader title="Back Test" onPressBack={onPressBack} />,
    );
    const backBtn = getByTestId('backBtn');
    fireEvent.press(backBtn);
    expect(onPressBack).toHaveBeenCalled();
  });

  it('does not render back button when isHideBack is true', () => {
    const {queryByRole} = render(<CHeader title="No Back" isHideBack />);
    expect(queryByRole('button')).toBeNull();
  });

  it('renders leftIcon and rightIcon if provided', () => {
    const Left = <View testID="leftIcon" />;
    const Right = <View testID="rightIcon" />;
    const {getByTestId} = render(
      <CHeader title="Icons" leftIcon={Left} rightIcon={Right} />,
    );
    expect(getByTestId('leftIcon')).toBeTruthy();
    expect(getByTestId('rightIcon')).toBeTruthy();
  });
});
