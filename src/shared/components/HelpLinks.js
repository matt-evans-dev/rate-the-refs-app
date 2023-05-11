import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, global} from '../styles/theme';
import {Links} from '../functions';
import NavigationService from '../../navigation/NavigationService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    ...global.textStyles.title,
    marginHorizontal: 5,
    color: colors.black,
    fontSize: 12,
  },
});

const HelpLinks = () => {
  const onPressLogin = () => {
    NavigationService.navigate('Policy');
  };

  return (
    <View style={styles.container}>
      <View style={styles.linksRow}>
        <Text
          onPress={() => Links.openUrl('https://ratetherefs.com/terms-of-use')}
          style={styles.link}>
          Terms & Conditions
        </Text>
        <Text style={styles.link}>|</Text>
        <Text onPress={onPressLogin} style={styles.link}>
          Privacy Policy
        </Text>
      </View>
      <View style={styles.linksRow}>
        <Text
          onPress={() => Links.openUrl('https://ratetherefs.com')}
          style={styles.link}>
          Contact Us
        </Text>
        <Text style={styles.link}>|</Text>
        <Text
          onPress={() => Links.openUrl('https://ratetherefs.com')}
          style={styles.link}>
          Learn More
        </Text>
      </View>
    </View>
  );
};

export default HelpLinks;