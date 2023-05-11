/* eslint-disable react/jsx-no-bind */
import React, {useEffect, useRef} from 'react';
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';
import {tabBarOptions} from './BottomNavOptions';
import NavigationService from './NavigationService';
import {
  WelcomeScreen,
  SignUpScreen,
  LoginScreen,
  PasswordResetScreen,
  AppLoadingScreen,
  RequiredInfoScreen,
} from '../features';
import defaultNavigationOptions from './DefaultNavigationOptions';
import CustomBottomTabs from './CustomBottomTabs';
import HomeStack from './stacks/HomeStack';
import EventsStack from './stacks/EventsStack';
import ProfileStack from './stacks/ProfileStack';
import DiscoverStack from './stacks/DiscoverStack';

import Home from '../assets/bottom-nav/home.png';
import Events from '../assets/bottom-nav/events.png';
import Discover from '../assets/bottom-nav/discover.png';
import HomeActive from '../assets/bottom-nav/home-active.png';
import EventsActive from '../assets/bottom-nav/events-active.png';
import DiscoverActive from '../assets/bottom-nav/discover-active.png';
import Profile from '../assets/bottom-nav/profile.png';
import ContextProvider from '../context/ContextProvider';
import Notifications from '../state/actions/Notifications';
import PolicyScreen from '../features/Policy/PolicyScreen';

const Stack = createStackNavigator();
const LoadingStack = createStackNavigator();
const RequiredStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Navigator = ({auth}) => {
  const onStateChange = state => {
    console.log('Navigator', state);
  };
  return (
    <NavigationContainer
      // eslint-disable-next-line react/jsx-no-bind
      onStateChange={onStateChange}
      ref={NavigationService.navigatorRef}>
      {auth.isFetching ? (
        <LoadingStack.Navigator initialRouteName="AppLoading">
          <LoadingStack.Screen
            name="AppLoading"
            component={AppLoadingScreen}
            options={{headerShown: false}}
          />
        </LoadingStack.Navigator>
      ) : (
        <SwitchNav auth={auth} />
      )}
    </NavigationContainer>
  );
};

const SwitchNav = ({auth = {isFetching: true}}) => {
  const checkedNotification = useRef(false);
  useEffect(() => {
    const checkNotificationPermission = async () => {
      try {
        checkedNotification.current = true;
        const notificationCheck = await checkNotifications();
        console.log('Notification Check', notificationCheck);
        if (notificationCheck.status === RESULTS.GRANTED) {
          if (auth.user && auth.user.notification_token) {
            // Start Listener for any changes in FCM Token.
            Notifications.startListeners();
          } else {
            // No Token Yet but permission is granted.
            await Notifications.getFirebasePushToken();
            Notifications.startListeners();
          }
        } else {
          const requestResult = await requestNotifications([
            'alert',
            'sound',
            'badge',
          ]);
          console.log('Notification Request Result', notificationCheck);
          if (requestResult.status === RESULTS.GRANTED) {
            await Notifications.getFirebasePushToken();
            Notifications.startListeners();
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (!checkedNotification.current && auth.user) {
      checkNotificationPermission();
    }
  }, [auth]);

  if (auth.user) {
    console.log('User Exists');
    const {display_name} = auth.user;
    /**
     * User has not set their user name - redirect to Required Screen to update before continuing in app.
     */
    if (!display_name || display_name.length === 0) {
      console.log('No Username set yet');
      return (
        <RequiredStack.Navigator screenOptions={defaultNavigationOptions}>
          <RequiredStack.Screen
            name="RequiredInfo"
            component={RequiredInfoScreen}
            options={{title: 'ADDITIONAL', headerLeft: null}}
          />
        </RequiredStack.Navigator>
      );
    }
    return (
      <ContextProvider>
        <Tab.Navigator
          tabBar={props => <CustomBottomTabs {...props} user={auth.user} />}
          tabBarOptions={tabBarOptions}
          initialRouteName="Home">
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarIcon: focused => (
                <Image
                  source={focused ? HomeActive : Home}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Events"
            component={EventsStack}
            options={{
              tabBarIcon: focused => (
                <Image
                  source={focused ? EventsActive : Events}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Discover"
            component={DiscoverStack}
            options={{
              tabBarIcon: focused => (
                <Image
                  source={focused ? DiscoverActive : Discover}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{
              tabBarIcon: () => <Image source={Profile} resizeMode="contain" />,
            }}
          />
        </Tab.Navigator>
      </ContextProvider>
    );
  }
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{title: 'SIGN UP'}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{title: 'LOGIN'}}
      />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{title: 'FORGOT PASSWORD'}}
      />
      <Stack.Screen
        name="Policy"
        component={PolicyScreen}
        options={{title: 'PRIVACY POLICY'}}
      />
    </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Navigator);