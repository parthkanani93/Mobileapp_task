import {rootApi} from '../../api/apiCall';
import {GET_PRODUCT_URL} from '../../api/url';
import {GEMINI_API_KEY} from '@env';

export const productsApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getProducts: build.query({
      query: ({limit = 10, skip = 0}) => ({
        url: GET_PRODUCT_URL,
        method: 'GET',
        params: {limit, skip},
      }),
      transformResponse: res => ({
        products: res.products,
        total: res.total,
      }),
    }),
    getProductById: build.query({
      query: productId => ({
        url: `${GET_PRODUCT_URL}/${productId}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useGetGeminiAnalysisMutation,
} = productsApi;
