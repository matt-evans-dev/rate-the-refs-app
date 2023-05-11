import moment from 'moment';
import { API_URL } from './config';
import { get, post } from './helpers';

const getUpcomingGames = async () => {
  return post(`${API_URL}/games/upcoming`, { date: moment().format('YYYY-MM-DD') });
};

const getTrendingGames = async () => {
  return post(`${API_URL}/games/trending`, { date: moment().format('YYYY-MM-DD') });
};

const getUpcomingGamesByLeagueId = async leagueId => {
  return post(`${API_URL}/games/leagues/${leagueId}/upcoming`, {
    date: moment().format('YYYY-MM-DD')
  });
};

const getTrendingGamesByLeagueId = async leagueId => {
  return post(`${API_URL}/games/leagues/${leagueId}/trending`, {
    date: moment().format('YYYY-MM-DD')
  });
};

const getUserFavoritesUpcomingGames = async () => {
  return post(`${API_URL}/users/favorite-teams/games`, {
    date: moment().format('YYYY-MM-DD')
  });
};

const getGameById = async gameId => {
  return get(`${API_URL}/games/${gameId}`);
};

const getUpcomingGamesBySportId = async sportId => {
  return post(`${API_URL}/games/sports/${sportId}/upcoming`, {
    date: moment().format('YYYY-MM-DD')
  });
};

const getTrendingGamesBySportId = async sportId => {
  return post(`${API_URL}/games/sports/${sportId}/trending`, {
    date: moment().format('YYYY-MM-DD')
  });
};

const getUserPastGames = async () => {
  return get(`${API_URL}/users/game-interactions`);
};

const getGamesNearby = async coordinates => {
  return get(
    `${API_URL}/games/locations/${moment().format('YYYY-MM-DD')}?lat=${coordinates.latitude}&lng=${
      coordinates.longitude
    }`
  );
};

const searchGames = async query => {
  return get(`${API_URL}/games/search?q=${query}`);
};

const fetchGames = async query => {
  return get(`${API_URL}/games?${query}`);
};

export default {
  getUpcomingGames,
  getTrendingGames,
  getUpcomingGamesByLeagueId,
  getTrendingGamesByLeagueId,
  getUpcomingGamesBySportId,
  getTrendingGamesBySportId,
  getUserFavoritesUpcomingGames,
  getGameById,
  getUserPastGames,
  getGamesNearby,
  searchGames,
  fetchGames
};
