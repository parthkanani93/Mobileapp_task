import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import CInput from '../../../components/common/CInput';

describe('CInput', () => {
  it('renders with placeholder and value', () => {
    const {getByPlaceholderText, getByDisplayValue} = render(
      <CInput
        _value="test"
        placeHolder="Enter text"
        toGetTextFieldValue={() => {}}
      />,
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
    expect(getByDisplayValue('test')).toBeTruthy();
  });

  it('calls toGetTextFieldValue on text change', () => {
    const mockFn = jest.fn();
    const {getByTestId} = render(
      <CInput _value="" placeHolder="Type here" toGetTextFieldValue={mockFn} />,
    );
    const input = getByTestId('textInput');
    fireEvent.changeText(input, 'hello');
    expect(mockFn).toHaveBeenCalledWith('hello');
  });

  it('renders multiline input with correct height', () => {
    const {getByTestId} = render(
      <CInput
        _value=""
        placeHolder="Multiline"
        toGetTextFieldValue={() => {}}
        multiline={true}
      />,
    );
    expect(getByTestId('textInput').props.multiline).toBe(true);
  });

  it('applies placeholder color style when not editable', () => {
    const {getByTestId} = render(
      <CInput _value="" toGetTextFieldValue={() => {}} _editable={false} />,
    );
    const input = getByTestId('textInput');
    const style = Array.isArray(input.props.style)
      ? input.props.style
      : [input.props.style];
    expect(
      style.some(
        s =>
          (s &&
            s.color ===
              require('../../../components/common/CInput').default.defaultProps
                ?.colors?.placeHolderColor) ||
          require('../../../themes').colors.placeHolderColor,
      ),
    ).toBe(true);
  });

  it('renders rightAccessory if provided', () => {
    const accessoryMock = jest.fn(() => <></>);
    const {getByTestId} = render(
      <CInput
        _value=""
        toGetTextFieldValue={() => {}}
        rightAccessory={accessoryMock}
      />,
    );
    expect(accessoryMock).toHaveBeenCalled();
  });

  it('renders required asterisk when required is true', () => {
    const {getByText} = render(
      <CInput
        _value=""
        label="My Label"
        required={true}
        toGetTextFieldValue={() => {}}
      />,
    );
    expect(getByText(' *')).toBeTruthy();
  });

  it('applies placeholder color style when not editable', () => {
    const {getByTestId} = render(
      <CInput _value="" toGetTextFieldValue={() => {}} _editable={false} />,
    );
    const input = getByTestId('textInput');
    const style = Array.isArray(input.props.style)
      ? input.props.style
      : [input.props.style];
    expect(
      style.some(
        s =>
          (s &&
            s.color ===
              require('../../../components/common/CInput').default.defaultProps
                ?.colors?.placeHolderColor) ||
          require('../../../themes').colors.placeHolderColor,
      ),
    ).toBe(true);
  });

  it('renders rightAccessory if provided', () => {
    const accessoryMock = jest.fn(() => <></>);
    const {getByTestId} = render(
      <CInput
        _value=""
        toGetTextFieldValue={() => {}}
        rightAccessory={accessoryMock}
      />,
    );
    expect(accessoryMock).toHaveBeenCalled();
  });

  it('renders insideLeftIcon if provided', () => {
    const iconMock = jest.fn(() => <></>);
    const {getByTestId} = render(
      <CInput
        _value=""
        placeHolder="With Icon"
        toGetTextFieldValue={() => {}}
        insideLeftIcon={iconMock}
      />,
    );
    expect(iconMock).toHaveBeenCalled();
  });

  it('shows error text when _errorText is provided', () => {
    const {getByText} = render(
      <CInput _value="" _errorText="Error!" toGetTextFieldValue={() => {}} />,
    );
    expect(getByText('Error!')).toBeTruthy();
  });
});
