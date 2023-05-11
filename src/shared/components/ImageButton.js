import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Touchable from './Touchable';
import { colors } from '../styles/theme';

const ImageButton = ({
  onPress = () => {},
  disabled = false,
  imageSource = null,
  buttonStyle = {},
  loading = false
}) => {
  const buttonStyles = [styles.button, buttonStyle];

  return (
    <Touchable disabled={disabled || loading} onPress={onPress}>
      <View style={buttonStyles}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.darkGrey} />
        ) : (
          <Image resizeMode="contain" style={styles.imageStyle} source={imageSource} />
        )}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  button: {},
  imageStyle: { width: '100%', height: '100%' }
});

export default ImageButton;
