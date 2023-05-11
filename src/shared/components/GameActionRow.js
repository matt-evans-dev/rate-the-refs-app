import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, global } from '../styles/theme';
import Touchable from './Touchable';
import StarRating from './StarRating';
import RefereeShirt from '../../assets/referee-shirt.png';
import ChatBubble from '../../assets/chat-bubble.png';
import HeartActive from '../../assets/heart-active.png';
import HeartInactive from '../../assets/heart-inactive.png';
import Share from '../../assets/share-game.png';

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 20
  },
  ratingRow: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  refShirt: {
    width: 20,
    height: 18,
    marginRight: 8
  },
  ratingsText: {
    ...global.textStyles.text,
    marginLeft: 8
  },
  emptyView: {
    flex: 2
  },
  actionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentText: {
    ...global.textStyles.text,
    color: colors.lightGrey,
    marginLeft: 6
  },
  actionImage: {
    height: 20,
    width: 20
  }
});

const GameActionRow = ({
  game = {},
  userFavorite = false,
  onPressRating = () => {},
  onPressComments = () => {},
  onPressFavorite = () => {},
  onPressShare = () => {},
  showRatingRow = true,
  comments
}) => {
  return (
    <View style={styles.bottomRow}>
      {showRatingRow ? (
        <Touchable onPress={onPressRating} style={styles.ratingRow}>
          <Image source={RefereeShirt} style={styles.refShirt} />
          <StarRating rating={game.rating || 0} size="sm" />
          <Text style={styles.ratingsText}>
            {`${game.rating_count || 0} ${
              game.rating_count && game.rating_count === '1' ? 'Rating' : 'Ratings'
            }`}
          </Text>
        </Touchable>
      ) : (
        <View style={styles.emptyView} />
      )}
      <View style={styles.actionRow}>
        <Touchable onPress={onPressComments} style={styles.row}>
          <Image source={ChatBubble} style={styles.actionImage} />
          <Text style={styles.commentText}>{comments ? comments.length : ''}</Text>
        </Touchable>
        <Touchable onPress={onPressFavorite}>
          <Image source={userFavorite ? HeartActive : HeartInactive} style={styles.actionImage} />
        </Touchable>
        <Touchable onPress={() => onPressShare(game)}>
          <Image source={Share} style={styles.actionImage} />
        </Touchable>
      </View>
    </View>
  );
};

export default GameActionRow;
