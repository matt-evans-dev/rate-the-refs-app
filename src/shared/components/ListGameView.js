/* eslint-disable no-nested-ternary */
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { colors, global } from '../styles/theme';
import BigHeart from '../../assets/big-heart.png';
import DoubleTap from './DoubleTap';
import GameActionRow from './GameActionRow';

const styles = StyleSheet.create({
  container: {
    height: 100,
    borderLeftColor: colors.teal,
    borderLeftWidth: 5,
    borderColor: colors.teal,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 10,
    marginTop: 20,
    justifyContent: 'space-around'
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  teamLogo: {
    width: 35,
    height: 35,
    marginHorizontal: 3
  },
  titleContainer: {
    marginLeft: 10,
    flex: 1
  },
  gameTitle: {
    ...global.textStyles.title
  },
  gameDescription: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leagueText: {
    ...global.textStyles.subText,
    color: colors.blue
  },
  gameTimeLive: {
    color: colors.green
  },
  gameTimeFinal: {
    color: colors.red
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
  }
});

const ListGameView = ({
  game = {},
  onPressComment = () => {},
  onPressRating = () => {},
  onPressFavorite = () => {},
  onPressShare = () => {},
  isFavorite = false
}) => {
  const [showFavorite, setShowFavorite] = useState(false);
  const [userFavorite, setUserFavorite] = useState(isFavorite);

  useEffect(() => {
    if (isFavorite !== userFavorite) {
      // If user has favorited - isFavorite is true - userFavorite was false.
      if (isFavorite && !userFavorite) {
        setShowFavorite(true);
        setTimeout(() => {
          setShowFavorite(false);
        }, 300);
      }
      setUserFavorite(isFavorite);
    }
  }, [isFavorite, userFavorite, setShowFavorite, setUserFavorite]);

  const onPressCommentCallback = useCallback(() => {
    onPressComment(game);
  }, [game, onPressComment]);

  const onPressRatingCallback = useCallback(() => {
    onPressRating(game);
  }, [game, onPressRating]);

  const onPressFavoriteCallback = useCallback(() => {
    onPressFavorite(game);
  }, [game, onPressFavorite]);

  const onPressShareCallback = useCallback(() => {
    onPressShare(game);
  }, [game, onPressShare]);

  const hours = moment().diff(moment(game.start_time), 'hours');
  // 1 hour before game starts - for pregame discussions
  // After 4 hours show regular date.
  const gameTime =
    hours > -1 && hours < 4
      ? 'Live'
      : hours >= 4
      ? `Final - ${moment(game.start_time).format('L')}`
      : moment(game.start_time).format('L hh:mm a');

  return (
    <DoubleTap onDoubleTap={onPressFavoriteCallback} onSingleTap={onPressCommentCallback}>
      <View style={styles.container}>
        {showFavorite && (
          <View style={styles.favoriteOverlay}>
            <Image source={BigHeart} style={styles.bigHeart} resizeMode="contain" />
          </View>
        )}
        <View style={styles.topRow}>
          <View style={styles.logoRow}>
            <FastImage
              source={game.opponent_team.team_logo ? { uri: game.opponent_team.team_logo } : null}
              resizeMode={FastImage.resizeMode.contain}
              style={styles.teamLogo}
            />
            <FastImage
              source={game.home_team.team_logo ? { uri: game.home_team.team_logo } : null}
              resizeMode={FastImage.resizeMode.contain}
              style={styles.teamLogo}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.gameTitle}>
              {`${game.opponent_team.team_name} at ${game.home_team.team_name}`}
            </Text>
            <View style={styles.gameDescription}>
              <Text
                style={[
                  styles.leagueText,
                  gameTime.includes('Live') ? styles.gameTimeLive : {},
                  gameTime.includes('Final') ? styles.gameTimeFinal : {}
                ]}
              >
                {`${game.league_abbreviation}: ${gameTime}`}
              </Text>
            </View>
          </View>
        </View>
        <GameActionRow
          game={game}
          userFavorite={userFavorite}
          onPressComments={onPressCommentCallback}
          onPressRating={onPressRatingCallback}
          onPressShare={onPressShareCallback}
          onPressFavorite={onPressFavoriteCallback}
        />
      </View>
    </DoubleTap>
  );
};

export default ListGameView;
