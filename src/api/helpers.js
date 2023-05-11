import firebase from 'react-native-firebase';

class RequestError {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

const getToken = async () => {
  if (firebase.auth().currentUser) {
    return firebase.auth().currentUser.getIdToken();
  }
  return '';
};
const post = async (url, data) => {
  const token = await getToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(data)
  });
  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  }
  throw new RequestError(response.status, responseJson.message);
};

const put = async (url, data) => {
  const token = await getToken();
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(data)
  });

  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  }
  throw new RequestError(response.status, responseJson.message);
};

const get = async url => {
  const token = await getToken();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  });

  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  }

  throw new RequestError(response.status, responseJson.message);
};

const del = async (url, data) => {
  const token = await getToken();
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(data)
  });

  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  }
  throw new RequestError(response.status, responseJson.message);
};

export { get, post, put, del, RequestError };
