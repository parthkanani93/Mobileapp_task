import React from 'react';
import {render} from '@testing-library/react-native';
import CText from '../../../components/common/CText';

jest.mock('../../../themes/typography', () => ({
  fontWeights: {
    Regular: {fontWeight: '400'},
    Medium: {fontWeight: '500'},
    SemiBold: {fontWeight: '600'},
    Bold: {fontWeight: '700'},
    default: {fontWeight: '400'},
  },
  fontSizes: {
    f10: {fontSize: 10},
    f12: {fontSize: 12},
    f14: {fontSize: 14},
    f16: {fontSize: 16},
    f18: {fontSize: 18},
    f20: {fontSize: 20},
    f22: {fontSize: 22},
    f24: {fontSize: 24},
    f26: {fontSize: 26},
    f28: {fontSize: 28},
    f30: {fontSize: 30},
    f32: {fontSize: 32},
    f34: {fontSize: 34},
    f35: {fontSize: 35},
    f36: {fontSize: 36},
    f40: {fontSize: 40},
    f46: {fontSize: 46},
  },
}));

jest.mock('../../../themes', () => ({
  colors: {
    textColor1: '#111',
  },
}));

describe('CText', () => {
  it('renders children', () => {
    const {getByText} = render(<CText type="M16">Hello</CText>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('applies correct fontWeight and fontSize from type', () => {
    const {getByText} = render(<CText type="B20">BoldText</CText>);
    const text = getByText('BoldText');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({fontWeight: '700'}),
        expect.objectContaining({fontSize: 20}),
      ]),
    );
  });

  it('applies default fontWeight when type is unknown', () => {
    const {getByText} = render(<CText type="X20">DefaultWeight</CText>);
    const text = getByText('DefaultWeight');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({fontWeight: '400'})]),
    );
  });

  it('applies color and align props', () => {
    const {getByText} = render(
      <CText type="R14" color="#f00" align="center">
        Colored
      </CText>,
    );
    const text = getByText('Colored');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({color: '#f00'}),
        expect.objectContaining({textAlign: 'center'}),
      ]),
    );
  });

  const fontSizeCases = [
    {type: 'R18', size: 18},
    {type: 'S24', size: 24},
    {type: 'B26', size: 26},
    {type: 'M28', size: 28},
    {type: 'R30', size: 30},
    {type: 'S32', size: 32},
    {type: 'B34', size: 34},
    {type: 'M35', size: 35},
    {type: 'R36', size: 36},
    {type: 'S40', size: 40},
    {type: 'B46', size: 46},
    {type: 'R22', size: 22},
  ];

  fontSizeCases.forEach(({type, size}) => {
    it(`applies correct fontSize for type ${type}`, () => {
      const {getByText} = render(<CText type={type}>{type}</CText>);
      const text = getByText(type);
      expect(text.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({fontSize: size})]),
      );
    });
  });

  it('applies default fontSize when type is unknown', () => {
    const {getByText} = render(<CText type="R99">DefaultFontSize</CText>);
    const text = getByText('DefaultFontSize');
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({fontSize: 14})]),
    );
  });
});
