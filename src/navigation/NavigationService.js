import * as React from 'react';
import { StackActions, CommonActions } from '@react-navigation/native';

const navigatorRef = React.createRef();

const navigate = (routeName, params) => {
  if (navigatorRef.current) {
    navigatorRef.current.navigate(routeName, params);
  }
};

const reset = (routes, index) => {
  if (navigatorRef.current) {
    navigatorRef.current.dispatch(CommonActions.reset({ index, routes }));
  }
};

const push = (...args) => {
  if (navigatorRef) {
    navigatorRef.current.dispatch(StackActions.push(...args));
  }
};

// add other navigation functions that you need and export them

export default {
  navigatorRef,
  navigate,
  reset,
  push
};
