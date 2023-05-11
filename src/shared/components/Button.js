import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import Touchable from './Touchable';
import { colors, global } from '../styles/theme';

const Button = ({
  link = false,
  icon = null,
  onPress = () => {},
  title = '',
  disabled = false,
  buttonStyle = {},
  textStyle = {},
  loading = false,
  secondary = false
}) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];

  if (secondary) {
    buttonStyles.push(styles.buttonSecondary);
    textStyles.push(styles.textSecondary);
  }

  if (link) {
    buttonStyles.push(styles.buttonLink);
    textStyles.unshift(styles.textLink);
  }
  if (disabled) {
    buttonStyles.push(styles.buttonDisabled);
  }

  buttonStyles.push(buttonStyle);
  textStyles.push(textStyle);

  return (
    <Touchable disabled={disabled || loading} onPress={onPress}>
      <View style={buttonStyles}>
        {!loading && icon}
        {loading ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : (
          <Text style={textStyles} disabled={disabled}>
            {title}
          </Text>
        )}
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    borderRadius: 20,
    backgroundColor: colors.blue,
    maxWidth: 255
  },
  text: {
    ...global.textStyles.title,
    color: colors.white
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderColor: colors.blue,
    borderWidth: 1
  },
  textSecondary: {
    ...global.textStyles.title,
    color: colors.blue
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonLink: {
    backgroundColor: colors.fullTransparent
  },
  textLink: { ...global.textStyles.title, color: colors.black }
});

export default Button;
