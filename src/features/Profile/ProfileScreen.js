/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  CustomScrollview,
  Input,
  Button,
  Touchable,
  BottomActionSheet,
  ListItem
} from '../../shared/components';
import ProfilePicture from './components/ProfilePicture';
import { global, colors } from '../../shared/styles/theme';
import SearchIcon from '../../assets/search-icon.png';
import User from '../../state/actions/User';
import UserAPI from '../../api/User';
import { FormatData, Permissions } from '../../shared/functions';
import { DataContext } from '../../context/DataContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30
  },
  headerContainer: {
    alignItems: 'center'
  },
  contentContainer: {
    paddingHorizontal: 20
  },
  headerTitle: {
    marginTop: 35,
    ...global.textStyles.header
  },
  inputContainer: {
    marginTop: 15
  },
  signOutBtnContainer: {
    flex: 1,
    marginTop: 35,
    alignItems: 'center',
    paddingHorizontal: 30
  },
  signOutBtn: {
    minWidth: '100%',
    borderColor: colors.black
  },
  signOutBtnText: {
    color: colors.black
  },
  noFavoritesText: {
    marginTop: 20,
    ...global.textStyles.subText
  },
  addFavoritesBtnContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20
  },
  addFavoritesBtn: {
    minWidth: '100%'
  },
  searchIcon: {
    height: 18,
    width: 18,
    marginRight: 8
  },
  modalBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 57,
    alignSelf: 'stretch',
    borderRadius: 0,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 0,
    shadowOpacity: 0,
    elevation: 0
  },
  firstBtn: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  lastBtn: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  oneBtn: {
    borderRadius: 10
  },
  btnText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.blue
  }
});

const ProfileScreen = ({
  navigation = {},
  user = {},
  fetchLatestUser = () => {},
  resetState = () => {},
  updateUser = () => {}
}) => {
  const [localUser, setLocalUser] = useState(user);
  const [showChangeProfilePictureMenu, setShowChangeProfilePictureMenu] = useState(false);
  const [updatingPicture, setUpdatingPicture] = useState(false);
  const [favorites, setFavorites] = useState({ leagues: [], teams: [], conferences: [] });
  const dataContext = useContext(DataContext);

  const fetchAdditional = useCallback(async () => {
    try {
      console.log('fetch Additional');
      const response = await UserAPI.getAdditional();
      setFavorites(FormatData.formatAdditionalForItems(response));
    } catch (error) {
      console.log(error);
    }
  }, [setFavorites]);

  useEffect(() => {
    if (user.profile_picture && user.profile_picture !== localUser.profile_picture) {
      setLocalUser(user);
    }
  }, [user.profile_picture, localUser]);

  useEffect(() => {
    const { users_favorite_teams, users_favorite_leagues, users_favorite_conferences } = user;
    let hasDifferences = false;
    // users_favorite_teams and users_favorite_leagues are null if user doesn't have any
    if (
      (!users_favorite_teams && favorites.teams.length > 0) ||
      (!users_favorite_leagues && favorites.leagues.length > 0) ||
      (!users_favorite_conferences && favorites.conferences.length > 0) ||
      (users_favorite_teams && favorites.teams.length !== users_favorite_teams.length) ||
      (users_favorite_leagues && favorites.leagues.length !== users_favorite_leagues.length) ||
      (users_favorite_conferences &&
        favorites.conferences.length !== users_favorite_conferences.length)
    ) {
      hasDifferences = true;
    }
    // Possibly Check here if actual IDs are different here - although this effect runs when in AddFavoritesScreen regardless.
    console.log('hasDifferences', hasDifferences);
    if (hasDifferences) {
      fetchAdditional();
    }
  }, [
    user.id,
    user.users_favorite_teams,
    user.users_favorite_leagues,
    user.users_favorite_conferences,
    favorites.leagues,
    favorites.teams,
    fetchAdditional
  ]);

  const onPressSignOut = useCallback(() => {
    try {
      User.signOut();
    } catch (error) {
      if (error.message.includes('no-current-user')) {
        User.resetState();
      }
    }
  }, [navigation]);

  const onPressAddFavorites = useCallback(() => {
    navigation.push('AddFavorites', { type: 'league' });
  }, [navigation]);

  const toggleChangeProfilePicMenu = useCallback(() => {
    // Show Bottom Menu for updating Picture
    setShowChangeProfilePictureMenu(prev => !prev);
    setUpdatingPicture(false);
  }, [setShowChangeProfilePictureMenu, setUpdatingPicture]);

  const getTotalFavorites = useCallback(() => {
    let total = 0;
    total += favorites.leagues.length;
    total += favorites.teams.length;
    total += favorites.conferences.length;
    return total;
  }, [favorites]);

  const onPressFavorite = useCallback(
    async item => {
      console.log('onPress Fav - Remove', item);
      // Only Handling Remove from Favorites as item leaves list upon removal.
      try {
        if (item.type === 'team') {
          await UserAPI.removeTeamFromFavorites(item.id);
        }
        if (item.type === 'league') {
          await UserAPI.removeLeagueFromFavorites(item.id);
        }

        if (item.type === 'conference') {
          await UserAPI.removeConferenceFromFavorites(item.id);
        }

        fetchLatestUser();
        dataContext.setForceRefresh('favorites');
      } catch (error) {
        console.log(error);
      }
    },
    [fetchLatestUser, dataContext]
  );

  const handlePictureResponse = async response => {
    const { id } = user;
    console.log(response);
    if (response.didCancel) {
      setUpdatingPicture(false);
      return;
    }
    if (response.error) {
      console.log(response.error);
      setUpdatingPicture(false);
      return;
    }

    try {
      setUpdatingPicture(true);
      const downloadUrl = await UserAPI.uploadPhoto(id, response);
      if (downloadUrl) {
        const data = {
          profile_picture: downloadUrl
        };

        updateUser(data);
        toggleChangeProfilePicMenu();
      }
      setUpdatingPicture(false);
    } catch (error) {
      console.log(error);
      setUpdatingPicture(false);
    }
  };

  const onPressChooseFromGallery = useCallback(async () => {
    setUpdatingPicture(true);
    const hasPermission = await Permissions.checkPermission(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    ).catch(error => console.log('Permission Error', error));
    if (hasPermission && hasPermission !== 'Request') {
      ImagePicker.launchImageLibrary({}, response => {
        handlePictureResponse(response);
      });
    } else {
      setUpdatingPicture(false);
      Alert.alert(
        'Permission Required',
        'Please enable permission to access your photo gallery in your settings to continue.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      );
    }
  }, [handlePictureResponse, setUpdatingPicture]);

  const onPressTakePicture = useCallback(async () => {
    setUpdatingPicture(true);

    const hasPermission = await Permissions.checkPermission(
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
    ).catch(error => console.log('Permission Error', error));
    if (hasPermission && hasPermission !== 'Request') {
      ImagePicker.launchCamera({}, response => {
        handlePictureResponse(response);
      });
    } else {
      setUpdatingPicture(false);
      Alert.alert(
        'Permission Required',
        'Please enable permission to access your camera in your settings to continue.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      );
    }
  }, [handlePictureResponse, setUpdatingPicture]);

  return (
    <CustomScrollview>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <ProfilePicture
            onPress={toggleChangeProfilePicMenu}
            profilePicture={localUser.profile_picture}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.headerTitle}>MY INFORMATION</Text>
          <Input
            label="Username"
            value={localUser.display_name}
            editable={false}
            name="display_name"
            placeholder="Username"
            containerStyle={styles.inputContainer}
          />
          <Input
            label="Email"
            value={localUser.email}
            editable={false}
            name="email"
            placeholder="Email"
            containerStyle={styles.inputContainer}
          />

          <View style={styles.signOutBtnContainer}>
            <Button
              title="Sign Out"
              secondary
              textStyle={styles.signOutBtnText}
              buttonStyle={styles.signOutBtn}
              onPress={onPressSignOut}
            />
          </View>

          <Text style={styles.headerTitle}>{`MY FAVORITES (${getTotalFavorites()})`}</Text>
          {getTotalFavorites() === 0 && (
            <Text style={styles.noFavoritesText}>
              You have no favorite teams, leagues or conference’s. Search and find your favorites
              now.
            </Text>
          )}
          <View style={styles.addFavoritesBtnContainer}>
            <Button
              title="Add Favorites"
              icon={<Image source={SearchIcon} resizeMode="contain" style={styles.searchIcon} />}
              primary
              buttonStyle={styles.addFavoritesBtn}
              onPress={onPressAddFavorites}
            />
          </View>
          <View style={styles.favoritesContainer}>
            {favorites.leagues.length > 0 && (
              <>
                <Text style={styles.headerTitle}>LEAGUES</Text>
                {favorites.leagues.map(item => {
                  return (
                    <ListItem
                      key={item.id}
                      onPressFavorite={onPressFavorite}
                      item={item}
                      isFavorite
                      showFavorite={false}
                    />
                  );
                })}
              </>
            )}
            {favorites.conferences.length > 0 && (
              <>
                <Text style={styles.headerTitle}>CONFERENCES</Text>
                {favorites.conferences.map(item => {
                  return (
                    <ListItem
                      key={item.id}
                      onPressFavorite={onPressFavorite}
                      item={item}
                      isFavorite
                      showFavorite={false}
                    />
                  );
                })}
              </>
            )}
            {favorites.teams.length > 0 && (
              <>
                <Text style={styles.headerTitle}>TEAMS</Text>
                {favorites.teams.map(item => {
                  return (
                    <ListItem
                      key={item.id}
                      onPressFavorite={onPressFavorite}
                      item={item}
                      isFavorite
                      showFavorite={false}
                    />
                  );
                })}
              </>
            )}
          </View>
        </View>
      </View>
      {showChangeProfilePictureMenu && (
        <BottomActionSheet
          modalVisible={showChangeProfilePictureMenu}
          toggleModal={toggleChangeProfilePicMenu}
        >
          {updatingPicture ? (
            <View style={[styles.modalBtn, styles.oneBtn]}>
              <ActivityIndicator size="large" color={colors.black} />
            </View>
          ) : (
            <>
              <Touchable style={[styles.modalBtn, styles.firstBtn]} onPress={onPressTakePicture}>
                <Text style={styles.btnText}>Take Picture</Text>
              </Touchable>
              <Touchable
                style={[styles.modalBtn, styles.lastBtn]}
                onPress={onPressChooseFromGallery}
              >
                <Text style={styles.btnText}>Choose From Gallery</Text>
              </Touchable>
            </>
          )}
        </BottomActionSheet>
      )}
    </CustomScrollview>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => {
  return {
    fetchLatestUser: () => dispatch(User.fetchLatestUser()),
    resetState: () => dispatch(User.resetState()),
    updateUser: data => dispatch(User.updateUser(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
