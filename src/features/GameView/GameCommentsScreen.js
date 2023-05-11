/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import {
  GameActionRow,
  DoubleTap,
  AddCommentInput,
  CommentBubble,
  StarRating,
  Touchable,
  Button
} from '../../shared/components';
import { colors, global } from '../../shared/styles/theme';
import BigHeart from '../../assets/big-heart.png';
import RefereeShirt from '../../assets/referee-shirt.png';
import User from '../../state/actions/User';
import { UserAPI, Comments, Schedule } from '../../api';
import AdBanner from '../Ads/AdBanner';
import { Links } from '../../shared/functions';

const { height: screenHeight } = Dimensions.get('screen');

const GameCommentsScreen = ({ user = {}, fetchLatestUser = () => {}, navigation, route }) => {
  const { game: routeGame = {}, notification } = route.params;
  const [game, setGame] = useState(routeGame);
  const [comments, setComments] = useState([]);

  const commentRef = useRef(null);
  const commentListRef = useRef(null);
  const [fetchingComments, setFetchingComments] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [activeReply, setActiveReply] = useState(null);

  const [showFavorite, setShowFavorite] = useState(false);
  const [userFavorite, setUserFavorite] = useState(
    (user.users_favorite_games && user.users_favorite_games.indexOf(game.id) > -1) || false
  );
  const [refreshing, setRefreshing] = useState(false);
  const [creatingComment, setCreatingComment] = useState(false);
  const [viewAll, setViewAll] = useState(!notification);
  const [focusedComments, setFocusedComments] = useState([]);

  const fetchGame = useCallback(async () => {
    try {
      const gameResponse = await Schedule.getGameById(game.id);
      setGame(gameResponse);
    } catch (error) {
      console.log(error);
    }
  }, [game.id]);

  const fetchLatestComments = useCallback(async () => {
    try {
      const comments = await Comments.fetchCommentsByGame(game.id);
      setComments(comments);
      if (comments.length > 0 && !viewAll && notification) {
        if (notification.parentCommentId) {
          const focusedParentComment = comments.find(
            item => item.id === notification.parentCommentId
          );
          setFocusedComments([focusedParentComment]);
        } else {
          setViewAll(true);
        }
      }
    } catch (error) {
      console.log(error);
      setComments([]);
    } finally {
      setFetchingComments(false);
    }
  }, [viewAll]);

  // Fetch Latest game & comments everytime screen focuses or is navigated to.
  useFocusEffect(
    useCallback(() => {
      fetchGame();
      setFetchingComments(true);
      fetchLatestComments();
    }, [fetchLatestComments, fetchGame, viewAll])
  );

  const onPressRatingCallback = useCallback(() => {
    navigation.navigate('GameRatings', { game });
  }, [navigation, game]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          link
          buttonStyle={styles.headerRightBtn}
          onPress={onPressRatingCallback}
          title="Rate"
        />
      )
    });
  }, [navigation, onPressRatingCallback]);

  // Only run on changes from User Redux - Check length with local copy to update.
  useEffect(() => {
    const { users_favorite_games } = user;
    if (users_favorite_games) {
      const indexOfFavoriteGame = users_favorite_games.indexOf(game.id);
      const isFavorite = indexOfFavoriteGame > -1;
      if (isFavorite !== userFavorite) {
        setUserFavorite(isFavorite);
      }
    }
    if (!users_favorite_games && userFavorite) {
      setUserFavorite(false);
    }
  }, [user, userFavorite]);

  const onRefresh = useCallback(() => {
    console.log('onRefresh');
    setRefreshing(true);
    fetchGame();
    setFetchingComments(true);
    fetchLatestComments();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refreshing, setRefreshing, fetchGame, fetchLatestComments]);

  const onChangeCommentCallback = useCallback(
    value => {
      setNewComment(value);
    },
    [setNewComment]
  );

  const onCommentSubmitCallback = useCallback(async () => {
    // if activeReply exists - this comment is a reply to another user, else the comment is for the game itself
    console.log('Submit', newComment);
    if (newComment.length > 0 && !creatingComment) {
      setCreatingComment(true);
      if (activeReply) {
        console.log('activeReply', activeReply);
        let parentComment = comments.find(comment => {
          if (comment.replies && comment.replies.length > 0) {
            const findReply = comment.replies.find(reply => reply.id === activeReply.id);
            if (findReply) {
              return comment;
            }
          }
          return undefined;
        });
        // Replying to the Parent Comment;
        if (!parentComment && !activeReply.reply_to) {
          parentComment = activeReply;
        }
        if (parentComment) {
          const comment = {
            schedule_id: game.id,
            comment: newComment.replace(`@${activeReply.user_display_name} `, ''), // remove user name from comment string.
            reply_to: parentComment.id,
            mentions: activeReply.user_id
          };
          try {
            await Comments.createComment(comment);
            await fetchLatestComments();
            setNewComment('');
            setActiveReply(null);
          } catch (error) {
            Alert.alert(error.message);
            setCreatingComment(false);
          }
        } else {
          Alert.alert('The comment you are replying to was not found.');
        }
        setCreatingComment(false);
      } else {
        const comment = {
          schedule_id: game.id,
          comment: newComment
        };
        try {
          // General comment, but not viewing all. Switch to view all mode here.
          if (!viewAll) {
            setViewAll(true);
          }
          await Comments.createComment(comment);
          await fetchLatestComments();
          setNewComment('');
          setCreatingComment(false);
          if (commentListRef && commentListRef.current) {
            commentListRef.current.scrollToOffset({ animated: true, offset: 0 });
          }
        } catch (error) {
          Alert.alert(error.message);
          setCreatingComment(false);
        }
      }
    }
  }, [
    newComment,
    activeReply,
    setComments,
    setActiveReply,
    setNewComment,
    commentListRef,
    game,
    comments,
    creatingComment,
    viewAll,
    fetchLatestComments
  ]);

  const onPressReplyCallback = useCallback(
    comment => {
      console.log('reply to: ', comment);
      setActiveReply(comment);
      setNewComment(`@${comment.user_display_name} `);
      console.log(commentRef.current);
      if (commentRef.current) {
        commentRef.current.focus();
      }
    },
    [setNewComment, setActiveReply]
  );

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

  const onPressLikeCallback = useCallback(
    async comment => {
      console.log('Like', comment);
      try {
        await Comments.likeComment(comment.id);
        fetchLatestComments();
      } catch (error) {
        Alert.alert(error.message);
      }
    },
    [fetchLatestComments, user]
  );

  const onPressUnlikeCallback = useCallback(
    async comment => {
      console.log('Unlike', comment);
      try {
        await Comments.unlikeComment(comment.id);
        fetchLatestComments();
      } catch (error) {
        Alert.alert(error.message);
      }
    },
    [fetchLatestComments, user]
  );

  const onPressViewAll = useCallback(() => {
    setViewAll(true);
    setFocusedComments([]);
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      let userLikedComment = false;
      if (item.likes && item.likes.includes(user.id)) {
        userLikedComment = true;
      }

      return (
        <View key={item.id}>
          {!viewAll && focusedComments.length > 0 && (
            <View style={styles.viewSingleHeader}>
              <Text style={styles.singleCommentText}>Single Comment Thread</Text>
              <Button
                onPress={onPressViewAll}
                textStyle={styles.viewAllText}
                link
                title="View All"
              />
            </View>
          )}
          {item.replies.length > 0 ? (
            <View>
              <CommentBubble
                comment={item}
                onPressReply={onPressReplyCallback}
                onPressLike={onPressLikeCallback}
                onPressUnlike={onPressUnlikeCallback}
                userLiked={userLikedComment}
              />
              {item.replies.map(reply => {
                let likedReply = false;
                if (reply.likes && reply.likes.includes(user.id)) {
                  likedReply = true;
                }
                return (
                  <CommentBubble
                    key={reply.id}
                    comment={reply}
                    onPressReply={onPressReplyCallback}
                    onPressLike={onPressLikeCallback}
                    onPressUnlike={onPressUnlikeCallback}
                    nested
                    userLiked={likedReply}
                  />
                );
              })}
            </View>
          ) : (
            <CommentBubble
              comment={item}
              onPressReply={onPressReplyCallback}
              onPressLike={onPressLikeCallback}
              onPressUnlike={onPressUnlikeCallback}
              userLiked={userLikedComment}
            />
          )}
          {!viewAll && focusedComments.length > 0 && (
            <Button
              buttonStyle={styles.viewAllCommentsBtn}
              onPress={onPressViewAll}
              secondary
              title="View All Comments"
            />
          )}
        </View>
      );
    },
    [
      user,
      viewAll,
      onPressReplyCallback,
      onPressLikeCallback,
      onPressUnlikeCallback,
      onPressViewAll,
      focusedComments
    ]
  );

  const renderEmptyComponent = useCallback(() => {
    if (fetchingComments) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      );
    }
    if (!fetchingComments && comments.length === 0) {
      return (
        <View>
          <Text style={styles.headerTitle}>No Comments Yet</Text>
        </View>
      );
    }

    if (!viewAll && !fetchingComments && comments.length > 0 && focusedComments.length === 0) {
      return (
        <View>
          <Text style={styles.headerTitle}>Comments not found</Text>
        </View>
      );
    }

    return <></>;
  }, [fetchingComments, comments, focusedComments, viewAll]);

  const keyExtractor = useCallback(item => {
    return item.id;
  }, []);

  const hours = moment().diff(moment(game.start_time), 'hours');
  // 1 hour before game starts - for pregame discussions
  // After 4 hours show regular date.
  const gameTime =
    hours > -1 && hours < 4
      ? 'Live'
      : hours >= 4
      ? `Final - ${moment(game.start_time).format('L')}`
      : moment(game.start_time).format('L hh:mm a');

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.teamsRow}>
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
    );
  }, [gameTime, game]);

  const renderScoreboardHeader = useCallback(() => {
    return (
      <View style={scoreStyles.scoreboardContainer}>
        <View style={scoreStyles.scoreRow}>
          <Text style={scoreStyles.score}>{game.opponent_team_score}</Text>
          <Text style={scoreStyles.dash}>-</Text>
          <Text style={scoreStyles.score}>{game.home_team_score}</Text>
        </View>
        <View style={scoreStyles.row}>
          <View style={scoreStyles.teamColumn}>
            <Text style={scoreStyles.teamName}>{`${game.opponent_team.team_name}`}</Text>
            <Image
              source={game.opponent_team.team_logo ? { uri: game.opponent_team.team_logo } : null}
              resizeMode="contain"
              style={scoreStyles.teamLogo}
            />
          </View>

          <View style={scoreStyles.teamColumn}>
            <Text style={scoreStyles.teamName}>{`${game.home_team.team_name}`}</Text>
            <Image
              source={game.home_team.team_logo ? { uri: game.home_team.team_logo } : null}
              resizeMode="contain"
              style={scoreStyles.teamLogo}
            />
          </View>
        </View>
        <Text style={styles.gameDescription}>
          <Text style={styles.leagueText}>{`${game.league_abbreviation}: `}</Text>
          {gameTime}
        </Text>
      </View>
    );
  }, [gameTime, game]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={commentListRef}
        contentContainerStyle={styles.commentScrollView}
        data={viewAll ? comments : focusedComments}
        renderItem={renderItem}
        maxToRenderPerBatch={6}
        keyExtractor={keyExtractor}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl
            tintColor={colors.lightBlue}
            colors={[colors.blue]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={renderEmptyComponent()}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <AdBanner adType="static" />
            <DoubleTap style={styles.gameContainer} onDoubleTap={onPressFavoriteCallback}>
              {showFavorite && (
                <View style={styles.favoriteOverlay}>
                  <Image source={BigHeart} style={styles.bigHeart} resizeMode="contain" />
                </View>
              )}
              <Touchable onPress={onPressRatingCallback} style={styles.ratingRow}>
                <Image source={RefereeShirt} style={styles.refShirt} />
                <StarRating rating={game.rating || 0} size="md" />
                <Text style={styles.ratingsText}>{`${game.rating || 0}`}</Text>
              </Touchable>
              {game.home_team_score && game.opponent_team_score
                ? renderScoreboardHeader()
                : renderHeader()}
            </DoubleTap>

            <GameActionRow
              game={game}
              userFavorite={userFavorite}
              onPressShare={Links.shareGame}
              onPressFavorite={onPressFavoriteCallback}
              showRatingRow={false}
            />
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' && 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? screenHeight / 10 : 0}
        style={styles.addCommentContainer}
      >
        <AddCommentInput
          forwardRef={commentRef}
          placeholder="Add a comment.."
          value={newComment}
          callback={onChangeCommentCallback}
          onSubmitCallback={onCommentSubmitCallback}
          containerStyle={styles.addCommentInputContainer}
          commentInputStyle={styles.addCommentInput}
          profilePicture={user.profile_picture ? { uri: user.profile_picture } : undefined}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const scoreStyles = StyleSheet.create({
  scoreboardContainer: { width: '100%', alignItems: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 5
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10
  },
  teamColumn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  score: {
    flex: 1,
    ...global.textStyles.title,
    fontSize: 34,
    textAlign: 'center'
  },
  dash: {
    ...global.textStyles.title,
    fontSize: 34
  },
  teamName: {
    textAlign: 'center',
    ...global.textStyles.text,
    maxWidth: '55%'
  },
  teamLogo: {
    width: 48,
    height: 48,
    marginVertical: 5
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  commentScrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
    justifyContent: 'flex-start'
  },
  gameContainer: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginVertical: 20,
    paddingVertical: 20,
    borderRadius: 10,
    borderLeftColor: colors.teal,
    borderLeftWidth: 10,
    borderColor: colors.teal,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 14
  },
  gameDescription: {
    ...global.textStyles.subText
  },
  leagueText: {
    color: colors.blue
  },
  ratingRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center'
  },
  refShirt: {
    marginRight: 10,
    height: 25,
    width: 27
  },
  ratingsText: {
    marginLeft: 10,
    ...global.textStyles.title,
    fontSize: 20,
    fontWeight: 'bold'
  },
  teamsRow: {
    maxWidth: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 0.5
  },
  teamLogo: {
    width: 35,
    height: 35,
    marginHorizontal: 3
  },
  titleContainer: {
    marginLeft: 10,
    flex: 1
  },
  gameTitle: {
    ...global.textStyles.title
  },
  favoriteOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(29, 122, 193, 0.7)',
    zIndex: 99,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigHeart: {
    height: 100
  },
  addCommentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white
  },
  addCommentInputContainer: {
    width: '100%',
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  addCommentInput: {
    paddingHorizontal: 10
  },
  headerTitle: {
    marginTop: 20,
    ...global.textStyles.header,
    paddingLeft: 20
  },
  loadingContainer: {
    marginTop: 50
  },
  headerRightBtn: {
    marginRight: 15
  },
  viewSingleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  singleCommentText: {
    ...global.textStyles.subText
  },
  viewAllText: {
    ...global.textStyles.subText,
    color: colors.blue
  },
  viewAllCommentsBtn: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 50,
    marginTop: 20
  }
});

const mapStateToProps = state => ({
  user: state.auth.user
});

const mapDispatchToProps = dispatch => {
  return {
    fetchLatestUser: () => dispatch(User.fetchLatestUser())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameCommentsScreen);
