import React, { useState, useRef, useCallback, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { connect } from 'react-redux';
import { CustomScrollview, SearchInput, ListItem } from '../../shared/components';
import { Leagues, Teams, UserAPI, Conferences, Search } from '../../api';
import User from '../../state/actions/User';
import { FormatData } from '../../shared/functions';
import { colors } from '../../shared/styles/theme';
import HeaderBackBtn from '../../shared/components/HeaderBackBtn';
import { DataContext } from '../../context/DataContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  contentScrollView: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'flex-start'
  },
  searchContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    paddingBottom: 10
  }
});

const AddFavoritesScreen = ({ navigation, route, user = {}, fetchLatestUser = () => {} }) => {
  const [userFavorites, setUserFavorites] = useState([]);
  const [showFavorite, setShowFavorite] = useState({});

  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const searchInputRef = useRef(null);
  const dataContext = useContext(DataContext);
  const [items, setItems] = useState([]);
  const fetched = useRef(false);

  const fetchLeagues = useCallback(async () => {
    try {
      const response = await Leagues.getAllLeagues();
      console.log('Leagues', response);
      setItems(FormatData.formatLeaguesForItems(response));
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
        setItems(FormatData.formatTeamsForItems(response));
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
        setItems(FormatData.formatConferencesForItems(response));
      } catch (error) {
        console.log(error);
      }
    },
    [setItems]
  );

  useEffect(() => {
    const { type } = route.params;
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

  /**
   * Set Favorites based on type of screen - league, team , conference
   */
  useEffect(() => {
    const { type } = route.params;
    if (searchResults) {
      const favorites = [];
      if (user.users_favorite_conferences) {
        favorites.push(...user.users_favorite_conferences);
      }
      if (user.users_favorite_leagues) {
        favorites.push(...user.users_favorite_leagues);
      }
      if (user.users_favorite_teams) {
        favorites.push(...user.users_favorite_teams);
      }
      // Combining all ids - they should be unique across all
      if (userFavorites.length !== favorites.length) {
        setUserFavorites(favorites);
      }
    } else {
      if (type === 'league') {
        if (
          user.users_favorite_leagues &&
          user.users_favorite_leagues.length !== userFavorites.length
        ) {
          setUserFavorites(user.users_favorite_leagues);
          return;
        }
      }
      if (type === 'teams') {
        if (
          user.users_favorite_teams &&
          user.users_favorite_teams.length !== userFavorites.length
        ) {
          setUserFavorites(user.users_favorite_teams);
          return;
        }
      }

      if (type === 'conference') {
        if (
          user.users_favorite_conferences &&
          user.users_favorite_conferences.length !== userFavorites.length
        ) {
          setUserFavorites(user.users_favorite_conferences);
        }
      }
    }
  }, [
    userFavorites,
    user.users_favorite_teams,
    user.users_favorite_leagues,
    user.users_favorite_conferences,
    searchResults
  ]);

  /**
   * Focus Search Input onLoad
   */
  // useEffect(() => {
  //   if (searchInputRef && searchInputRef.current) {
  //     searchInputRef.current.focus();
  //   }
  // }, [searchInputRef]);

  const favoriteItem = useCallback(
    async item => {
      console.log(item);
      const indexOfFavorite = userFavorites.indexOf(item.id);
      if (indexOfFavorite > -1) {
        if (item.type === 'team') {
          await UserAPI.removeTeamFromFavorites(item.id).catch(error => console.log(error));
        }
        if (item.type === 'league') {
          await UserAPI.removeLeagueFromFavorites(item.id).catch(error => console.log(error));
        }
        if (item.type === 'conference') {
          await UserAPI.removeConferenceFromFavorites(item.id).catch(error => console.log(error));
        }
      } else {
        if (item.type === 'team') {
          await UserAPI.addTeamToFavorites(item.id).catch(error => console.log(error));
        }
        if (item.type === 'league') {
          await UserAPI.addLeagueToFavorites(item.id).catch(error => console.log(error));
        }
        if (item.type === 'conference') {
          await UserAPI.addConferenceToFavorites(item.id).catch(error => console.log(error));
        }
        setShowFavorite(item.id);
        setTimeout(() => {
          setShowFavorite({});
        }, 300);
      }
      fetchLatestUser();
      dataContext.setForceRefresh('favorites');
    },
    [userFavorites, setUserFavorites, dataContext]
  );

  const onPressItem = useCallback(
    item => {
      console.log(item);
      if (item.type === 'league') {
        if (item.hasConferences) {
          navigation.push('AddFavorites', { type: 'conference', leagueId: item.id });
          return;
        }
        navigation.push('AddFavorites', { type: 'teams', leagueId: item.id });
      }
      if (item.type === 'conference') {
        navigation.push('AddFavorites', { type: 'teams', conferenceId: item.id });
      }
      if (item.type === 'team') {
        console.log('Team', item);
      }
    },
    [navigation]
  );

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchLoading(false);
    navigation.setOptions({
      headerLeft: () => <HeaderBackBtn />,
      headerTitle: 'ADD FAVORITES'
    });
  }, [setSearchResults, setSearchLoading, navigation]);

  const onChangeSearchTextCallback = useCallback(
    value => {
      setSearchInput(value);
      if (value.length === 0) {
        clearSearch();
      }
    },
    [setSearchInput, clearSearch]
  );

  const closeSearch = useCallback(() => {
    onChangeSearchTextCallback('');
  }, [onChangeSearchTextCallback]);

  const onSubmitCallback = useCallback(async () => {
    console.log('Search for ', searchInput);
    if (searchInput.length > 0) {
      try {
        setSearchLoading(true);
        const searchResponse = await Search.searchEntity(searchInput);
        const formattedSearchResults = FormatData.formatItemSearchResults(searchResponse);
        console.log('SearchResults', formattedSearchResults);
        navigation.setOptions({
          headerLeft: () => <HeaderBackBtn handleBack={closeSearch} />,
          headerTitle: `SEARCH RESULTS(${formattedSearchResults.length})`
        });
        setSearchResults(formattedSearchResults);
        setSearchLoading(false);
      } catch (error) {
        Alert.alert(error.message);
        clearSearch();
      }
    }
  }, [searchInput, setSearchResults, setSearchLoading, navigation, clearSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          forwardRef={searchInputRef}
          placeholder="Search for a team or league name.."
          value={searchInput}
          callback={onChangeSearchTextCallback}
          returnKeyType="send"
          onSubmitEditing={onSubmitCallback}
        />
      </View>
      <CustomScrollview contentStyle={styles.contentScrollView}>
        {searchLoading || searchResults ? (
          <View style={styles.searchResultsContainer}>
            {searchLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.blue} />
              </View>
            ) : (
              <View>
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map(item => {
                    const isFavorite = userFavorites.indexOf(item.id) > -1;
                    return (
                      <ListItem
                        key={item.id}
                        onPressFavorite={favoriteItem}
                        onPress={onPressItem}
                        item={item}
                        isFavorite={isFavorite}
                        showFavorite={showFavorite === item.id}
                      />
                    );
                  })
                ) : (
                  <Text style={styles.headerTitle}>NO RESULTS FOUND</Text>
                )}
              </View>
            )}
          </View>
        ) : (
          <>
            {items.map(item => {
              const isFavorite = userFavorites.indexOf(item.id) > -1;
              return (
                <ListItem
                  key={item.id}
                  onPressFavorite={favoriteItem}
                  onPress={onPressItem}
                  item={item}
                  isFavorite={isFavorite}
                  showFavorite={showFavorite === item.id}
                />
              );
            })}
          </>
        )}
      </CustomScrollview>
    </View>
  );
};

// AddFavoritesScreen.navigationOptions = {
//   title: 'ADD FAVORITES'
// };

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => {
  return {
    fetchLatestUser: () => dispatch(User.fetchLatestUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFavoritesScreen);
