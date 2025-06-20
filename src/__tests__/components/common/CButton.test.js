import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CButton from '../../../components/common/CButton';

describe('CButton', () => {
  it('renders with title', () => {
    const {getByText} = render(<CButton title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const {getByText} = render(
      <CButton title="Click Me" onPress={onPressMock} />,
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('renders with disabled style', () => {
    const {getByText} = render(<CButton title="Disabled" disabled={true} />);
    expect(getByText('Disabled')).toBeTruthy();
  });

  it('renders with custom bgColor', () => {
    const {getByText} = render(<CButton title="Colored" bgColor="#123456" />);
    expect(getByText('Colored')).toBeTruthy();
  });

  it('renders with custom text color', () => {
    const {getByText} = render(
      <CButton title="Colored Text" color="#abcdef" />,
    );
    const text = getByText('Colored Text');

    // Extract `color` from style
    const style = Array.isArray(text.props.style)
      ? Object.assign({}, ...text.props.style)
      : text.props.style;

    expect(style.color).toBe('#abcdef');
  });
});
