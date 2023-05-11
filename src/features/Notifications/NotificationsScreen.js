import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CustomScrollview, Touchable } from '../../shared/components';
import { global } from '../../shared/styles/theme';
import ProfilePicture from '../../assets/default-profile.png';
import AdBanner from '../Ads/AdBanner';
import Notifications from '../../state/actions/Notifications';
import Schedule from '../../api/Schedule';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  headerTitle: {
    marginTop: 20,
    ...global.textStyles.header
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  image: {
    marginRight: 10,
    height: 41,
    width: 41,
    borderRadius: 20.5
  },
  title: {
    ...global.textStyles.title
  },
  subtitle: {
    ...global.textStyles.subText
  },
  adBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  }
});

const NotificationsScreen = ({ navigation = {} }) => {
  const notifications = useSelector(state => state.notifications);
  const dispatch = useDispatch();
  const { data } = notifications;

  useEffect(() => {
    if (data.length > 0) {
      const hasUnread = data.filter(noti => noti.unread === true);
      if (hasUnread.length > 0) {
        dispatch(Notifications.markNotificationsRead());
      }
    }
  }, [dispatch, data]);

  const onPressNotification = useCallback(async notification => {
    console.log('Noti Pressed', notification);
    try {
      const game = await Schedule.getGameById(notification.scheduleId);
      navigation.navigate('GameComments', { game, notification });
    } catch (error) {
      Alert.alert(error.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <CustomScrollview>
        <View>
          {data.length > 0 ? (
            <>
              <Text style={styles.headerTitle}>MOST RECENT</Text>
              {data.map(item => (
                <NotificationItem key={item.id} notification={item} onPress={onPressNotification} />
              ))}
            </>
          ) : (
            <Text style={styles.headerTitle}>NO NOTIFICATIONS YET!</Text>
          )}
        </View>
      </CustomScrollview>
      <AdBanner containerStyle={styles.adBanner} adType="static" />
    </View>
  );
};

const NotificationItem = ({ notification = {}, onPress }) => {
  const onPressCallback = useCallback(() => {
    onPress(notification);
  }, [onPress, notification]);

  let profilePicture = ProfilePicture;
  if (notification.replyFromProfilePicture && notification.replyFromProfilePicture.length > 0) {
    profilePicture = { uri: notification.replyFromProfilePicture };
  }
  const subTitle = notification.title ? notification.title.replace(notification.replyFrom, '') : '';
  return (
    <Touchable style={styles.notificationRow} onPress={onPressCallback}>
      <Image source={profilePicture} resizeMode="cover" style={styles.image} />
      <Text style={styles.title}>{notification.replyFrom}</Text>
      <Text style={styles.subtitle}>{subTitle}</Text>
    </Touchable>
  );
};

export default NotificationsScreen;
