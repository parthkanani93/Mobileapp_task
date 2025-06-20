import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';

// Local Imports
import { IS_LOGIN, moderateScale } from '../../common/constants';
import { colors, styles } from '../../themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNav } from '../../navigation/NavigationKeys';

export default function SplashScreen({ navigation }) {
  const asyncProcess = async () => {
    try {
      const isLoginValue = await AsyncStorage.getItem(IS_LOGIN);

      if (!!isLoginValue) {
        return navigation.reset({
          index: 0,
          routes: [{ name: StackNav.TabNavigation }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: StackNav.Login }],
        });
      }
    } catch (e) {
      console.error('Error in asyncProcess:', e);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      asyncProcess();
    }, 1000);
  }, []);

  return (
    <View style={localStyles.mainContainer}>
      <ActivityIndicator size={'small'} color={colors.primary} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.flexCenter,
  },
  splashIcon: {
    width: moderateScale(300),
    height: moderateScale(300),
  },
});
