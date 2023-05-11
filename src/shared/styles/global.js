import { StyleSheet, Platform } from 'react-native';
import colors from './colors';

const textStyles = StyleSheet.create({
  header: {
    fontFamily: 'Anton-Regular',
    color: colors.black,
    fontSize: 18
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Open Sans' : 'OpenSans-Regular',
    color: colors.black,
    fontSize: 14,
    fontWeight: '600'
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Open Sans' : 'OpenSans-Regular',
    fontSize: 14,
    color: colors.black
  },
  subText: {
    fontFamily: Platform.OS === 'ios' ? 'Open Sans' : 'OpenSans-Regular',
    fontSize: 13,
    color: colors.black
  }
});

export default { textStyles };
