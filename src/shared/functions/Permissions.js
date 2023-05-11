import { check, request, RESULTS } from 'react-native-permissions';

const checkPermission = async permission => {
  try {
    const result = await check(permission);
    const hasPermission = handlePermissionResult(result);
    console.log('hasPermission', hasPermission);
    if (hasPermission === 'Request') {
      const requestedResult = await request(permission);
      const hasRequestedPermission = handlePermissionResult(requestedResult);
      return hasRequestedPermission;
    }
    return hasPermission;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const handlePermissionResult = result => {
  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.log('This feature is not available (on this device / in this context)');
      return false;
    case RESULTS.DENIED:
      console.log('The permission has not been requested / is denied but requestable');
      return 'Request';
    case RESULTS.GRANTED:
      console.log('The permission is granted');
      return true;
    case RESULTS.BLOCKED:
      console.log('The permission is denied and not requestable anymore');
      return false;
    default:
      break;
  }
  return false;
};

export default {
  checkPermission
};
