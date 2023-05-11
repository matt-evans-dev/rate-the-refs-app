import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Logo from '../../assets/Logo-r.png';

const styles = StyleSheet.create({
  container: {
    marginLeft: 15
  },
  logo: {
    height: 28,
    width: 28
  }
});

const HeaderLogoIcon = () => {
  return (
    <View style={styles.container}>
      <Image source={Logo} resizeMode="contain" style={styles.logo} />
    </View>
  );
};

export default HeaderLogoIcon;
