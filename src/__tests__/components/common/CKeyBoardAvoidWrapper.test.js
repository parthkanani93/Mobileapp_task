import {Platform, Text} from 'react-native';
import {render} from '@testing-library/react-native';

describe('CKeyBoardAvoidWrapper', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
    jest.resetModules();
  });

  it('renders children inside KeyboardAvoidingView and ScrollView', () => {
    const CKeyBoardAvoidWrapper =
      require('../../../components/common/CKeyBoardAvoidWrapper').default;
    const {getByText} = render(
      <CKeyBoardAvoidWrapper>
        <Text>Test Child</Text>
      </CKeyBoardAvoidWrapper>,
    );
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('renders with Android (undefined offset and behavior)', () => {
    Platform.OS = 'android';
    jest.resetModules();
    const CKeyBoardAvoidWrapper =
      require('../../../components/common/CKeyBoardAvoidWrapper').default;

    const {getByText} = render(
      <CKeyBoardAvoidWrapper>
        <Text>Android Child</Text>
      </CKeyBoardAvoidWrapper>,
    );
    expect(getByText('Android Child')).toBeTruthy();
  });
});
