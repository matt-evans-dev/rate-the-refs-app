import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { global, colors } from '../../shared/styles/theme';
import { Touchable } from '../../shared/components';
import ReportsOnRefs from '../../assets/discover/reports-on-refs.png';
import TrendingGames from '../../assets/discover/trending-games.png';
import PastGames from '../../assets/discover/past-games.png';
import GamesNearMe from '../../assets/discover/games-near-me.png';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topContainer: {
    flex: 1,
    marginBottom: 3
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  trendingGames: {
    flex: 1
  },
  bottomRightContainer: {
    flex: 1,
    marginLeft: 3
  },
  pastGames: {
    flex: 1,
    marginBottom: 3
  },
  gamesNearMe: {
    flex: 1
  },
  title: {
    ...global.textStyles.header,
    color: colors.white
  },
  imageBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const DiscoverScreen = ({ navigation }) => {
  const onPressCategoryCallback = useCallback(
    selected => {
      if (selected === 'PAST GAMES') {
        navigation.navigate('ListGames', { type: 'past', selectedCategory: selected });
        return;
      }
      if (selected === 'TRENDING GAMES') {
        navigation.navigate('ListGames', { type: 'trending', selectedCategory: selected });
        return;
      }
      if (selected === 'GAMES NEAR ME') {
        navigation.navigate('ListGames', { type: 'location', selectedCategory: selected });
        return;
      }
      navigation.navigate('ReportsOnRefs', { type: 'league' });
    },
    [navigation]
  );
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <DiscoverItem
          category="REPORTS ON REFS"
          onPress={onPressCategoryCallback}
          image={ReportsOnRefs}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.trendingGames}>
          <DiscoverItem
            category="TRENDING GAMES"
            onPress={onPressCategoryCallback}
            image={TrendingGames}
          />
        </View>
        <View style={styles.bottomRightContainer}>
          <View style={styles.pastGames}>
            <DiscoverItem
              category="PAST GAMES"
              onPress={onPressCategoryCallback}
              image={PastGames}
            />
          </View>
          <View style={styles.gamesNearMe}>
            <DiscoverItem
              category="GAMES NEAR ME"
              onPress={onPressCategoryCallback}
              image={GamesNearMe}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const DiscoverItem = ({ category, onPress, image }) => {
  const onPressCallback = useCallback(() => {
    onPress(category);
  }, [onPress, category]);
  return (
    <Touchable style={{}} onPress={onPressCallback}>
      <ImageBackground source={image} style={styles.imageBg}>
        <Text style={styles.title}>{category}</Text>
      </ImageBackground>
    </Touchable>
  );
};

export default DiscoverScreen;
