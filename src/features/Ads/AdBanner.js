import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import AdUnits from './AdUnits';

const { Banner } = firebase.admob;
const { AdRequest } = firebase.admob;
const request = new AdRequest();
request.addKeyword('sports');

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 20,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const AdBanner = ({ containerStyle, adType = 'static' }) => {
  const onAdLoaded = useCallback(() => {
    console.log('Advert loaded');
  }, []);
  const adUnit = adType === 'list' ? AdUnits.getAdUnits().list : AdUnits.getAdUnits().static;

  return (
    <View style={[styles.container, containerStyle]}>
      <Banner unitId={adUnit} size="BANNER" request={request.build()} onAdLoaded={onAdLoaded} />
    </View>
  );
};

export default AdBanner;
