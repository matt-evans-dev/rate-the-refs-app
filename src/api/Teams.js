import { API_URL } from './config';
import { get } from './helpers';

const getTeamsByLeagueId = async leagueId => {
  return get(`${API_URL}/leagues/${leagueId}/teams`);
};

const getTeamsByConferenceId = async conferenceId => {
  return get(`${API_URL}/conferences/${conferenceId}/teams`);
};

const getTeamsBySportId = async sportId => {
  return get(`${API_URL}/sports/${sportId}/teams`);
};

const getTeamById = async teamId => {
  return get(`${API_URL}/teams/${teamId}`);
};

export default {
  getTeamsByLeagueId,
  getTeamsByConferenceId,
  getTeamsBySportId,
  getTeamById
};
