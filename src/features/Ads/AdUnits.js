import { Platform } from 'react-native';

const getAdUnits = () => {
  if (__DEV__) {
    // TEST AD Unit
    return {
      list: 'ca-app-pub-3940256099942544/6300978111',
      static: 'ca-app-pub-3940256099942544/6300978111'
    };
  }

  if (Platform.OS === 'ios') {
    return {
      list: 'ca-app-pub-7633113347090076/7837319076',
      static: 'ca-app-pub-7633113347090076/9545437821'
    };
  }
  if (Platform.OS === 'android') {
    return {
      list: 'ca-app-pub-7633113347090076/6149279996',
      static: 'ca-app-pub-7633113347090076/6050019711'
    };
  }

  return {
    // Default will return Test Ads just in case.
    list: 'ca-app-pub-3940256099942544/6300978111',
    static: 'ca-app-pub-3940256099942544/6300978111'
  };
};

export default {
  getAdUnits
};
