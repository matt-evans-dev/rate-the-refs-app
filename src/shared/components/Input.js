import React, { useCallback, useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import ImageButton from './ImageButton';
import colors from '../styles/colors';
import PasswordEye from '../../assets/password-eye.png';
import { global } from '../styles/theme';

const styles = StyleSheet.create({
  defaultContainer: {},
  inputContainer: {
    position: 'relative',
    paddingLeft: 19,
    paddingRight: 15,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white
  },
  labelContainer: {
    position: 'absolute',
    top: -10,
    paddingHorizontal: 4,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    marginLeft: 15,
    zIndex: 9
  },
  inputLabel: {
    ...global.textStyles.title
  },
  defaultInput: {
    ...global.textStyles.text,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    flex: 1,
    color: colors.black
  },
  rightIcon: {
    height: 18,
    width: 18
  },
  inactive: {
    opacity: 0.4
  },
  errorText: {
    ...global.textStyles.text,
    fontSize: 12,
    marginTop: 5,
    color: colors.errorRed,
    alignSelf: 'flex-end'
  },
  errorContainer: {
    borderColor: colors.errorRed
  },
  errorLabel: {
    color: colors.errorRed
  }
});

const Input = ({
  value = '',
  label,
  inputStyle,
  placeholder,
  secureTextEntry,
  containerStyle,
  inputContainerStyle,
  returnKeyType,
  onSubmitEditing,
  autoFocus,
  keyboardType,
  error,
  onChangeText,
  name,
  ...props
}) => {
  const [hide, toggleEye] = useState(secureTextEntry);

  const onPressEyeCallback = useCallback(() => {
    toggleEye(!hide);
  }, [hide]);

  const onChangeTextCallback = useCallback(
    text => {
      onChangeText(name, text);
    },
    [onChangeText]
  );

  const containerStyles = [styles.defaultContainer, containerStyle];
  const inputContainerStyles = [
    styles.inputContainer,
    inputContainerStyle,
    error ? styles.errorContainer : {}
  ];
  const inputStyles = [styles.defaultInput, inputStyle];
  const labelStyles = [styles.inputLabel, error ? styles.errorLabel : {}];

  return (
    <View style={containerStyles}>
      <View style={inputContainerStyles}>
        <View style={styles.labelContainer}>
          <Text style={labelStyles}>{label}</Text>
        </View>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.lightGrey}
          style={inputStyles}
          onChangeText={onChangeTextCallback}
          secureTextEntry={hide}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          {...props}
        />
        {value.length > 0 && secureTextEntry && (
          <ImageButton
            onPress={onPressEyeCallback}
            imageSource={PasswordEye}
            buttonStyle={hide ? styles.rightIcon : [styles.rightIcon, styles.inactive]}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

Input.defaultProps = {
  inputStyle: {},
  containerStyle: {},
  inputContainerStyle: {},
  placeholder: '',
  secureTextEntry: false,
  onSubmitEditing: () => {},
  returnKeyType: 'done',
  autoFocus: false,
  keyboardType: 'default',
  label: ''
};
export default Input;
