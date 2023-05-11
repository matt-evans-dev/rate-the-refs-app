import React from 'react';
import { View, StyleSheet, Image, TextInput } from 'react-native';
import SearchIcon from '../../assets/search-icon-dark.png';
import { colors } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchIcon: {
    marginRight: 10
  },
  inputStyle: {
    flex: 1,
    color: colors.black
  }
});

const SearchInput = ({
  callback,
  forwardRef,
  value = '',
  placeholder = '',
  containerStyle = {},
  inputStyle = {},
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={SearchIcon} resizeMode="contain" style={styles.searchIcon} />
      <TextInput
        ref={forwardRef}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.lightGrey}
        style={[styles.inputStyle, inputStyle]}
        onChangeText={callback}
        {...props}
      />
    </View>
  );
};

export default SearchInput;
