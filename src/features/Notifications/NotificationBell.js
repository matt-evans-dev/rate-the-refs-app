import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Bell from '../../assets/alarm-bell.png';
import ActiveBell from '../../assets/alarm-bell-active.png';
import { Touchable } from '../../shared/components';
import { colors, global } from '../../shared/styles/theme';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 15
  },
  unreadCountContainer: {
    position: 'absolute',
    zIndex: 99,
    top: -5,
    right: -8,
    backgroundColor: colors.red,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 8
  },
  unreadCount: {
    ...global.textStyles.subText,
    color: colors.white,
    fontSize: 10
  }
});

const NotificationBell = () => {
  const navigation = useNavigation();
  const notifications = useSelector(state => state.notifications);

  const onPressBellCallback = useCallback(() => {
    navigation.navigate('Notifications');
  }, []);

  const { data = [] } = notifications;
  let unreadCount = 0;
  if (data.length > 0) {
    data.forEach(element => {
      if (element.unread) {
        unreadCount += 1;
      }
    });
  }
  return (
    <Touchable style={styles.container} onPress={onPressBellCallback}>
      {unreadCount > 0 && (
        <View style={styles.unreadCountContainer}>
          <Text style={styles.unreadCount}>{unreadCount}</Text>
        </View>
      )}
      <Image source={unreadCount > 0 ? ActiveBell : Bell} resizeMode="contain" />
    </Touchable>
  );
};

export default NotificationBell;
