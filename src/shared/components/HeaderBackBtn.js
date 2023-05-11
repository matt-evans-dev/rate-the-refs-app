import React, { useCallback } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Touchable from './Touchable';
import BackArrow from '../../assets/arrow-left.png';

const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    justifyContent: 'center'
  }
});

const HeaderBackBtn = ({ handleBack }) => {
  const navigation = useNavigation();
  const onPressBackCallback = useCallback(() => {
    if (!handleBack) {
      navigation.goBack();
    } else {
      handleBack();
    }
  }, [navigation, handleBack]);

  return (
    <Touchable onPress={onPressBackCallback} style={styles.container}>
      <Image source={BackArrow} resizeMode="contain" />
    </Touchable>
  );
};

export default HeaderBackBtn;
