import React, { useState, useCallback, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { TabView } from 'react-native-tab-view';
import { CustomTabBar } from '../../shared/components';
import { Schedule, Leagues } from '../../api';
import { FormatData } from '../../shared/functions';
import GameListView from '../GamesList/GameListView';
import { DataContext } from '../../context/DataContext';
import GamesList from '../GamesList/GamesList';

const styles = StyleSheet.create({
  container: { flex: 1 },
  gameListContainer: {
    flex: 0,
    paddingHorizontal: 20
  }
});

const ListGamesScreen = ({ navigation = {}, route }) => {
  const { type = 'past', selectedCategory = 'GAMES' } = route.params;
  navigation.setOptions({ title: selectedCategory });
  const dataContext = useContext(DataContext);

  const [games, setGames] = useState([]);
  const fetched = useRef(false);
  const [fetching, setFetching] = useState(true);

  const [tabState, setTabState] = useState({
    index: 0,
    routes: []
  });

  const fetchLeagues = useCallback(async () => {
    const response = await Leagues.getAllLeaguesWithGames();
    console.log('Leagues', response);
    setTabState({ index: 0, routes: FormatData.formatLeaguesForTabs(response, true) });
  }, [setTabState]);

  const fetchPastGames = useCallback(async () => {
    const res = await Schedule.getUserPastGames();
    console.log('Past Games Res', res);
    setGames(res);
  }, [setGames]);

  const fetchTrendingGames = useCallback(async () => {
    const res = await Schedule.getTrendingGames();
    console.log('Trending Games Res', res);
    setGames(res);
  }, [setGames, setFetching]);

  const fetchGames = useCallback(async () => {
    setFetching(true);
    try {
      if (type === 'past') {
        await fetchPastGames();
      }
      if (type === 'trending') {
        await fetchTrendingGames();
      }
      if (type === 'location') {
        await fetchLeagues();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  }, [type, fetchPastGames, fetchTrendingGames, fetchLeagues, setFetching]);

  // On initial rendering
  useFocusEffect(
    React.useCallback(() => {
      if (!fetched.current) {
        fetchGames();
        fetched.current = true;
      }
    }, [fetchGames])
  );

  // Check if Data should be refreshed - Set from Adding a rating or comments. Trending/Past Games only
  // Location games update handled in Section List
  useEffect(() => {
    if (type !== 'location' && dataContext.forceRefresh) {
      console.log('FORCE REFRESH DATA');
      const update = games.find(game => game.id === dataContext.forceRefresh);
      if (update) {
        console.log('Requires Update');
        fetchGames();
      }
      dataContext.setForceRefresh(null);
    }
  }, [dataContext, fetchGames, type]);

  const renderScene = useCallback(({ route, jumpTo }) => {
    return <GamesList type="leagues" jumpTo={jumpTo} route={route} withLocation />;
  }, []);

  const renderTabBar = useCallback(props => {
    return <CustomTabBar {...props} />;
  });

  const onPressOptionCallback = useCallback(
    index => {
      setTabState({ ...tabState, index });
    },
    [setTabState, tabState]
  );

  const onRefresh = useCallback(() => {
    fetchGames();
  }, [fetchGames]);

  return (
    <View style={styles.container}>
      {type === 'location' ? (
        <>
          {tabState.routes.length > 0 && (
            <TabView
              navigationState={tabState}
              renderScene={renderScene}
              onIndexChange={onPressOptionCallback}
              initialLayout={{ width: Dimensions.get('window').width }}
              renderTabBar={renderTabBar}
              lazy
            />
          )}
        </>
      ) : (
        <View style={styles.gameListContainer}>
          <GameListView games={games} onRefresh={onRefresh} refreshing={fetching} />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(ListGamesScreen);
