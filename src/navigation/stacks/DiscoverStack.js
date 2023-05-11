import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  DiscoverScreen,
  NotificationsScreen,
  ReportsOnRefsScreen,
  ListGamesScreen,
  GameRatingScreen,
  GameCommentsScreen
} from '../../features';
import defaultNavigationOptions from '../DefaultNavigationOptions';
import NotificationBell from '../../features/Notifications/NotificationBell';
import HeaderLogoIcon from '../../shared/components/HeaderLogoIcon';

const Stack = createStackNavigator();

export default function DefaultStack() {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ headerLeft: () => <HeaderLogoIcon />, headerRight: () => <NotificationBell /> }}
      />
      <Stack.Screen
        name="ReportsOnRefs"
        component={ReportsOnRefsScreen}
        options={{ title: 'REPORTS ON REFS' }}
      />
      <Stack.Screen
        name="ListGames"
        component={ListGamesScreen}
        options={{ title: 'PAST GAMES' }}
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
