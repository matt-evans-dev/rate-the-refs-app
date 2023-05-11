import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ProfileScreen,
  NotificationsScreen,
  AddFavoritesScreen,
  GameRatingScreen,
  GameCommentsScreen
} from '../../features';
import defaultNavigationOptions from '../DefaultNavigationOptions';
import HeaderLogoIcon from '../../shared/components/HeaderLogoIcon';
import NotificationBell from '../../features/Notifications/NotificationBell';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerLeft: () => <HeaderLogoIcon />, headerRight: () => <NotificationBell /> }}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
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
      <Stack.Screen
        name="AddFavorites"
        component={AddFavoritesScreen}
        options={{ headerTitle: 'Add Favorites' }}
      />
    </Stack.Navigator>
  );
}
