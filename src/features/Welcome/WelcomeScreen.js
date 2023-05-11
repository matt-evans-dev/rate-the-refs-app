import React, { useCallback } from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Button, HelpLinks } from '../../shared/components';
import Logo from '../../assets/logo.png';
import Basketball from '../../assets/basketball.png';
import Football from '../../assets/football.png';
import Soccer from '../../assets/soccer.png';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    flex: 1,
    alignSelf: 'center'
  },
  bottomView: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-around'
  },
  sportsRow: {
    // Only paddingLeft because soccer Ball on right is wider than the rest of icons.
    paddingLeft: 30,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonsContainer: {
    marginBottom: 20,
    paddingHorizontal: 30,
    alignItems: 'center'
  },
  buttons: {
    minWidth: '100%',
    marginBottom: 20
  },
  bottomContainer: {
    flex: 1,
    paddingBottom: 10
  }
});

const WelcomeScreen = ({ navigation }) => {
  const onPressSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);
  const onPressLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <View style={styles.bottomView}>
          <View style={styles.buttonsContainer}>
            <Button title="Sign Up" onPress={onPressSignUp} buttonStyle={styles.buttons} />
            <Button title="Login" secondary onPress={onPressLogin} buttonStyle={styles.buttons} />
          </View>
          <View style={styles.sportsRow}>
            <Image source={Basketball} resizeMode="contain" style={styles.sport} />
            <Image source={Football} resizeMode="contain" style={styles.sport} />
            <Image source={Soccer} resizeMode="contain" style={styles.sport} />
          </View>
          <View style={styles.bottomContainer}>
            <HelpLinks />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
