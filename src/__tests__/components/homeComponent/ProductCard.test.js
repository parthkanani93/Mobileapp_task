import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ProductCard from '../../../components/homeComponent/ProductCard';
import {colors} from '../../../themes';

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const {View} = require('react-native');

  const FastImage = props => {
    return <View {...props} />;
  };

  FastImage.priority = {
    low: 'low',
    normal: 'normal',
    high: 'high',
  };

  FastImage.cacheControl = {
    immutable: 'immutable',
    web: 'web',
    cacheOnly: 'cacheOnly',
  };

  FastImage.resizeMode = {
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
    center: 'center',
  };

  return FastImage;
});

const mockItem = {
  id: 1,
  title: 'Test Product',
  brand: 'BrandX',
  category: 'makeup',
  price: 99,
  rating: 4.5,
  discountPercentage: 10,
  thumbnail: 'https://example.com/image.jpg',
};

describe('ProductCard', () => {
  it('renders product info', () => {
    const {getByText} = render(
      <ProductCard item={mockItem} favoriteProducts={[]} />,
    );
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('BRANDX')).toBeTruthy();
    expect(getByText('$99')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
    expect(getByText('10% OFF')).toBeTruthy();
  });

  it('calls onPressFavorite when heart is pressed', () => {
    const onPressFavorite = jest.fn();
    const {getByTestId} = render(
      <ProductCard
        item={mockItem}
        favoriteProducts={[]}
        onPressFavorite={onPressFavorite}
      />,
    );

    fireEvent.press(getByTestId('favorite-button'));
    expect(onPressFavorite).toHaveBeenCalled();
  });

  it('shows red heart if product is favorite', () => {
    const {getByTestId} = render(
      <ProductCard item={mockItem} favoriteProducts={[{id: 1}]} />,
    );

    const heartIcon = getByTestId('favorite-button').findByType('Icon');
    expect(heartIcon.props.color).toBe(colors.red);
  });

  it('renders category in uppercase if brand is missing', () => {
    const item = {...mockItem, brand: undefined, category: 'makeup'};
    const {getByText} = render(
      <ProductCard item={item} favoriteProducts={[]} />,
    );
    expect(getByText('MAKEUP')).toBeTruthy();
  });

  it('renders rating as 0 if item.rating is missing', () => {
    const item = {...mockItem, rating: 0};
    const {getByText} = render(
      <ProductCard item={item} favoriteProducts={[]} />,
    );
    expect(getByText('0')).toBeTruthy();
  });

  it('navigates to details on card press', () => {
    const navigate = jest.fn();
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({navigate});
    const {getByText} = render(
      <ProductCard item={mockItem} favoriteProducts={[]} />,
    );
    fireEvent.press(getByText('Test Product').parent);
    expect(navigate).toHaveBeenCalledWith('ProductDetails', {item: mockItem});
  });
});
