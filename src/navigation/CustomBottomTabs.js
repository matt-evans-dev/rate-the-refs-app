import React, { useCallback, PureComponent } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Image } from 'react-native';
import DefaultPicture from '../assets/default-profile.png';
import { colors } from '../shared/styles/theme';

const styles = StyleSheet.create({
  container: {
    zIndex: 99,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: 'rgba(68, 185, 237, 0.35)',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowRadius: 25,
    shadowOpacity: 1,
    elevation: 14
  },
  safeAreaView: {
    backgroundColor: colors.white,
    zIndex: 99,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  tabbar: {
    minHeight: 64,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 99,
    elevation: 14,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  tab: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  focusedDot: {
    position: 'absolute',
    bottom: 4,
    marginTop: 8,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.teal
  },
  picture: {
    width: 28,
    height: 28,
    borderRadius: 14
  }
});

const CustomBottomTabs = ({ state, descriptors, navigation, user = {} }) => {
  const { routes } = state;

  const defaultNavigateCallback = useCallback(
    (route, focused) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: undefined, // Undefined resets state.
        canPreventDefault: true
      });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route);
      } else {
        // isFocused and defaultPrevented - handle here if needed.
        // Otherwise default Tab press action navigates to route pressed
        // Default Tab Press resets stack if focused.
      }
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.tabbar}>
          {routes &&
            routes.map((route, index) => {
              const focused = index === state.index;
              const { tabBarIcon } = descriptors[route.key].options;
              return (
                <Tab
                  key={route.key}
                  index={index}
                  tabBarIcon={tabBarIcon}
                  focused={focused}
                  route={route}
                  defaultNavigate={defaultNavigateCallback}
                  profilePicture={user ? user.profile_picture : undefined}
                />
              );
            })}
        </View>
      </SafeAreaView>
    </View>
  );
};

class Tab extends PureComponent {
  onPressTab = () => {
    const { defaultNavigate, route, focused } = this.props;
    defaultNavigate(route.name, focused);
  };

  render() {
    const { route, ...rest } = this.props;
    return <TabIcon onPress={this.onPressTab} route={route} {...rest} />;
  }
}

class TabIcon extends PureComponent {
  render() {
    const { route, tabBarIcon, focused, onPress, profilePicture = undefined } = this.props;
    let imageSource = { uri: `${profilePicture}` };
    if (profilePicture && profilePicture.includes('graph.facebook.com')) {
      imageSource = { uri: `${profilePicture}?type=large` };
    }
    if (!profilePicture || profilePicture.length === 0) {
      imageSource = DefaultPicture;
    }
    return (
      <TouchableWithoutFeedback style={styles.tab} onPress={onPress}>
        <View style={styles.tab}>
          {route.name === 'Profile' ? (
            <Image source={imageSource} resizeMode="cover" style={styles.picture} />
          ) : (
            tabBarIcon(focused)
          )}
          {focused && <View style={styles.focusedDot} />}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default CustomBottomTabs;
