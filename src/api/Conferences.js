import { API_URL } from './config';
import { get } from './helpers';

const getConferencesByLeagueById = async leagueId => {
  return get(`${API_URL}/conferences?league=${leagueId}`);
};

export default {
  getConferencesByLeagueById
};
