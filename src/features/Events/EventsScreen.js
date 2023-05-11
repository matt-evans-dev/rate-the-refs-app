import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, Text, ActivityIndicator } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { SearchInput, CustomTabBar } from '../../shared/components';
import { FormatData } from '../../shared/functions';
import { Schedule, Leagues } from '../../api';
import GameListView from '../GamesList/GameListView';
import { colors, global } from '../../shared/styles/theme';
import HeaderLogoIcon from '../../shared/components/HeaderLogoIcon';
import HeaderBackBtn from '../../shared/components/HeaderBackBtn';
import SectionGameList from '../GamesList/SectionGameList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-between'
  },
  headerTitle: {
    marginTop: 20,
    ...global.textStyles.header,
    paddingLeft: 20
  },
  loadingContainer: {
    marginTop: 50
  },
  searchResultsContainer: {
    paddingHorizontal: 20
  }
});

const EventsScreen = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const fetchedLeagues = useRef(false);
  const [tabState, setTabState] = useState({
    index: 0,
    routes: []
  });

  const fetchLeagues = useCallback(async () => {
    try {
      const response = await Leagues.getAllLeaguesWithGames();
      console.log('Leagues', response);
      setTabState({ index: 0, routes: FormatData.formatLeaguesForTabs(response) });
    } catch (error) {
      console.log(error);
    }
  }, [setTabState]);

  useEffect(() => {
    if (!fetchedLeagues.current) {
      fetchLeagues();
      fetchLeagues.current = true;
    }
  }, []);

  const renderScene = useCallback(({ route, jumpTo }) => {
    return <SectionGameList type="leagues" jumpTo={jumpTo} route={route} />;
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

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchLoading(false);
    navigation.setOptions({
      headerLeft: () => <HeaderLogoIcon />,
      headerTitle: 'EVENTS'
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
        const searchResponse = await Schedule.searchGames(searchInput);
        console.log('SearchResults', searchResponse);
        navigation.setOptions({
          headerLeft: () => <HeaderBackBtn handleBack={closeSearch} />,
          headerTitle: `SEARCH RESULTS(${searchResponse.length})`
        });
        setSearchResults(searchResponse);
        setSearchLoading(false);
      } catch (error) {
        Alert.alert(error.message);
        setSearchResults(null);
        setSearchLoading(false);
        clearSearch();
      }
    }
  }, [searchInput, setSearchResults, clearSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          placeholder="Search for a sporting event"
          value={searchInput}
          callback={onChangeSearchTextCallback}
          returnKeyType="send"
          onSubmitEditing={onSubmitCallback}
        />
      </View>
      {searchLoading || searchResults ? (
        <View style={styles.searchResultsContainer}>
          {searchLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.blue} />
            </View>
          ) : (
            <View>
              {searchResults && searchResults.length > 0 ? (
                <GameListView games={searchResults} />
              ) : (
                <Text style={styles.headerTitle}>NO RESULTS FOUND</Text>
              )}
            </View>
          )}
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default EventsScreen;
