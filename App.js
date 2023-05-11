import React, { useEffect, useRef } from 'react';
import { YellowBox, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import firebase from 'react-native-firebase';
import codePush from 'react-native-code-push';
import Store from './src/state/Store';
import 'react-native-gesture-handler';
import User from './src/state/actions/User';
import Navigator from './src/navigation/SwitchNav';
import Notifications from './src/state/actions/Notifications';

// Android Crash Issue https://github.com/kmagiera/react-native-screens/issues/309
if (Platform.OS === 'ios') {
  enableScreens();
}

// For Dev Only
// YellowBox.ignoreWarnings(['Remote debugger']);

const App = () => {
  const admobInitialized = useRef(false);
  useEffect(() => {
    console.log('APP CDM');
    codePush.sync({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
    console.log('Start Auth');
    User.startAuthListener();
    if (!admobInitialized.current) {
      firebase.admob().initialize('ca-app-pub-3940256099942544~3347511713');
      admobInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    return () => {
      console.log('Stop Auth');
      User.stopAuthListener();
      // Stop Listeners
      console.log('Stopping Notification Listeners');
      Notifications.stopListeners();
    };
  }, []);

  return (
    <Provider store={Store}>
      <Navigator />
    </Provider>
  );
};

export default App;
