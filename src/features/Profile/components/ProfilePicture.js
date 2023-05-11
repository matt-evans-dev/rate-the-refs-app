import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import EditPencil from '../../../assets/edit-pencil.png';
import DefaultPicture from '../../../assets/default-profile.png';
import Touchable from '../../../shared/components/Touchable';

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120
  },
  picture: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  editIconContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 99,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24
  },
  editIcon: {
    width: 14,
    height: 14
  }
});

const ProfilePicture = ({
  profilePicture = undefined,
  onPress = () => {},
  containerStyle = {}
}) => {
  let imageSource = { uri: `${profilePicture}` };
  if (profilePicture && profilePicture.includes('graph.facebook.com')) {
    imageSource = { uri: `${profilePicture}?type=large` };
  }

  return (
    <Touchable style={[styles.container, containerStyle]} onPress={onPress}>
      <View>
        <View style={styles.editIconContainer}>
          <Image source={EditPencil} resizeMode="cover" style={styles.editIcon} />
        </View>

        {profilePicture ? (
          <Image source={imageSource} resizeMode="cover" style={styles.picture} />
        ) : (
          <Image source={DefaultPicture} resizeMode="cover" style={styles.picture} />
        )}
      </View>
    </Touchable>
  );
};

export default ProfilePicture;
