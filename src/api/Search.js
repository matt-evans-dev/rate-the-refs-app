import { API_URL } from './config';
import { get } from './helpers';

const searchEntity = async query => {
  return get(`${API_URL}/search?q=${query}`);
};

export default {
  searchEntity
};
