import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS } from 'react-native-permissions';
import { Alert, Platform } from 'react-native';
import Permissions from './Permissions';

let alertShowing = false;
const getUserLocation = async () => {
  try {
    const hasPermission = await Permissions.checkPermission(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
    );

    if (hasPermission && hasPermission !== 'Request') {
      console.log('Has Location Permission');
      const position = await getCurrentPosition();
      return position;
    }
    if (!alertShowing) {
      alertShowing = true;
      Alert.alert(
        'Permission Required',
        'Permission to access location is required to get games near you.',
        [
          {
            text: 'OK',
            onPress: () => {
              alertShowing = false;
            }
          }
        ],
        { cancelable: true }
      );
    }
    throw Error('Location Permission Required');
  } catch (error) {
    throw error;
  }
};

const getCurrentPosition = () => {
  // watchPosition() for realtime location updates
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('user location: ', position);
        resolve(position);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        reject(error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000, showLocationDialog: true }
    );
  });
};

export default { getUserLocation };
