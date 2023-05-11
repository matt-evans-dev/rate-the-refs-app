import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomScrollview, ListItem } from '../../shared/components';
import AdBanner from '../Ads/AdBanner';
import { Leagues, Teams, Conferences } from '../../api';
import { FormatData } from '../../shared/functions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  adBanner: {
    paddingBottom: 20
  },
  contentContainer: {
    paddingBottom: 40,
    justifyContent: 'flex-start',
    paddingHorizontal: 20
  }
});

const ReportsOnRefsScreen = ({ route = {}, navigation }) => {
  const [items, setItems] = useState([]);
  const fetched = useRef(false);

  const fetchLeagues = useCallback(async () => {
    try {
      const response = await Leagues.getAllLeagues();
      const formattedLeagues = FormatData.formatLeaguesForItems(response);
      console.log('formattedLeagues', formattedLeagues);
      const filteredLeagues = formattedLeagues.filter(league => league.ratingCount > 0);
      setItems(FormatData.sortByRatings(filteredLeagues));
      console.log('Sortd - Filtered Leagues', filteredLeagues);
    } catch (error) {
      console.log(error);
    }
  }, [setItems]);

  const fetchTeamsFromType = useCallback(
    async (type, id) => {
      try {
        let response = [];
        if (type === 'league') {
          response = await Teams.getTeamsByLeagueId(id);
        }
        if (type === 'conference') {
          response = await Teams.getTeamsByConferenceId(id);
        }
        console.log('response', response);
        // For Teams Specific
        const formattedTeams = FormatData.formatTeamsForItems(response);
        setItems(FormatData.sortByRatings(formattedTeams));
      } catch (error) {
        console.log(error);
      }
    },
    [setItems]
  );

  const fetchConferencesFromLeague = useCallback(
    async leagueId => {
      try {
        const response = await Conferences.getConferencesByLeagueById(leagueId);
        console.log('response', response);
        // For Conference Specific
        const formattedConferences = FormatData.formatConferencesForItems(response);
        setItems(FormatData.sortByRatings(formattedConferences));
      } catch (error) {
        console.log(error);
      }
    },
    [setItems]
  );

  useEffect(() => {
    const { type = 'league' } = route.params;
    console.log('type', type);

    const fetchResults = async () => {
      if (type === 'league') {
        fetchLeagues();
      }
      if (type === 'teams') {
        const { leagueId, conferenceId } = route.params;
        if (leagueId) {
          fetchTeamsFromType('league', leagueId);
        }
        if (conferenceId) {
          fetchTeamsFromType('conference', conferenceId);
        }
      }
      if (type === 'conference') {
        const { leagueId } = route.params;
        fetchConferencesFromLeague(leagueId);
      }
    };

    if (items.length === 0 && !fetched.current) {
      fetched.current = true;
      fetchResults();
    }
  }, [items, setItems, fetchLeagues, fetchTeamsFromType, fetchConferencesFromLeague]);

  const onPressItem = useCallback(
    item => {
      console.log(item);
      if (item.type === 'league') {
        if (item.hasConferences) {
          navigation.push('ReportsOnRefs', { type: 'conference', leagueId: item.id });
          return;
        }
        navigation.push('ReportsOnRefs', { type: 'teams', leagueId: item.id });
      }
      if (item.type === 'conference') {
        navigation.push('ReportsOnRefs', { type: 'teams', conferenceId: item.id });
      }
      if (item.type === 'team') {
        console.log('Team', item);
      }
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <CustomScrollview>
        <View style={styles.contentContainer}>
          {items.map(item => {
            return <ListItem key={item.id} hideFavorite onPress={onPressItem} item={item} />;
          })}
        </View>
      </CustomScrollview>
      <AdBanner containerStyle={styles.adBanner} adType="static" />
    </View>
  );
};

export default ReportsOnRefsScreen;
