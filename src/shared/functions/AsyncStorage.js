import AsyncStorage from '@react-native-community/async-storage';

const storeData = async (key, data) => {
  try {
    console.log(`storing ${key}: `, data);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    // Error saving data
    console.log(error);
    throw error;
  }
};

const retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      // console.log(value);
      return value;
    }
  } catch (error) {
    // Error retrieving data
    throw error;
  }
  return undefined;
};

const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // Error saving data
    console.log('Error removing async: ', error);
    throw error;
  }
};

export { storeData, retrieveData, removeData };
