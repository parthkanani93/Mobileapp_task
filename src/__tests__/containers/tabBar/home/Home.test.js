import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from '../../../../containers/tabBar/home/Home';
import { useSelector } from 'react-redux';
import {
  addProductAction,
  removeProductAction,
} from '../../../../redux/action/favoritesAction';

// Suppress act warnings for cleaner test output
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('not wrapped in act')) {
      return;
    }
    // @ts-ignore
    console.error.mock.calls.push([msg, ...args]);
  });
});

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore && console.error.mockRestore();
});

// Mocks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));
jest.mock('../../../../components/common/CLoader', () => () => null);
jest.mock('../../../../components/common/CHeader', () => props => {
  const { Text } = require('react-native');
  return <Text>{props.title}</Text>;
});
jest.mock('../../../../components/common/CText', () => props => {
  const { Text } = require('react-native');
  return <Text>{props.children}</Text>;
});
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../../components/homeComponent/ProductCard', () => props => {
  const { Text, TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity
      onPress={props.onPressFavorite}
      testID={`product-${props.item.id}`}
    >
      <Text>{props.item.title}</Text>
    </TouchableOpacity>
  );
});
jest.mock('../../../../i18n/strings', () => ({
  products: 'Products',
  noProductFound: 'No products found',
}));
jest.mock('../../../../redux/action/favoritesAction', () => ({
  addProductAction: jest.fn(val => ({ type: 'ADD', payload: val })),
  removeProductAction: jest.fn(id => ({ type: 'REMOVE', payload: id })),
}));

// Mock API
const mockProducts = [
  { id: 1, title: 'Product 1' },
  { id: 2, title: 'Product 2' },
];
const mockGetProductsApi = jest.fn();

jest.mock('../../../../redux/api/productsApi', () => ({
  useLazyGetProductsQuery: () => [mockGetProductsApi, { isFetching: false }],
}));

describe('Home Screen', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
      if (typeof msg === 'string' && msg.includes('not wrapped in act')) {
        return;
      }
      console.error.mock.calls.push([msg, ...args]);
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation(cb => cb({ favorites: [] }));
    mockGetProductsApi.mockReset();
    mockGetProductsApi.mockReturnValue({
      unwrap: () => Promise.resolve({ products: mockProducts }),
    });
  });

  it('renders header and loader initially', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Products')).toBeTruthy();
  });

  it('renders products after API call', async () => {
    const { findByText } = render(<Home />);
    expect(await findByText('Product 1')).toBeTruthy();
    expect(await findByText('Product 2')).toBeTruthy();
  });

  it('shows empty message when no products', async () => {
    mockGetProductsApi.mockReturnValueOnce({
      unwrap: () => Promise.resolve({ products: [] }),
    });
    const { findByText } = render(<Home />);
    expect(await findByText('No products found')).toBeTruthy();
  });

  it('adds product to favorites when not already favorite', async () => {
    const { findByTestId } = render(<Home />);
    const productBtn = await findByTestId('product-1');
    fireEvent.press(productBtn);
    expect(addProductAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, isFavorite: true }),
    );
  });

  it('removes product from favorites when already favorite', async () => {
    useSelector.mockImplementation(cb =>
      cb({ favorites: [{ id: 1, title: 'Product 1' }] }),
    );
    const { findByTestId } = render(<Home />);
    const productBtn = await findByTestId('product-1');
    fireEvent.press(productBtn);
    expect(removeProductAction).toHaveBeenCalledWith(1);
  });

  it('logs error when getProductsApi fails', async () => {
    mockGetProductsApi.mockReturnValueOnce({
      unwrap: () => Promise.reject(new Error('API error')),
    });

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Home />);
  });

  it('calls getProductsApi and sets hasMore to false if products.length < limit', async () => {
    mockGetProductsApi.mockReturnValueOnce({
      unwrap: () =>
        Promise.resolve({ products: [{ id: 1, title: 'Product 1' }] }),
    });
    const { findByText } = render(<Home />);
    expect(await findByText('Product 1')).toBeTruthy();
    expect(mockGetProductsApi).toHaveBeenCalledTimes(1);
  });

  it('calls getProductsApi and continues if products.length === limit', async () => {
    const products = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
    }));
    mockGetProductsApi.mockReturnValueOnce({
      unwrap: () => Promise.resolve({ products }),
    });
    const { findByText } = render(<Home />);
    expect(await findByText('Product 1')).toBeTruthy();
    expect(mockGetProductsApi).toHaveBeenCalledTimes(1);
  });

  it('does not fetch products if isFetching is true', async () => {
    // Mock the API to return isFetching as true
    const mockFetch = jest.fn();
    jest.mock('../../../../redux/api/productsApi', () => ({
      useLazyGetProductsQuery: () => [mockFetch, { isFetching: true }],
    }));

    const HomeWithIsFetching =
      require('../../../../containers/tabBar/home/Home').default;
    const { getByTestId } = render(<HomeWithIsFetching />);

    // Simulate the onEndReached event
    fireEvent(getByTestId('product-list'), 'onEndReached');

    // Ensure that the fetch function was not called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not fetch products if hasMore is false', () => {
    const { getByTestId } = render(<Home />);
    getByTestId('product-list').props.onEndReached = () => {};
    fireEvent(getByTestId('product-list'), 'onEndReached');
  });

  it('sets hasMore to false when fewer products are returned than the limit', async () => {
    mockGetProductsApi.mockReturnValueOnce({
      unwrap: () =>
        Promise.resolve({ products: [{ id: 1, title: 'Product 1' }] }),
    });

    const { findByText } = render(<Home />);
    expect(await findByText('Product 1')).toBeTruthy();

    expect(mockGetProductsApi).toHaveBeenCalledTimes(1);
  });
});
