import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  NotificationsScreen,
  GameRatingScreen,
  GameCommentsScreen
} from '../../features';
import defaultNavigationOptions from '../DefaultNavigationOptions';
import HeaderLogoIcon from '../../shared/components/HeaderLogoIcon';
import NotificationBell from '../../features/Notifications/NotificationBell';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerLeft: () => <HeaderLogoIcon />, headerRight: () => <NotificationBell /> }}
      />
      <Stack.Screen
        name="GameRatings"
        component={GameRatingScreen}
        options={{ title: 'RATE THE REF' }}
      />
      <Stack.Screen
        name="GameComments"
        component={GameCommentsScreen}
        options={{ title: 'GAME' }}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
