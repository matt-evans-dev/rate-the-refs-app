import React, { useCallback } from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import COLORS from '../styles/colors';

const styles = StyleSheet.create({
  scrollview: { backgroundColor: COLORS.fullTransparent },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: COLORS.fullTransparent
  }
});

const CustomScrollview = ({ barStyle = 'dark-content', children = [], contentStyle = {} }) => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle(barStyle);
      }
    }, [barStyle])
  );

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraHeight={100}
      scrollEnabled
      bounces
      contentContainerStyle={[styles.contentContainer, contentStyle]}
      style={styles.scrollview}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="always"
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

CustomScrollview.defaultProps = {
  contentStyle: {},
  barStyle: 'dark-content' // or light-content
};

export default CustomScrollview;
