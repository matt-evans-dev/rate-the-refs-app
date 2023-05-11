import { Alert, Linking, Share } from 'react-native';

const openUrl = async link => {
  try {
    await Linking.openURL(link);
  } catch (error) {
    console.log(error);
    Alert.alert(error.message);
  }
};
const shareGame = async game => {
  try {
    const result = await Share.share({
      title: 'Rate The Refs',
      message: `Rate the Refs for the ${game.opponent_team.team_name} at ${game.home_team.team_name} game! https://www.ratetherefs.com/`
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export default { openUrl, shareGame };
