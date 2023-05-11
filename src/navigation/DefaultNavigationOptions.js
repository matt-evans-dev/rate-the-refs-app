import React from 'react';
import { colors, global } from '../shared/styles/theme';
import HeaderBackBtn from '../shared/components/HeaderBackBtn';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.lightBlue,
    borderBottomWidth: 0
  },
  headerTitleAlign: 'center',
  headerLeft: () => <HeaderBackBtn />,
  headerBackTitle: null,
  headerTitleStyle: {
    ...global.textStyles.header,
    color: colors.teal,
    fontWeight: 'normal',
    fontSize: 18,
    alignSelf: 'center',
    textTransform: 'uppercase'
  },
  cardStyle: {
    backgroundColor: colors.white
  }
};

export default defaultNavigationOptions;
