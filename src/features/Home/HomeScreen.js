import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { CustomTabBar } from '../../shared/components';
import { global } from '../../shared/styles/theme';
import FavoritesCarousel from './components/FavoritesCarousel';
import { Schedule, Sports } from '../../api';
import { FormatData } from '../../shared/functions';
import { DataContext } from '../../context/DataContext';
import SectionGameList from '../GamesList/SectionGameList';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerTitle: {
    marginTop: 20,
    ...global.textStyles.header,
    paddingLeft: 20,
    fontSize: 22
  },
  hidden: {
    height: 0,
    width: 0
  }
});

const HomeScreen = ({ navigation }) => {
  const [tabState, setTabState] = useState({
    index: 0,
    routes: []
  });
  const [upcomingFavorites, setUpcomingFavorites] = useState([]);
  const fetchedUpcomingFavorites = useRef(false);
  const fetchedSports = useRef(false);
  const dataContext = useContext(DataContext);
  const [showFavorites, setShowFavorites] = useState(true);

  const fetchUpcomingFavorites = useCallback(async () => {
    console.log('fetching Upcoming Favorites');
    try {
      const res = await Schedule.getUserFavoritesUpcomingGames();
      console.log('Upcoming from favorite teams', res);
      setUpcomingFavorites(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!fetchedUpcomingFavorites.current) {
      fetchUpcomingFavorites();
      fetchedUpcomingFavorites.current = true;
    }
  }, [upcomingFavorites, fetchUpcomingFavorites]);

  useEffect(() => {
    if (dataContext.forceRefresh) {
      if (dataContext.forceRefresh === 'favorites') {
        fetchUpcomingFavorites();
        dataContext.setForceRefresh(null);
        return;
      }
      const updateUpcomingFavorites = upcomingFavorites.find(
        game => game.id === dataContext.forceRefresh
      );
      if (updateUpcomingFavorites) {
        fetchUpcomingFavorites();
        dataContext.setForceRefresh(null);
      }
    }
  }, [dataContext, fetchUpcomingFavorites, upcomingFavorites]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await Sports.getAllSportsWithGames();
        console.log('Sports', response);
        setTabState({ index: 0, routes: FormatData.formatSportsForTabs(response) });
      } catch (error) {
        console.log(error);
      }
    };
    if (!fetchedSports.current) {
      fetchSports();
      fetchedSports.current = true;
    }
  }, []);

  const onPressGameCallback = useCallback(
    game => {
      navigation.navigate('GameComments', { game });
    },
    [navigation]
  );

  const renderScene = useCallback(({ route, jumpTo }) => {
    return (
      <SectionGameList handleScroll={handleScroll} type="sports" jumpTo={jumpTo} route={route} />
    );
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

  const handleScroll = useCallback(
    scrollPosition => {
      if (scrollPosition <= 0) {
        console.log('top of the list', showFavorites);
        // Show Favourites
        setShowFavorites(true);
      } else {
        // hide Favorites
        setShowFavorites(false);
      }
    },
    [showFavorites]
  );

  return (
    <View style={styles.container}>
      {upcomingFavorites.length > 0 && (
        <FavoritesContainer
          games={upcomingFavorites}
          onPressGame={onPressGameCallback}
          showFavorites={showFavorites}
        />
      )}
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
    </View>
  );
};

const FavoritesContainer = ({ showFavorites, games, onPressGame }) => {
  const [bounceValue] = useState(new Animated.Value(0));
  const slideAnimation = useCallback(
    slideDown => {
      const toValue = slideDown ? 0 : -225;
      Animated.spring(bounceValue, {
        toValue,
        useNativeDriver: true
      }).start(finished => {
        console.log('finished', finished);
      });
    },
    [bounceValue]
  );

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (showFavorites) {
        console.log('Slide Down');
        slideAnimation(true);
      } else {
        console.log('Slide Up');
        slideAnimation();
      }
    }
  }, [showFavorites]);

  return (
    <Animated.View
      style={[
        styles.favoritesContainer,
        // eslint-disable-next-line no-nested-ternary
        Platform.OS === 'ios' ? (showFavorites ? {} : styles.hidden) : {},
        Platform.OS === 'ios' ? { transform: [{ translateY: bounceValue }] } : {}
      ]}
    >
      <Text style={styles.headerTitle}>FAVORITES</Text>
      <FavoritesCarousel games={games} onPressFavorite={onPressGame} />
    </Animated.View>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(HomeScreen);
