import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductDetails from '../../../../containers/tabBar/home/ProductDetails';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('react-native-vector-icons/Ionicons', () => props => {
  const { Text } = require('react-native');
  return <Text>{props.name || 'Ionicons'}</Text>;
});
jest.mock('react-native-vector-icons/FontAwesome', () => props => {
  const { Text } = require('react-native');
  return <Text>{props.name || 'FontAwesome'}</Text>;
});

jest.mock('react-native-fast-image', () => {
  const React = require('react');
  const { View } = require('react-native');

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

jest.mock('../../../../components/common/CSafeAreaView', () => props => (
  <>{props.children}</>
));
jest.mock('../../../../components/common/CHeader', () => props => {
  const { Text } = require('react-native');
  return <Text>{props.title}</Text>;
});
jest.mock('../../../../components/common/CText', () => props => {
  const { Text } = require('react-native');
  return <Text {...props}>{props.children}</Text>;
});

jest.mock('../../../../components/common/CLoader', () => () => {
  const { Text } = require('react-native');
  return <Text>CLoader</Text>;
});
jest.mock('../../../../components/common/CDivider', () => () => {
  const { View } = require('react-native');
  return <View testID="divider" />;
});
jest.mock('../../../../i18n/strings', () => ({
  deliveringTo: 'Delivering to',
  home: 'Home',
  change: 'Change',
  tags: 'Tags',
  description: 'Description',
  reviews: 'Reviews',
  reviewedOn: 'Reviewed on',
  inStock: 'In Stock',
  outOfStock: 'Out of Stock',
}));

const mockDispatch = jest.fn();
const mockProduct = {
  id: 1,
  title: 'Test Product',
  brand: 'BrandX',
  category: 'CategoryY',
  price: 100,
  discountPercentage: 20,
  rating: 4.5,
  images: ['https://example.com/image1.jpg'],
  availabilityStatus: 'In Stock',
  description: 'Test description',
  tags: ['new', 'hot'],
  reviews: [
    {
      reviewerName: 'Alice',
      rating: 4,
      comment: 'Nice product!',
      date: '2024-06-01',
    },
  ],
};

jest.mock('../../../../redux/api/productsApi', () => ({
  useGetProductByIdQuery: jest.fn(() => ({
    data: mockProduct,
    isLoading: false,
  })),
}));

describe('ProductDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(cb => cb({ favorites: [] }));
  });

  const setup = () =>
    render(<ProductDetails route={{ params: { item: { id: 1 } } }} />);

  it('renders product title and description', () => {
    const { getByTestId, getByText } = setup();
    expect(getByTestId('product-title').props.children).toBe('Test Product');
    expect(getByText('Test description')).toBeTruthy();
  });

  it('shows loader when isLoading is true', () => {
    const {
      useGetProductByIdQuery,
    } = require('../../../../redux/api/productsApi');
    useGetProductByIdQuery.mockReturnValueOnce({ data: null, isLoading: true });
    const { getByText } = render(
      <ProductDetails route={{ params: { item: { id: 1 } } }} />,
    );
    expect(getByText('CLoader')).toBeTruthy();
  });

  it('renders tags', () => {
    const { getByTestId } = setup();
    expect(getByTestId('tag-new')).toBeTruthy();
    expect(getByTestId('tag-hot')).toBeTruthy();
  });

  it('renders reviewer name and comment', () => {
    const { getByTestId } = setup();
    expect(getByTestId('reviewer-Alice')).toBeTruthy();
    expect(getByTestId('review-comment-0')).toBeTruthy();
  });

  it('handles adding product to favorites', () => {
    const { getByTestId } = setup();
    fireEvent.press(getByTestId('favorite-button'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('changes selected image on thumbnail press', () => {
    const { getAllByTestId } = setup();
    fireEvent.press(getAllByTestId('thumbnail-0')[0]);
  });

  it('removes product from favorites if already favorite', () => {
    useSelector.mockImplementation(cb => cb({ favorites: [{ id: 1 }] }));
    const { getByTestId } = setup();
    fireEvent.press(getByTestId('favorite-button'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('renders half star in review when review rating is .5', () => {
    const halfStarProduct = {
      ...mockProduct,
      reviews: [
        {
          reviewerName: 'Bob',
          rating: 3.5,
          comment: 'Half star review!',
          date: '2024-06-01',
        },
      ],
    };

    require('../../../../redux/api/productsApi').useGetProductByIdQuery.mockReturnValueOnce(
      {
        data: halfStarProduct,
        isLoading: false,
      },
    );

    const { getByText } = render(
      <ProductDetails route={{ params: { item: { id: 1 } } }} />,
    );
    expect(getByText('star-half')).toBeTruthy();
  });

  it('shows loader if loading is true', () => {
    const {
      useGetProductByIdQuery,
    } = require('../../../../redux/api/productsApi');
    useGetProductByIdQuery.mockReturnValueOnce({ data: null, isLoading: true });
  });
});
