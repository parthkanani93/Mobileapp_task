import React from 'react';
import {render} from '@testing-library/react-native';
import CDivider from '../../../components/common/CDivider';

describe('CDivider', () => {
  it('renders a View with divider style', () => {
    const {getByTestId} = render(<CDivider style={{backgroundColor: 'red'}} />);
    const divider = getByTestId('divider');
    expect(divider).toBeTruthy();
    expect(divider.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({height: expect.any(Number)}),
        expect.objectContaining({backgroundColor: 'red'}),
      ]),
    );
  });
});
