import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import { Schedule } from '../../api';
import GameListView from './GameListView';
import UserLocation from '../../shared/functions/UserLocation';
import { DataContext } from '../../context/DataContext';

const styles = StyleSheet.create({
  gamesContainer: {
    paddingHorizontal: 20
  }
});

const fetchNearbyGames = async (position, leagueId) => {
  const res = await Schedule.fetchGames(
    `date=${moment().format('YYYY-MM-DD')}&upcoming=true&league=${leagueId}&lat=${
      position.coords.latitude
    }&lng=${position.coords.longitude}`
  );
  return res;
};

/**
 * Only used for Nearby Games Screen
 * But keeping withLocation checks, just in case its required to switch to regular calls
 */
const GamesList = ({ route = {}, withLocation }) => {
  const [upcomingGames, setUpcomingGames] = useState([]);

  const [fetchingUpcoming, setFetchingUpcoming] = useState(true);
  const dataContext = useContext(DataContext);
  const askedPermission = useRef(false);

  const fetchWithLocation = useCallback(async () => {
    try {
      const position = await UserLocation.getUserLocation();
      let upcomingResult = [];

      upcomingResult = await fetchNearbyGames(position, route.id);
      setUpcomingGames(upcomingResult);
      setFetchingUpcoming(false);
    } catch (error) {
      setFetchingUpcoming(false);
    }
  }, [setUpcomingGames, setFetchingUpcoming]);

  useEffect(() => {
    if (withLocation && !askedPermission.current) {
      askedPermission.current = true;
      fetchWithLocation();
    }
  }, [withLocation, fetchWithLocation]);

  // Check if Data should be refreshed - Set from Adding a rating or comments.
  useEffect(() => {
    if (dataContext.forceRefresh) {
      console.log('FORCE REFRESH DATA');
      const updateUpcoming = upcomingGames.find(game => game.id === dataContext.forceRefresh);
      if (updateUpcoming) {
        if (withLocation) {
          fetchWithLocation();
        }
      }
      dataContext.setForceRefresh(null);
    }
  }, [dataContext, withLocation, fetchWithLocation]);

  const onRefresh = useCallback(() => {
    if (withLocation) {
      fetchWithLocation();
    }
  }, [withLocation, fetchWithLocation]);

  console.log('UpcomingGames', route.key, upcomingGames);

  return (
    <View style={styles.gamesContainer}>
      <GameListView
        withLocation={withLocation}
        games={upcomingGames}
        refreshing={fetchingUpcoming}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default React.memo(GamesList);
