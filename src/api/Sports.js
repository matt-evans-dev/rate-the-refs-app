import moment from 'moment';
import { API_URL } from './config';
import { get } from './helpers';

const getAllSports = async () => {
  return get(`${API_URL}/sports`);
};

const getAllSportsWithGames = async () => {
  return get(`${API_URL}/sports-with-games/${moment().format('YYYY-MM-DD')}`);
};

export default {
  getAllSports,
  getAllSportsWithGames
};
