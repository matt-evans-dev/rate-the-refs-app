/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import { global, colors } from '../../../shared/styles/theme';
import { Touchable, StarRating } from '../../../shared/components';

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 20
  },
  itemContainer: {
    height: 140,
    width: 130,
    marginRight: 20,
    marginBottom: 5,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: 'black',
    shadowOpacity: 0.25,
    elevation: 4
  },
  time: {
    ...global.textStyles.subText,
    color: colors.white,
    marginTop: 5,
    zIndex: 9,
    textAlign: 'center'
  },
  ratingsText: {
    ...global.textStyles.subText,
    color: colors.white,
    textAlign: 'center'
  },
  ratingContainer: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    zIndex: 9
  },
  teamLogo: {
    height: 48,
    width: 48
  },
  tintBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,.2)',
    borderRadius: 10,
    zIndex: 1
  }
});

const FavoritesCarousel = ({ onPressFavorite, games = [] }) => {
  const onPressFavoriteCallback = useCallback(
    item => {
      onPressFavorite(item);
    },
    [onPressFavorite]
  );
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {games.map((item, index) => {
        return (
          <FavoritesItem
            index={index}
            item={item}
            key={item.id}
            onPress={onPressFavoriteCallback}
          />
        );
      })}
    </ScrollView>
  );
};

const FavoritesItem = ({ item, onPress }) => {
  const onPressCallback = useCallback(() => {
    onPress(item);
  }, [onPress, item]);
  if (!item) {
    return <View />;
  }

  const hours = moment().diff(moment(item.start_time), 'hours');
  // 1 hour before game starts - for pregame discussions
  // After 4 hours show regular date.
  const gameTime =
    hours > -1 && hours < 4
      ? 'Live'
      : hours >= 4
      ? `Final - ${moment(item.start_time).format('MM/DD')}`
      : moment(item.start_time).format('ddd, MM/DD');
  return (
    <Touchable onPress={onPressCallback}>
      <View style={[styles.itemContainer, { backgroundColor: `#${item.home_team.color}` }]}>
        <View style={styles.tintBg} />
        <View style={styles.logoRow}>
          <Image
            source={{ uri: item.opponent_team.team_logo }}
            resizeMode="contain"
            style={styles.teamLogo}
          />
          <Image
            source={{ uri: item.home_team.team_logo }}
            resizeMode="contain"
            style={styles.teamLogo}
          />
        </View>
        {item.rating && (
          <View style={styles.ratingContainer}>
            <StarRating rating={item.rating || 0} size="sm" />
            <Text style={styles.ratingsText}>
              {`${item.rating_count || 0} ${
                item.rating_count && item.rating_count === '1' ? 'Rating' : 'Ratings'
              }`}
            </Text>
          </View>
        )}
        <Text style={styles.time}>{gameTime}</Text>
      </View>
    </Touchable>
  );
};

export default FavoritesCarousel;
