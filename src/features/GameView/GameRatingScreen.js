/* eslint-disable no-nested-ternary */
import React, { useCallback, useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, Platform, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { connect } from 'react-redux';
import { global, colors } from '../../shared/styles/theme';
import {
  ImageButton,
  CustomScrollview,
  StarRating,
  Button,
  AddCommentInput,
  DoubleTap
} from '../../shared/components';
import HeartActive from '../../assets/heart-active.png';
import HeartInactive from '../../assets/heart-inactive.png';
import BigHeart from '../../assets/big-heart.png';
import ShareImage from '../../assets/share.png';
import RefereeShirt from '../../assets/referee-shirt.png';
import Questionnaire from './components/Questionnaire';
import User from '../../state/actions/User';
import { UserAPI, Comments } from '../../api';
import Ratings from '../../api/Ratings';
import AdBanner from '../Ads/AdBanner';
import { DataContext } from '../../context/DataContext';
import { Links } from '../../shared/functions';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  headerTitle: {
    marginTop: 20,
    ...global.textStyles.header
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderLeftColor: colors.teal,
    borderLeftWidth: 5,
    borderColor: colors.teal,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 14
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  teamLogo: {
    width: 35,
    height: 35,
    marginHorizontal: 3
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10
  },
  gameTitle: {
    ...global.textStyles.title
  },
  gameDescription: {
    ...global.textStyles.subText
  },
  leagueText: {
    color: colors.blue
  },
  actionBtnsContainer: {
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },
  actionBtn: {
    height: 20,
    width: 20,
    marginVertical: 3
  },
  rateTheRefContainer: {
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rateTheRefTitle: {
    ...global.textStyles.header,
    fontSize: 20,
    marginLeft: 10
  },
  sliderContainer: {
    marginVertical: 20
  },
  slider: {
    width: '100%',
    height: 32
  },
  sliderGradientLine: {
    height: 4,
    top: Platform.OS === 'ios' ? 17 : 18, // Half of slider height to place it in the middle, android slider is smaller
    marginHorizontal: Platform.OS === 'ios' ? 3 : 12
  },
  shareBtnContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 50,
    marginTop: 20
  },
  shareBtn: {
    minWidth: '100%'
  },
  addCommentContainer: {
    marginBottom: 20
  },
  favoriteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(29, 122, 193, 0.7)',
    zIndex: 99,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigHeart: {
    height: 50
  }
});

const GameRatingScreen = ({ user = {}, fetchLatestUser = () => {}, route, navigation }) => {
  const { game = {} } = route.params;

  const [showFavorite, setShowFavorite] = useState(false);
  const [userFavorite, setUserFavorite] = useState(
    (user.users_favorite_games && user.users_favorite_games.indexOf(game.id) > -1) || false
  );
  const [answers, setAnswers] = useState({});
  const [existingRating, setExistingRating] = useState(undefined);
  const dataContext = useContext(DataContext);

  useEffect(() => {
    if (user.users_ratings) {
      const existingRating = user.users_ratings.find(rating => rating.schedule_id === game.id);
      console.log('existingRating', existingRating);
      if (existingRating) {
        const existingAnswers = {
          question_1: existingRating.question_1,
          question_1_specification: existingRating.question_1_specification,
          question_2: existingRating.question_2,
          overall_comment: existingRating.overall_comment,
          overall_performance: existingRating.overall_performance
        };
        setAnswers(existingAnswers);
        setExistingRating(existingRating);
      }
    }
  }, [game, user, setAnswers]);

  const handleAnswerChanges = useCallback(
    (key, answer) => {
      setAnswers(prev => {
        return {
          ...prev,
          [key]: answer
        };
      });
    },
    [setAnswers]
  );

  const onChangeCommentCallback = useCallback(
    value => {
      handleAnswerChanges('overall_comment', value);
    },
    [handleAnswerChanges]
  );

  const onRatingChangeCallback = useCallback(
    value => {
      handleAnswerChanges('overall_performance', value);
    },
    [handleAnswerChanges]
  );

  const onPressShareRating = useCallback(async () => {
    const { question_1, question_1_specification, question_2 } = answers;

    // Check if specify required - to set or to clear if it was previously set and not required now.
    let specifyRequired = false;
    if (question_1) {
      const needsSpecify = question_1.find(option => option.includes('Specify'));
      if (needsSpecify) {
        specifyRequired = true;
      }
    }

    const data = {
      schedule_id: game.id,
      sport_id: game.sport_id,
      league_id: game.league_id,
      ...(game.home_team.conference_id ? { conference_id: game.home_team.conference_id } : {}),
      home_team_id: game.home_team.id,
      opponent_id: game.opponent_team.id,
      overall_performance: answers.overall_performance,
      question_1,
      question_1_specification: specifyRequired ? question_1_specification : '',
      question_2,
      overall_comment:
        answers.overall_comment && answers.overall_comment.length > 0
          ? answers.overall_comment
          : 'Left a rating!'
    };

    console.log('Share Rating Data', data);
    try {
      if (existingRating) {
        // Update
        await Ratings.updateRating(existingRating.id, data);
        // Leave Update Rating Comment as well
        const comment = {
          schedule_id: game.id,
          comment: `Updated rating to ${answers.overall_performance}!`
        };

        await Comments.createComment(comment);
      } else {
        // New Rating
        await Ratings.rateGame(data);
        // Leave Comment as well
        const comment = {
          schedule_id: game.id,
          comment: data.overall_comment
        };

        await Comments.createComment(comment);
      }
      dataContext.setForceRefresh(game.id);
      fetchLatestUser(user.id);
      navigation.goBack();
      // Success Message ?
    } catch (error) {
      Alert.alert(error.message);
    }
  }, [answers, game, existingRating, dataContext]);

  const onPressFavoriteCallback = useCallback(async () => {
    setUserFavorite(prev => !prev);
    if (!userFavorite) {
      setShowFavorite(true);
      await UserAPI.addGameToFavorites(game.id);
      setTimeout(() => {
        setShowFavorite(false);
      }, 300);
    } else {
      await UserAPI.removeGameFromFavorites(game.id);
    }
    fetchLatestUser();
  }, [game, userFavorite, setShowFavorite, setUserFavorite]);

  const handleSingleTap = useCallback(
    item => {
      onRatingChangeCallback(item);
    },
    [onRatingChangeCallback]
  );

  const handleDoubleTap = useCallback(
    item => {
      onRatingChangeCallback(item - 0.5);
    },
    [onRatingChangeCallback]
  );

  const { overall_performance, overall_comment, question_1, question_1_specification } = answers;

  let specifyRequired = false;
  if (question_1) {
    const needsSpecify = question_1.find(option => option.includes('Specify'));
    if (needsSpecify && (!question_1_specification || question_1_specification.length === 0)) {
      specifyRequired = true;
    }
  }
  return (
    <View style={styles.container}>
      <CustomScrollview contentStyle={styles.contentContainer}>
        <Text style={styles.headerTitle}>Game</Text>
        <Game
          game={game}
          favoriteGame={onPressFavoriteCallback}
          isFavorite={userFavorite}
          showFavorite={showFavorite}
          shareGame={Links.shareGame}
        />
        <View style={styles.rateTheRefContainer}>
          <Image source={RefereeShirt} resizeMode="contain" />
          <Text style={styles.rateTheRefTitle}>RATE THE REF</Text>
        </View>
        <StarRating
          handlePresses
          rating={overall_performance}
          onSingleTap={handleSingleTap}
          onDoubleTap={handleDoubleTap}
        />
        <GradientSlider
          min={1}
          max={5}
          value={overall_performance}
          onValueChange={onRatingChangeCallback}
        />
        <AddCommentInput
          placeholder="Add a comment.."
          value={overall_comment}
          callback={onChangeCommentCallback}
          containerStyle={styles.addCommentContainer}
          profilePicture={user.profile_picture ? { uri: user.profile_picture } : undefined}
        />
        <Questionnaire answers={answers} handleAnswerChanges={handleAnswerChanges} />
        <View style={styles.shareBtnContainer}>
          <Button
            secondary
            title={existingRating ? 'Update Rating' : 'Share Rating'}
            buttonStyle={styles.shareBtn}
            onPress={onPressShareRating}
            disabled={!overall_performance || specifyRequired}
          />
        </View>
        <AdBanner adType="static" />
      </CustomScrollview>
    </View>
  );
};

const Game = ({ favoriteGame, shareGame, game = {}, isFavorite = false, showFavorite = false }) => {
  const hours = moment().diff(moment(game.start_time), 'hours');
  // 1 hour before game starts - for pregame discussions
  // After 4 hours show regular date.
  const gameTime =
    hours > -1 && hours < 4
      ? 'Live'
      : hours >= 4
      ? `Final - ${moment(game.start_time).format('L')}`
      : moment(game.start_time).format('L hh:mm a');

  return (
    <DoubleTap onDoubleTap={favoriteGame} style={styles.gameRow}>
      {showFavorite && (
        <View style={styles.favoriteOverlay}>
          <Image source={BigHeart} style={styles.bigHeart} resizeMode="contain" />
        </View>
      )}
      <View style={styles.leftRow}>
        <View style={styles.logoRow}>
          <Image
            source={game.opponent_team.team_logo ? { uri: game.opponent_team.team_logo } : null}
            resizeMode="contain"
            style={styles.teamLogo}
          />
          <Image
            source={game.home_team.team_logo ? { uri: game.home_team.team_logo } : null}
            resizeMode="contain"
            style={styles.teamLogo}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.gameTitle}>
            {`${game.opponent_team.team_name} at ${game.home_team.team_name}`}
          </Text>
          <Text style={styles.gameDescription}>
            <Text style={styles.leagueText}>{`${game.league_abbreviation}: `}</Text>
            {gameTime}
          </Text>
        </View>
      </View>
      <View style={styles.actionBtnsContainer}>
        <ImageButton
          imageSource={isFavorite ? HeartActive : HeartInactive}
          onPress={favoriteGame}
          buttonStyle={styles.actionBtn}
        />
        <ImageButton
          imageSource={ShareImage}
          onPress={() => shareGame(game)}
          buttonStyle={styles.actionBtn}
        />
      </View>
    </DoubleTap>
  );
};

const GradientSlider = ({ min, max, onValueChange, value }) => {
  return (
    <View style={styles.sliderContainer}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#D1495B', '#ff8e6b', '#9FD356']}
        style={styles.sliderGradientLine}
      />
      <Slider
        style={styles.slider}
        step={0.5}
        minimumValue={min}
        maximumValue={max}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.fullTransparent}
        maximumTrackTintColor={colors.fullTransparent}
        thumbTintColor="#eee"
      />
    </View>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => {
  return {
    fetchLatestUser: () => dispatch(User.fetchLatestUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameRatingScreen);
