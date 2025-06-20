import {
  addProductAction,
  removeProductAction,
} from '../../redux/action/favoritesAction';
import {ADD_PRODUCT, REMOVE_PRODUCT} from '../../redux/types';

describe('favoritesAction', () => {
  it('addProductAction dispatches ADD_PRODUCT with payload', () => {
    const dispatch = jest.fn();
    const product = {id: 1, name: 'Test Product'};
    addProductAction(product)(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: ADD_PRODUCT,
      payload: product,
    });
  });

  it('removeProductAction dispatches REMOVE_PRODUCT with payload', () => {
    const dispatch = jest.fn();
    const productId = 1;
    removeProductAction(productId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith({
      type: REMOVE_PRODUCT,
      payload: productId,
    });
  });
});
