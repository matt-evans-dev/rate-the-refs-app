import { API_URL } from './config';
import { post, get } from './helpers';

const createComment = async data => {
  return post(`${API_URL}/comments`, data);
};

const fetchCommentsByGame = async scheduleId => {
  return get(`${API_URL}/comments/${scheduleId}`);
};

const likeComment = async (commentId, data) => {
  return post(`${API_URL}/comments/${commentId}/like`, data);
};

const unlikeComment = async (commentId, data) => {
  return post(`${API_URL}/comments/${commentId}/unlike`, data);
};

export default {
  createComment,
  fetchCommentsByGame,
  likeComment,
  unlikeComment
};
