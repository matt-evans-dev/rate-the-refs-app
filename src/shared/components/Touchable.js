import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

const Touchable = ({ children, style, ...props }) => {
  const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  // TouchableNativeFeedback does not support style
  if (Platform.OS === 'android' && style) {
    return (
      <TouchableOpacity style={style} activeOpacity={0.7} {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <Touchable style={style} {...props} activeOpacity={0.7}>
      {children}
    </Touchable>
  );
};

export default Touchable;
