import firebase from 'react-native-firebase';
import { GOOGLE_STORAGE_URL } from 'react-native-dotenv';
import { API_URL } from './config';
import { post, put, get, del } from './helpers';

const fetchUser = async () => {
  return get(`${API_URL}/users`);
};

const createUser = async loggedInUser => {
  return post(`${API_URL}/users`, loggedInUser);
};

const updateUser = async data => {
  return put(`${API_URL}/users/`, data);
};

const checkUsername = async username => {
  return get(`${API_URL}/users/${username}/check-unique`);
};

const addTeamToFavorites = async teamId => {
  return post(`${API_URL}/users/favorite-team`, { teamId });
};

const removeTeamFromFavorites = async teamId => {
  return del(`${API_URL}/users/unfavorite-team`, { teamId });
};

const addLeagueToFavorites = async leagueId => {
  return post(`${API_URL}/users/favorite-league`, { leagueId });
};

const removeLeagueFromFavorites = async leagueId => {
  return del(`${API_URL}/users/unfavorite-league`, { leagueId });
};

const addConferenceToFavorites = async conferenceId => {
  return post(`${API_URL}/users/favorite-conference`, { conferenceId });
};

const removeConferenceFromFavorites = async conferenceId => {
  return del(`${API_URL}/users/unfavorite-conference`, { conferenceId });
};

const addGameToFavorites = async gameId => {
  return post(`${API_URL}/users/favorite-games`, { gameId });
};

const removeGameFromFavorites = async gameId => {
  return del(`${API_URL}/users/unfavorite-game`, { gameId });
};

const getAdditional = async () => {
  return get(`${API_URL}/users/additional`);
};

/**
 *
 * @param {string} id User ID
 * @param {string} response Download URL
 */
const uploadPhoto = async (id, response) => {
  try {
    const imageRef = firebase
      .storage()
      .ref()
      .child(`/user/${id}/`);
    const name = `profile_picture-${new Date().getTime()}`;
    const metadata = { contentType: response.type };
    const uploadTask = await imageRef.child(name).put(response.uri, metadata);
    console.log(uploadTask);
    const downloadUrl = `https://storage.googleapis.com/${GOOGLE_STORAGE_URL}/user/${id}/${name}`;
    return downloadUrl;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default {
  fetchUser,
  createUser,
  updateUser,
  addTeamToFavorites,
  removeTeamFromFavorites,
  addLeagueToFavorites,
  removeLeagueFromFavorites,
  addConferenceToFavorites,
  removeConferenceFromFavorites,
  addGameToFavorites,
  removeGameFromFavorites,
  getAdditional,
  uploadPhoto,
  checkUsername
};
