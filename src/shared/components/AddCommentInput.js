import React from 'react';
import { View, StyleSheet, Image, TextInput } from 'react-native';
import ProfilePicture from '../../assets/default-profile.png';
import { colors } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentInput: {
    flex: 1,
    justifyContent: 'center',
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingHorizontal: 20
  },
  inputStyle: {
    color: colors.black
  },
  profilePicture: {
    height: 41,
    width: 41,
    marginRight: 10,
    borderRadius: 20.5
  }
});

const AddCommentInput = ({
  callback = () => {},
  onSubmitCallback = () => {},
  value = '',
  forwardRef,
  placeholder = '',
  containerStyle = {},
  commentInputStyle = {},
  profilePicture = ProfilePicture,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={profilePicture} resizeMode="cover" style={styles.profilePicture} />
      <View style={[styles.commentInput, commentInputStyle]}>
        <TextInput
          ref={forwardRef}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.lightGrey}
          style={styles.inputStyle}
          onChangeText={callback}
          returnKeyType="send"
          onSubmitEditing={onSubmitCallback}
          {...props}
        />
      </View>
    </View>
  );
};

export default AddCommentInput;
