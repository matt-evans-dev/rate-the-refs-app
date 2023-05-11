import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Platform, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import ListGameView from '../../shared/components/ListGameView';
import AdBanner from '../Ads/AdBanner';
import { UserAPI } from '../../api';
import User from '../../state/actions/User';
import { Links } from '../../shared/functions';
import { colors, global } from '../../shared/styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 0
  },
  listContainer: {
    paddingBottom: 80
  },
  headerTitle: {
    marginTop: 20,
    ...global.textStyles.header,
    paddingLeft: 20
  }
});

// eslint-disable-next-line no-unused-vars
const getItemLayout = (data, index) => {
  const showAd = (index + 1) % 3 === 0;
  const HEIGHT = showAd ? 190 : 120;
  return {
    length: HEIGHT,
    offset: HEIGHT * index,
    index
  };
};

const keyExtractor = item => {
  return item.id;
};

const GameListView = ({
  games = [],
  user = {},
  fetchLatestUser = () => {},
  onRefresh = () => {},
  refreshing = true,
  withLocation
}) => {
  const navigation = useNavigation();
  const [userFavoriteGames, setUserFavoriteGames] = useState(user.users_favorite_games || []);

  // Update Favorite Games List
  useEffect(() => {
    const { users_favorite_games } = user;
    let hasDifferences = false;
    if (
      (users_favorite_games && users_favorite_games.length !== userFavoriteGames.length) ||
      (!users_favorite_games && userFavoriteGames.length > 0)
    ) {
      hasDifferences = true;
    }

    if (hasDifferences) {
      setUserFavoriteGames(users_favorite_games || []);
    }
  }, [user]);

  const onPressRating = useCallback(
    game => {
      console.log(game);
      navigation.navigate('GameRatings', { game });
    },
    [navigation]
  );
  const onPressComment = useCallback(
    game => {
      console.log(game);
      navigation.navigate('GameComments', { game });
    },
    [navigation]
  );

  const onPressFavorite = useCallback(
    async game => {
      const favIndex = userFavoriteGames.findIndex(item => item === game.id);
      console.log('onPress Favorite: ', game, favIndex, userFavoriteGames);
      const favCopy = userFavoriteGames.slice();
      if (favIndex > -1) {
        favCopy.splice(favIndex, 1);
        setUserFavoriteGames(favCopy);
        await UserAPI.removeGameFromFavorites(game.id);
      } else {
        favCopy.push(game.id);
        setUserFavoriteGames(favCopy);
        await UserAPI.addGameToFavorites(game.id);
      }
      fetchLatestUser();
    },
    [userFavoriteGames, setUserFavoriteGames]
  );

  const renderItem = useCallback(
    ({ item: game, index }) => {
      const isFavoriteIndex = userFavoriteGames.findIndex(item => item === game.id);
      const showAd = (index + 1) % 3 === 0;

      if (showAd) {
        return (
          <View key={game.id}>
            <ListGameView
              game={game}
              onPressRating={onPressRating}
              onPressComment={onPressComment}
              onPressFavorite={onPressFavorite}
              onPressShare={Links.shareGame}
              isFavorite={isFavoriteIndex > -1}
            />
            <AdBanner adType="list" />
          </View>
        );
      }
      return (
        <ListGameView
          key={game.id}
          game={game}
          onPressRating={onPressRating}
          onPressComment={onPressComment}
          onPressFavorite={onPressFavorite}
          onPressShare={Links.shareGame}
          isFavorite={isFavoriteIndex > -1}
        />
      );
    },
    [userFavoriteGames, games, onPressFavorite, onPressRating]
  );

  const renderEmptyComponent = useCallback(() => {
    if (refreshing) {
      return null;
    }
    if (withLocation) {
      return <Text style={styles.headerTitle}>NO GAMES NEARBY</Text>;
    }
    return <Text style={styles.headerTitle}>NO GAMES</Text>;
  }, [withLocation, refreshing]);

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        keyboardDismissMode="on-drag"
        initialNumToRender={6}
        windowSize={3}
        maxToRenderPerBatch={6}
        nestedScrollEnabled
        removeClippedSubviews={Platform.OS !== 'ios'}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            tintColor={colors.lightBlue}
            colors={[colors.blue]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => {
  return {
    fetchLatestUser: () => dispatch(User.fetchLatestUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameListView);
