import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Favorites from '../../../../containers/tabBar/favorites/Favorites';
import {useSelector, useDispatch} from 'react-redux';
import {removeProductAction} from '../../../../redux/action/favoritesAction';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock('../../../../redux/action/favoritesAction', () => ({
  removeProductAction: jest.fn(id => ({type: 'REMOVE', payload: id})),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('../../../../components/common/CSafeAreaView', () => props => (
  <>{props.children}</>
));

jest.mock('../../../../components/common/CHeader', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return props => <Text>{props.title}</Text>;
});

jest.mock('../../../../components/homeComponent/ProductCard', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return props => (
    <Text onPress={props.onPressFavorite} testID={`product-${props.item.id}`}>
      {props.item.title}
    </Text>
  );
});

jest.mock('../../../../components/common/CText', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return props => <Text>{props.children}</Text>;
});

jest.mock('../../../../i18n/strings', () => ({
  favorites: 'Favorites',
  noFavoritesFound: 'No favorites found',
}));

const mockFavorites = [
  {id: 1, title: 'Fav 1'},
  {id: 2, title: 'Fav 2'},
];

describe('Favorites Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header and empty message when no favorites', async () => {
    useSelector.mockImplementation(cb => cb({favorites: []}));
    const {findByText} = render(<Favorites />);
    expect(await findByText('Favorites')).toBeTruthy();
    expect(await findByText('No favorites found')).toBeTruthy();
  });

  it('renders favorite products', async () => {
    useSelector.mockImplementation(cb => cb({favorites: mockFavorites}));
    const {findByText} = render(<Favorites />);
    expect(await findByText('Fav 1')).toBeTruthy();
    expect(await findByText('Fav 2')).toBeTruthy();
  });

  it('removes favorite when product is pressed', async () => {
    useSelector.mockImplementation(cb => cb({favorites: mockFavorites}));
    const {findByTestId} = render(<Favorites />);
    const fav1 = await findByTestId('product-1');

    fireEvent.press(fav1);
    expect(removeProductAction).toHaveBeenCalledWith(1);
  });
});
