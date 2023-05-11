import { API_URL } from './config';
import { post, put } from './helpers';

const rateGame = async data => {
  return post(`${API_URL}/ratings`, data);
};

const updateRating = async (ratingId, data) => {
  return put(`${API_URL}/ratings/${ratingId}`, data);
};

export default {
  rateGame,
  updateRating
};
