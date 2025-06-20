import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import CSafeAreaView from '../../../components/common/CSafeAreaView';

describe('CSafeAreaView', () => {
  it('renders children inside SafeAreaView', () => {
    const {getByText} = render(
      <CSafeAreaView>
        <Text>Safe Content</Text>
      </CSafeAreaView>,
    );
    expect(getByText('Safe Content')).toBeTruthy();
  });

  it('applies custom style', () => {
    const {getByTestId} = render(
      <CSafeAreaView style={{backgroundColor: 'red'}} testID="safe-area" />,
    );
    const safeArea = getByTestId('safe-area');
    expect(safeArea.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({backgroundColor: 'red'}),
      ]),
    );
  });
});
