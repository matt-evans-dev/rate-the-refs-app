import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SectionList,
  RefreshControl,
  Platform
} from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { global, colors } from '../../shared/styles/theme';
import { Schedule, UserAPI } from '../../api';
import UserLocation from '../../shared/functions/UserLocation';
import { DataContext } from '../../context/DataContext';
import User from '../../state/actions/User';
import ListGameView from '../../shared/components/ListGameView';
import AdBanner from '../Ads/AdBanner';
import { FormatData, Links } from '../../shared/functions';

const styles = StyleSheet.create({
  gamesContainer: {
    paddingHorizontal: 20
  },
  headerTitle: {
    marginTop: 20,
    ...global.textStyles.header,
    fontSize: 22
  },
  headerSubTitle: {
    marginTop: 20,
    ...global.textStyles.header,
    fontSize: 18
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey
  },

  loadingContainer: {
    marginTop: 50
  }
});

const fetchNearbyGames = async (position, leagueId, upcoming) => {
  const res = await Schedule.fetchGames(
    `date=${moment().format('YYYY-MM-DD')}&${
      upcoming ? 'upcoming=true' : 'trending=true'
    }&league=${leagueId}&lat=${position.coords.latitude}&lng=${position.coords.longitude}`
  );
  return res;
};

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

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

const SectionGameList = ({ type = 'sports', route = {}, withLocation, handleScroll }) => {
  const navigation = useNavigation();
  const [trendingGames, setTrendingGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const fetchedTrending = useRef(false);
  const fetchedUpcoming = useRef(false);
  const [fetchingTrending, setFetchingTrending] = useState(true);
  const [fetchingUpcoming, setFetchingUpcoming] = useState(true);
  const dataContext = useContext(DataContext);
  const askedPermission = useRef(false);

  /**
   * Fetching Games Nearby - With Location
   */
  const fetchWithLocation = useCallback(
    async (upcoming, trending) => {
      try {
        const position = await UserLocation.getUserLocation();
        let upcomingResult = [];
        let trendingResult = [];
        if (upcoming && trending) {
          upcomingResult = await fetchNearbyGames(position, route.id, upcoming);
          trendingResult = await fetchNearbyGames(position, route.id, false);

          setUpcomingGames(upcomingResult);
          setFetchingUpcoming(false);

          setTrendingGames(trendingResult);
          setFetchingTrending(false);
        }
        if (upcoming && !trending) {
          // Set Upcoming only
          upcomingResult = await fetchNearbyGames(position, route.id, upcoming);
          setUpcomingGames(upcomingResult);
          setFetchingUpcoming(false);
        }
        if (trending && !upcoming) {
          // Set trending only
          trendingResult = await fetchNearbyGames(position, route.id, false);
          setTrendingGames(trendingResult);
          setFetchingTrending(false);
        }
      } catch (error) {
        setFetchingTrending(false);
        setFetchingUpcoming(false);
      }
    },
    [setTrendingGames, setUpcomingGames, setFetchingUpcoming, setFetchingTrending]
  );

  useEffect(() => {
    if (withLocation && !askedPermission.current) {
      askedPermission.current = true;
      fetchWithLocation(true, true);
    }
  }, [withLocation, fetchWithLocation]);

  /**
   * Fetch Trending Games
   */
  const fetchTrending = useCallback(() => {
    const fetchTrendingGamesByLeague = async () => {
      try {
        let result = [];
        if (route.id === 'top') {
          result = await Schedule.getTrendingGames();
        } else {
          result = await Schedule.getTrendingGamesByLeagueId(route.id);
        }
        setFetchingTrending(false);
        fetchedTrending.current = true;
        setTrendingGames(result);
      } catch (error) {
        console.log(error);
        setFetchingTrending(false);
        fetchedTrending.current = true;
        setTrendingGames([]);
      }
    };

    const fetchTrendingGamesBySport = async () => {
      try {
        let result = [];
        if (route.id === 'all') {
          result = await Schedule.getTrendingGames();
        } else {
          result = await Schedule.getTrendingGamesBySportId(route.id);
        }
        setFetchingTrending(false);
        fetchedTrending.current = true;
        setTrendingGames(result);
      } catch (error) {
        console.log(error);
        setFetchingTrending(false);
        fetchedTrending.current = true;
        setTrendingGames([]);
      }
    };

    if (type === 'leagues') {
      fetchTrendingGamesByLeague();
    }
    if (type === 'sports') {
      fetchTrendingGamesBySport();
    }
  }, [type, setTrendingGames, fetchNearbyGames, setFetchingTrending]);

  useEffect(() => {
    if (!fetchedTrending.current && !withLocation) {
      fetchTrending();
    }
  }, [route, fetchTrending]);

  /**
   * Fetch Upcoming Games
   */
  const fetchUpcoming = useCallback(() => {
    const fetchUpcomingGamesByLeague = async () => {
      try {
        let result = [];
        if (route.id === 'top') {
          result = await Schedule.getUpcomingGames();
        } else {
          result = await Schedule.getUpcomingGamesByLeagueId(route.id);
        }
        setFetchingUpcoming(false);
        fetchedUpcoming.current = true;
        setUpcomingGames(result);
      } catch (error) {
        console.log(error);
        setFetchingUpcoming(false);
        fetchedUpcoming.current = true;
        setUpcomingGames([]);
      }
    };
    const fetchUpcomingGamesBySport = async () => {
      try {
        let result = [];
        if (route.id === 'all') {
          result = await Schedule.getUpcomingGames();
        } else {
          result = await Schedule.getUpcomingGamesBySportId(route.id);
        }
        setFetchingUpcoming(false);
        fetchedUpcoming.current = true;
        setUpcomingGames(result);
      } catch (error) {
        console.log(error);
        setFetchingUpcoming(false);
        fetchedUpcoming.current = true;
        setUpcomingGames([]);
      }
    };

    if (type === 'leagues') {
      fetchUpcomingGamesByLeague();
    }
    if (type === 'sports') {
      fetchUpcomingGamesBySport();
    }
  }, [type, setUpcomingGames, fetchNearbyGames, setFetchingUpcoming]);

  useEffect(() => {
    if (!fetchedUpcoming.current && !withLocation) {
      fetchUpcoming();
    }
  }, [route, fetchUpcoming, withLocation]);

  // Check if Data should be refreshed - Set from Adding a rating or comments.
  useEffect(() => {
    if (dataContext.forceRefresh) {
      console.log('FORCE REFRESH DATA');
      const updateUpcoming = upcomingGames.find(game => game.id === dataContext.forceRefresh);
      let updateTrending = trendingGames.find(game => game.id === dataContext.forceRefresh);
      if (trendingGames.length === 0) {
        updateTrending = true;
      }
      if (updateTrending && updateUpcoming) {
        if (withLocation) {
          fetchWithLocation(true, true);
        } else {
          fetchUpcoming();
          fetchTrending();
        }
      }
      if (updateUpcoming && !updateTrending) {
        if (withLocation) {
          fetchWithLocation(true, false);
        } else {
          fetchUpcoming();
        }
      }
      if (updateTrending && !updateUpcoming) {
        if (withLocation) {
          fetchWithLocation(false, true);
        } else {
          fetchTrending();
        }
      }
      dataContext.setForceRefresh(null);
    }
  }, [dataContext, fetchUpcoming, fetchTrending, withLocation, fetchWithLocation]);

  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
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
      dispatch(User.fetchLatestUser());
    },
    [userFavoriteGames, setUserFavoriteGames]
  );

  const renderItem = useCallback(
    ({ item: game, index }) => {
      const isFavoriteIndex = userFavoriteGames.findIndex(item => item === game.id);
      const showAd = (index + 1) % 7 === 0;

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
            <AdBanner type="list" />
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
    [userFavoriteGames, onPressFavorite, onPressRating]
  );

  const renderSectionHeader = useCallback(({ section: { title } }) => {
    return (
      <View>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.divider} />
      </View>
    );
  }, []);

  const renderSectionFooter = useCallback(
    ({ section: { data } }) => {
      if (withLocation) {
        if (!fetchingTrending && !fetchingUpcoming) {
          if (data && data.length === 0) {
            return (
              <View>
                <Text style={styles.headerSubTitle}>NO GAMES NEARBY</Text>
              </View>
            );
          }
        }
      }

      return null;
    },
    [fetchedTrending, fetchingUpcoming, withLocation]
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log('onRefresh');
    setRefreshing(true);
    if (withLocation) {
      fetchWithLocation(true, true);
    } else {
      fetchUpcoming();
      fetchTrending();
    }
    wait(1000).then(() => setRefreshing(false));
  }, [refreshing, withLocation, setRefreshing, fetchWithLocation, fetchUpcoming, fetchTrending]);

  const onScroll = useCallback(
    event => {
      if (handleScroll) {
        // console.log('onScroll', event.nativeEvent.contentOffset.y);
        handleScroll(event.nativeEvent.contentOffset.y);
      }
    },
    [handleScroll]
  );

  const DATA = FormatData.formatGamesForSectionList(trendingGames, upcomingGames);

  console.log('Data', route.key, DATA);

  if (fetchingTrending || fetchingUpcoming) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }
  return (
    <SectionList
      sections={DATA}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialNumToRender={6}
      onScroll={onScroll}
      windowSize={3}
      refreshControl={
        <RefreshControl
          tintColor={colors.lightBlue}
          colors={[colors.blue]}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      maxToRenderPerBatch={6}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      removeClippedSubviews={Platform.OS !== 'ios'}
      contentContainerStyle={styles.gamesContainer}
      extraData={userFavoriteGames}
    />
  );
};

export default React.memo(SectionGameList);
