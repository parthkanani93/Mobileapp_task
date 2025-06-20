// Library Imports
import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';

// Local Imports
import {moderateScale} from '../../common/constants';
import {styles} from '../../themes';

// KeyboardAvoidWrapper Component
export default CKeyBoardAvoidWrapper = ({
  children,
  containerStyle,
  contentContainerStyle,
}) => {
  return (
    <KeyboardAvoidingView
      {...(Platform.OS === 'ios' && {
        keyboardVerticalOffset: moderateScale(10),
        behavior: 'padding',
      })}
      style={[styles.flex, containerStyle]}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        bounces={false}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
