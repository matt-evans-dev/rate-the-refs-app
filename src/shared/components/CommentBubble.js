import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Autolink from 'react-native-autolink';
import moment from 'moment';
import ProfilePicture from '../../assets/default-profile.png';
import Whistle from '../../assets/whistle.png';
import { colors, global } from '../styles/theme';
import StarRating from './StarRating';
import { Links } from '../functions';
import UrlPreview from './UrlPreview';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'flex-start'
  },
  nestedComment: {
    marginLeft: 50
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  commentBubbleContainer: {
    flex: 1
  },
  commentTextContainer: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    padding: 12,
    borderRadius: 21,
    flexDirection: 'column'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  ratingText: {
    ...global.textStyles.text,
    fontWeight: 'bold',
    marginLeft: 8
  },
  profilePicture: {
    height: 41,
    width: 41,
    marginRight: 10,
    borderRadius: 20.5
  },
  bottomRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 10
  },
  bottomText: {
    ...global.textStyles.text,
    color: colors.lightGrey,
    fontWeight: 'bold',
    marginHorizontal: 2
  },
  timeAgo: {
    ...global.textStyles.text,
    color: colors.lightGrey,

    marginHorizontal: 2
  },
  commentText: {
    ...global.textStyles.text
  },
  commentUser: {
    ...global.textStyles.text,
    fontWeight: 'bold'
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    right: -10,
    height: 24,
    paddingHorizontal: 5,
    backgroundColor: colors.lightBlue,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 12,
    zIndex: 99
  },
  whistle: {
    height: 16
  },
  likeCount: {
    ...global.textStyles.subText,
    color: colors.white,
    fontSize: 12
  },
  urlPreview: {
    marginTop: 10
  }
});

const onPressComment = comment => {
  Links.openUrl(comment);
};

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;

const CommentBubble = ({
  comment = { comment: '' },
  onPressReply = () => {},
  onPressLike = () => {},
  onPressUnlike = () => {},
  containerStyle = {},
  nested = false,
  userLiked = true
}) => {
  const onPressReplyCallback = useCallback(() => {
    onPressReply(comment);
  }, [onPressReply, comment]);

  const onPressLikeCallback = useCallback(() => {
    if (userLiked) {
      onPressUnlike(comment);
    } else {
      onPressLike(comment);
    }
  }, [onPressLike, comment]);

  const hasLink = comment.comment.match(URL_REGEX);

  return (
    <View style={[styles.container, containerStyle, nested ? styles.nestedComment : {}]}>
      <View style={styles.contentContainer}>
        <Image
          source={
            comment.user_profile_picture ? { uri: comment.user_profile_picture } : ProfilePicture
          }
          resizeMode="cover"
          style={styles.profilePicture}
        />
        <View style={styles.commentBubbleContainer}>
          {comment.likes && comment.likes.length > 0 && (
            <View style={styles.likeContainer}>
              <Image source={Whistle} style={styles.whistle} resizeMode="contain" />
              <Text style={styles.likeCount}>{comment.likes.length}</Text>
            </View>
          )}
          <View style={styles.commentTextContainer}>
            {!nested && comment.user_rating ? (
              <View style={styles.ratingRow}>
                <StarRating size="sm" rating={comment.user_rating} />
                <Text style={styles.ratingText}>{comment.user_rating}</Text>
              </View>
            ) : (
              <></>
            )}
            <Text style={styles.commentText}>
              <Text style={styles.commentUser}>{`${comment.user_display_name}`}</Text>
              <Autolink
                text={` ${comment.mentions ? `@${comment.mentions} ` : ''}${comment.comment}`}
                onPress={onPressComment}
              />
            </Text>
            {hasLink && <UrlPreview containerStyle={styles.urlPreview} text={comment.comment} />}
          </View>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.timeAgo}>{moment(comment.created_at).fromNow()}</Text>
        <Text onPress={onPressLikeCallback} style={styles.bottomText}>
          {userLiked ? 'Unlike' : 'Like'}
        </Text>
        <Text style={styles.bottomText}> • </Text>
        <Text onPress={onPressReplyCallback} style={styles.bottomText}>
          Reply
        </Text>
      </View>
    </View>
  );
};

export default CommentBubble;
