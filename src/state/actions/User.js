import firebase from 'react-native-firebase';
import { GoogleSignin } from '@react-native-community/google-signin';
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation
} from '@invertase/react-native-apple-authentication';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import store from '../Store';
import * as Actions from '../ActionTypes';
import { retrieveData, storeData, removeData } from '../../shared/functions/AsyncStorage';
import UserAPI from '../../api/User';

let fetchingUser = false; // auth state change runs multiple times causing get user to run multiple times.
let unsubscriber = null;

/**
 * Fetch User from API given Firebase User data, if exists navigate to Bottom nav otherwise Create User as new
 * @param {object} loggedInUser Firebase User Data
 */
const getUser = loggedInUser => {
  return async dispatch => {
    dispatch({ type: Actions.FETCHING_USER });
    if (!fetchingUser) {
      console.log('Fetching User', loggedInUser);
      fetchingUser = true;

      try {
        const response = await UserAPI.fetchUser();
        fetchingUser = false;
        dispatch({ type: Actions.FETCHING_USER_SUCCESS, payload: response });
      } catch (error) {
        console.log('Fetch User Error: ', error);
        if (error.status === 400) {
          fetchingUser = false;
          dispatch(createUser(loggedInUser));
          return;
        }
        fetchingUser = false;
        dispatch({ type: Actions.FETCHING_USER_FAIL, payload: error.message });
      }
    }
  };
};

/**
 * Create User object given Firebase User data
 * @param {Object} loggedInUser Firebase User Data
 */
const createUser = loggedInUser => {
  return async dispatch => {
    console.log('Creating User -> ', loggedInUser);
    try {
      const response = await UserAPI.createUser(loggedInUser);

      const userInfo = await retrieveData('createUserInfo');
      /**
       * userInfo contains the user's set username from Signup screen. User can continue to Main Screens
       * as username will be updated in background.
       */
      if (userInfo) {
        dispatch(updateUserNames(JSON.parse(userInfo)));
        return;
      }
      dispatch({ type: Actions.FETCHING_USER_SUCCESS, payload: response });
    } catch (error) {
      console.log(error);
      dispatch({ type: Actions.FETCHING_USER_FAIL, payload: error.message });
    }
  };
};

/**
 * Create user in Firebase from User entered data on signup screen
 * @param {object} data User entered data from Signup
 */
const createFirebaseUserWithEmail = async data => {
  const userInfo = {
    display_name: data.displayName
  };
  // Store user name for updating account in DB with username User has entered.
  storeData('createUserInfo', userInfo);
  try {
    const res = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Start Firebase Auth Listener, listens for auth changes, sign in/out
 */
const startAuthListener = () => {
  GoogleSignin.configure({
    webClientId: '787375891637-06ke1o8ad9kbqdbv1vskbmeq6ns8o0cv.apps.googleusercontent.com'
  });
  if (!unsubscriber) {
    console.log('Auth State Listening');
    unsubscriber = firebase.auth().onAuthStateChanged(
      user => {
        if (user) {
          const loggedInUser = {
            first_name: user.displayName ? user.displayName.split(' ')[0] : '',
            last_name: user.displayName ? user.displayName.split(' ')[1] : '',
            display_name: '',
            email: user.email,
            profile_picture: user.photoURL ? user.photoURL : null
          };

          console.log('Authenticated with user: ', loggedInUser);
          if (!fetchingUser) {
            console.log('Fetching User auth state listener');
            store.dispatch(getUser(loggedInUser));
          }
        } else {
          console.log('Not Authenticated');
          store.dispatch(resetState());
          store.dispatch(clearState());
        }
      },
      error => {
        console.log('Error Authenticating: ', error);
        store.dispatch(resetState());
        store.dispatch(clearState());
      }
    );
  }
};

/**
 * Stop Auth Listener
 */
const stopAuthListener = () => {
  if (unsubscriber) {
    console.log('Unsubscribing from Auth State');
    unsubscriber();
  }
};

/**
 * Login user into Firebase given Email and Password
 * @param {Object} data User entered Data {email, password}
 */
const loginWithEmail = async data => {
  try {
    const res = await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
    return res;
  } catch (error) {
    const { code, message } = error;
    console.log(code, message);
    throw error;
  }
};

/**
 * Update Firebase First and Last Name given the names user enters. Update User object
 * in DB after for data to remain consistent with Firebase.
 * @param {object} userInfo {display_name}
 */
const updateUserNames = userInfo => {
  return async dispatch => {
    // Clear data to not interfere with any further account creations.
    await removeData('createUserInfo').catch(error =>
      console.log('error removing data from asyncStorage', error)
    );
    const updateData = {
      display_name: userInfo.display_name
    };

    dispatch(updateUser(updateData));
  };
};

/**
 * Update User in DB
 * @param {object} data Update Data
 */
const updateUser = data => {
  return async dispatch => {
    dispatch({ type: Actions.UPDATING_USER });
    try {
      await UserAPI.updateUser(data);
      dispatch(fetchLatestUser());
    } catch (error) {
      console.log(error);
      dispatch({ type: Actions.UPDATE_USER_FAIL, payload: error });
    }
  };
};
/**
 * Fetch Latest User Info
 * @param {string} id User ID
 */
const fetchLatestUser = () => {
  console.log('Fetching Latest User');
  return async dispatch => {
    try {
      const response = await UserAPI.fetchUser();
      dispatch({ type: Actions.UPDATE_USER_SUCCESS, payload: response });
    } catch (error) {
      dispatch({ type: Actions.UPDATE_USER_FAIL, payload: error });
    }
  };
};

/**
 * Login With Facebook
 */
const loginWithFacebook = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        // handle this however suites the flow of your app
        reject(new Error('User cancelled request'));
        return;
      }
      console.log('FB result: ', result);
      // console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      console.log('FB DATA: ', data);
      if (!data) {
        // handle this however suites the flow of your app
        reject(new Error('Something went wrong obtaining the users access token'));
        return;
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

      // login with credential
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
      console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));

      resolve(firebaseUserCredential);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

const loginWithGoogle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      if (result) {
        console.log('google sign in success');
        console.log(result);
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken,
          result.accessToken
        );

        // Sign in with credential from the Google user.
        // login with credential
        const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
        console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));

        resolve(firebaseUserCredential);
      } else {
        throw new Error('Not Successful');
      }
    } catch (error) {
      console.log('Error occurred Logging in with Google!: ', error);
      reject(error);
    }
  });
};

const loginWithApple = async () => {
  // 1). start a apple sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: AppleAuthRequestOperation.LOGIN,
    requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME]
  });

  // 2). if the request was successful, extract the token and nonce
  const { identityToken, nonce } = appleAuthRequestResponse;
  // can be null in some scenarios
  if (identityToken) {
    // 3). create a Firebase `AppleAuthProvider` credential

    const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);

    // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
    //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
    //     to link the account to an existing user
    const userCredential = await firebase.auth().signInWithCredential(appleCredential);

    // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
    console.log(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
  } else {
    // handle this - retry?
    console.log('No identityToken Found');
  }
};

/**
 * Sends a password reset email to the email provided.
 * @param {string} email
 */
const resetPassword = email => {
  return firebase.auth().sendPasswordResetEmail(email);
};

/**
 * Reset State when logging out / not logged in
 */
const resetState = () => {
  return dispatch => {
    dispatch({ type: Actions.RESET_STATE });
  };
};

/**
 * Reset State when logging out / not logged in
 */
const clearState = () => {
  return dispatch => {
    dispatch({ type: Actions.CLEAR_STATE });
  };
};

const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      signOutFromGoogle();
    })
    .catch(error => {
      console.log(error);
    });
};
/**
 * Checks if user is signed in with Google, if so signs them out
 */
const signOutFromGoogle = async () => {
  try {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.signOut();
      console.log('Signed out from Google');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  startAuthListener,
  stopAuthListener,
  createFirebaseUserWithEmail,
  loginWithEmail,
  updateUser,
  fetchLatestUser,
  loginWithFacebook,
  loginWithGoogle,
  loginWithApple,
  signOutFromGoogle,
  signOut,
  resetPassword,
  resetState
};
