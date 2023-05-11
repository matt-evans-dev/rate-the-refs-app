import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TabBar } from 'react-native-tab-view';
import { colors, global } from '../styles/theme';

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tabbar: {
    backgroundColor: colors.fullTransparent,
    elevation: 0
  },
  tab: {
    width: 'auto',
    padding: 0
  },
  label: {
    ...global.textStyles.text
  },
  contentContainer: {},
  indicatorContainerStyle: {},
  indicatorStyle: {
    height: 3,
    backgroundColor: colors.teal,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  }
});

const CustomTabBar = ({ ...props }) => {
  const renderLabel = useCallback(({ route, focused }) => {
    return <Option title={route.title} logo={route.logo} selected={focused} />;
  });

  return (
    <View style={styles.tabBarContainer}>
      <TabBar
        {...props}
        style={styles.tabbar}
        renderLabel={renderLabel}
        scrollEnabled
        tabStyle={styles.tab}
        labelStyle={styles.label}
        indicatorStyle={styles.indicatorStyle}
        indicatorContainerStyle={styles.indicatorContainerStyle}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const optionStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15
  },
  option: {
    ...global.textStyles.text,
    color: colors.black,
    fontWeight: 'bold'
  },
  optionActive: {
    ...global.textStyles.text,
    color: colors.teal,
    fontWeight: 'bold'
  },
  logo: {
    height: 15,
    width: 15,
    marginRight: 5
  }
});

const Option = ({ title = '', logo = '', selected = false }) => {
  return (
    <View style={optionStyles.container}>
      {logo.length > 0 && (
        <Image source={{ uri: logo }} style={optionStyles.logo} resizeMode="contain" />
      )}
      <Text style={selected ? optionStyles.optionActive : optionStyles.option}>{title}</Text>
    </View>
  );
};

export default CustomTabBar;
