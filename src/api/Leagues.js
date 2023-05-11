import moment from 'moment';
import { API_URL } from './config';
import { get } from './helpers';

const getAllLeagues = async () => {
  return get(`${API_URL}/leagues`);
};

const getAllLeaguesWithGames = async () => {
  return get(`${API_URL}/leagues-with-games/${moment().format('YYYY-MM-DD')}`);
};

const getAllLeaguesBySportId = async sportId => {
  return get(`${API_URL}/sports/${sportId}/leagues`);
};

const getLeagueById = async leagueId => {
  return get(`${API_URL}/leagues/${leagueId}`);
};

export default {
  getAllLeagues,
  getAllLeaguesWithGames,
  getAllLeaguesBySportId,
  getLeagueById
};
