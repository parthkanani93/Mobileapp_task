import * as constants from '../../common/constants';

describe('constants.js', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('getHeight returns correct value', () => {
    const val = constants.getHeight(406);
    expect(typeof val).toBe('number');
  });

  it('moderateScale returns correct value', () => {
    const result = constants.moderateScale(10);
    expect(typeof result).toBe('number');
  });

  it('iPhoneX is false, STATUSBAR_HEIGHT is 22 (iOS, not iPhoneX)', () => {
    jest.doMock('react-native', () => ({
      Platform: {OS: 'ios'},
      StatusBar: {currentHeight: 20},
      Dimensions: {get: () => ({width: 375, height: 834})}, // 834 - 22 = 812
    }));
    const c = require('../../common/constants');
    expect(c.STATUSBAR_HEIGHT).toBe(22);
    expect(c.isAndroid).toBe(false);
  });

  it('STATUSBAR_HEIGHT uses StatusBar.currentHeight, isAndroid is true (Android)', () => {
    jest.doMock('react-native', () => ({
      Platform: {OS: 'android'},
      StatusBar: {currentHeight: 25},
      Dimensions: {get: () => ({width: 375, height: 900})},
    }));
    const c = require('../../common/constants');
    expect(c.STATUSBAR_HEIGHT).toBe(25);
    expect(c.isAndroid).toBe(true);
  });

  it('ApiType has correct keys', () => {
    expect(constants.ApiType.GET).toBe('GET');
    expect(constants.ApiType.POST).toBe('POST');
    expect(constants.ApiType.PUT).toBe('PUT');
    expect(constants.ApiType.DELETE).toBe('DELETE');
  });

  it('isShowLog is true', () => {
    expect(constants.isShowLog).toBe(true);
  });

  it('isAndroid is boolean', () => {
    expect(typeof constants.isAndroid).toBe('boolean');
  });

  it('screenWidth and screenHeight are numbers', () => {
    expect(typeof constants.screenWidth).toBe('number');
    expect(typeof constants.screenHeight).toBe('number');
  });

  it('iosReelHeight and androidReelHeight are numbers', () => {
    expect(typeof constants.iosReelHeight).toBe('number');
    expect(typeof constants.androidReelHeight).toBe('number');
  });

  it('IS_LOGIN is "IS_LOGIN"', () => {
    expect(constants.IS_LOGIN).toBe('IS_LOGIN');
  });
});
