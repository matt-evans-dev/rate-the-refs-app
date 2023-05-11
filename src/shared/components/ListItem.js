import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import DoubleTap from './DoubleTap';
import Touchable from './Touchable';
import StarRating from './StarRating';
import { colors, global } from '../styles/theme';
import BigHeart from '../../assets/big-heart.png';
import HeartActive from '../../assets/heart-active.png';
import HeartInactive from '../../assets/heart-inactive.png';

const styles = StyleSheet.create({
  gameContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderLeftColor: colors.teal,
    borderLeftWidth: 5,
    borderColor: colors.teal,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 14
  },
  favoriteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(29, 122, 193, 0.7)',
    zIndex: 99,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigHeart: {
    height: 50
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 99
  },
  heart: {
    height: 20,
    width: 20
  },
  detailsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10
  },
  logo: {
    height: 70,
    width: 75
  },
  defaultLogo: {
    height: 70,
    width: 75,
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  },
  itemNameText: {
    ...global.textStyles.title,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingCountText: {
    ...global.textStyles.text,
    marginLeft: 10
  },
  leagueName: {
    color: colors.blue
  }
});

const ListItem = ({
  item = {},
  onPress = () => {},
  onPressFavorite,
  isFavorite = false,
  showFavorite,
  hideFavorite = false
}) => {
  const onPressFavoriteCallback = useCallback(() => {
    if (!hideFavorite) {
      onPressFavorite(item);
    }
  }, [onPressFavorite, item, hideFavorite]);

  const onPressCallback = useCallback(() => {
    onPress(item);
  }, [onPress, item, hideFavorite]);

  return (
    <DoubleTap
      style={styles.gameContainer}
      onSingleTap={onPressCallback}
      onDoubleTap={onPressFavoriteCallback}
    >
      {showFavorite && (
        <View style={styles.favoriteOverlay}>
          <Image source={BigHeart} style={styles.bigHeart} resizeMode="contain" />
        </View>
      )}
      {!hideFavorite && (
        <Touchable onPress={onPressFavoriteCallback} style={styles.favoriteBtn}>
          <Image source={isFavorite ? HeartActive : HeartInactive} style={styles.heart} />
        </Touchable>
      )}

      <View style={styles.detailsRow}>
        {!item.logo || item.logo.length === 0 ? (
          <View style={styles.defaultLogo} />
        ) : (
          <Image source={{ uri: item.logo }} resizeMode="contain" style={styles.logo} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.itemNameText}>{`${item.name} (${item.rating || 0})`}</Text>
          {item.league && <Text style={styles.leagueName}>{item.league}</Text>}
          <View style={styles.ratingRow}>
            <StarRating size="sm" rating={item.rating || 0} />
            <Text style={styles.ratingCountText}>{`${item.ratingCount || 0} Ratings`}</Text>
          </View>
        </View>
      </View>
    </DoubleTap>
  );
};

export default ListItem;
