import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Logo from '../../assets/logo.png';
import Basketball from '../../assets/basketball.png';
import Football from '../../assets/football.png';
import Soccer from '../../assets/soccer.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sportsRow: {
    // Only paddingLeft because soccer Ball on right is wider than the rest of icons.
    paddingLeft: 30,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sport: {}
});

const AppLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} resizeMode="contain" />
      <View style={styles.sportsRow}>
        <Image source={Basketball} resizeMode="contain" style={styles.sport} />
        <Image source={Football} resizeMode="contain" style={styles.sport} />
        <Image source={Soccer} resizeMode="contain" style={styles.sport} />
      </View>
    </View>
  );
};

export default AppLoadingScreen;
