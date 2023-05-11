import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
import moment from 'moment';
import store from '../Store';
import * as Actions from '../ActionTypes';
import { retrieveData, storeData } from '../../shared/functions/AsyncStorage';
import User from './User';
import NavigationService from '../../navigation/NavigationService';

let onTokenRefreshListener = null;
let notificationOpenedListener = null;
let notificationListener = null;

const getFirebasePushToken = async () => {
  try {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('Got Token: ', fcmToken);
        const data = {
          notification_token: fcmToken
        };
        store.dispatch(User.updateUser(data));
      } else {
        // user doesn't have a device token yet
        console.log('No FCM Token for User');
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const startListeners = async () => {
  try {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      if (Platform.OS === 'ios') {
        await firebase.messaging().ios.registerForRemoteNotifications();
      }
      store.dispatch(fetchNotifications());
      // Create Android Notification Channel
      createNotificationChannel();
      // FCM token refresh listener - updates user with latest token
      startTokenRefreshListener();
      // App is in background when received notification listener
      startNotificationDisplayListener();
      // App is on foreground when notification was recieved
      startOnNotificationListener();
      // App was opened by Notification.
      getInitialNotificationListener();
    }
  } catch (error) {
    console.log(error);
  }
};

const stopListeners = () => {
  if (onTokenRefreshListener) onTokenRefreshListener();
  if (notificationOpenedListener) notificationOpenedListener();
  if (notificationListener) notificationListener();
};

const startTokenRefreshListener = () => {
  console.log('startTokenRefreshListener');
  onTokenRefreshListener = firebase.messaging().onTokenRefresh(async fcmToken => {
    // Process your token as required
    console.log('New Token Received', fcmToken);
    const data = {
      notification_token: fcmToken
    };
    store.dispatch(User.updateUser(data));
  });
};

const stopTokenRefreshListener = () => {
  if (onTokenRefreshListener) {
    console.log('Stopping Token Refresh Listener');
    onTokenRefreshListener();
  }
};

const startNotificationDisplayListener = () => {
  console.log('Start  NotificationOnOpened Listener');
  notificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(async notificationOpen => {
      // App is in background when received and this fires when app is opened
      console.log('onNotificationOpened');
      const { notification } = notificationOpen;
      // Get information about the notification that was opened
      console.log(notification);
      // store notification here
      await storeNotificationInStorage(notification);

      const user = firebase.auth().currentUser;
      if (user) {
        NavigationService.navigate('Notifications');
      }
    });
};

const startOnNotificationListener = async () => {
  console.log('Start OnNotification Listener');
  notificationListener = firebase.notifications().onNotification(notification => {
    // Process your notification as required

    // App is on foreground, alert user but dont navigate or take user anywhere
    console.log('onNotification: ');
    storeNotificationInStorage(notification);
    const user = firebase.auth().currentUser;
    if (user) {
      console.log(notification);
      notification.android.setChannelId('notifications');
      notification.android.setPriority(firebase.notifications.Android.Priority.High);
      notification.android.setAutoCancel(true);
      firebase
        .notifications()
        .displayNotification(notification)
        .catch(error => {
          console.log(error);
        });
    }
    // store notification._data here
  });
};

const getInitialNotificationListener = async () => {
  console.log('Get Initial Notification');
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    // App was opened by a notification
    // Get the action triggered by the notification being opened
    console.log('onInitialNotificationOpened');
    const { notification } = notificationOpen;
    // Get information about the notification that was opened
    console.log(notification);
    // store notification here
    await storeNotificationInStorage(notification);
    const user = firebase.auth().currentUser;
    if (user) {
      NavigationService.navigate('Notifications');
    }
  } else {
    console.log('No Notification Opened', notificationOpen);
  }
};

const storeNotificationInStorage = async notification => {
  const { _notificationId, _data = {} } = notification;
  const notificationHistoryKey = 'notificationHistory';
  const dataToStore = {
    id: _notificationId,
    title: _data.title,
    replyFrom: _data.replyFrom,
    replyFromProfilePicture: _data.replyFromProfilePicture,
    scheduleId: _data.scheduleId,
    parentCommentId: _data.parentCommentId,
    commentId: _data.commentId,
    unread: true,
    date: moment()
      .toDate()
      .toISOString()
  };

  const pastData = await retrieveData(notificationHistoryKey);
  if (pastData) {
    console.log('Past Data', pastData);
    const notificationHistory = JSON.parse(pastData);
    console.log('Notification Histroy Parsed', notificationHistory);
    // Check if already in history
    const exists = notificationHistory.find(notification => notification.id === dataToStore.id);
    console.log('Data To Store', dataToStore);
    if (!exists) {
      const newData = notificationHistory.slice();
      newData.unshift(dataToStore);
      if (newData.length > 15) {
        newData.pop();
      }
      storeData(notificationHistoryKey, newData);
    }
  } else {
    storeData(notificationHistoryKey, [dataToStore]);
  }
  store.dispatch(fetchNotifications());
};

const createNotificationChannel = () => {
  // Build a android notification channel
  const channel = new firebase.notifications.Android.Channel(
    'notifications', // channelId
    'Notifications Channel', // channel name
    firebase.notifications.Android.Importance.High // channel importance
  ).setDescription('Used for getting notification'); // channel description
  // Create the android notification channel
  firebase.notifications().android.createChannel(channel);
};

const fetchNotifications = () => {
  return async dispatch => {
    try {
      const notificationHistoryKey = 'notificationHistory';
      dispatch({ type: Actions.FETCHING_NOTIFICATIONS });
      const notificationHistory = await retrieveData(notificationHistoryKey);
      if (notificationHistory) {
        dispatch({
          type: Actions.FETCHING_NOTIFICATIONS_SUCCESS,
          payload: JSON.parse(notificationHistory)
        });
        return;
      }
      throw Error('No Notifications Found');
    } catch (error) {
      dispatch({
        type: Actions.FETCHING_NOTIFICATIONS_FAIL,
        payload: error.message
      });
    }
  };
};

const markNotificationsRead = () => {
  return async dispatch => {
    dispatch({ type: Actions.UPDATING_NOTIFICATIONS });
    try {
      firebase.notifications().cancelAllNotifications();
      const notificationHistoryKey = 'notificationHistory';
      const notificationHistory = await retrieveData(notificationHistoryKey);
      if (notificationHistory) {
        const parsedNotificationsCopy = JSON.parse(notificationHistory).slice();
        parsedNotificationsCopy.forEach(element => {
          element.unread = false;
        });
        await storeData(notificationHistoryKey, parsedNotificationsCopy);
        dispatch({
          type: Actions.UPDATING_NOTIFICATIONS_SUCCESS,
          payload: parsedNotificationsCopy
        });
        return;
      }
      throw Error('No Notifications Found');
    } catch (error) {
      dispatch({ type: Actions.UPDATING_NOTIFICATIONS_FAIL, payload: error.message });
    }
  };
};

export default {
  getFirebasePushToken,
  startTokenRefreshListener,
  stopTokenRefreshListener,
  startNotificationDisplayListener,
  getInitialNotificationListener,
  startListeners,
  stopListeners,
  markNotificationsRead,
  fetchNotifications
};
