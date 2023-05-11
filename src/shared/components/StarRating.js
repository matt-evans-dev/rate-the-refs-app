/* eslint-disable react/jsx-no-bind */
import React, { useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import StarEmpty from '../../assets/star-empty.png';
import StarHalf from '../../assets/star-half.png';
import StarFull from '../../assets/star-filled.png';
import DoubleTap from './DoubleTap';

const styles = StyleSheet.create({
  container: {},
  starRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  starContainer: {
    minWidth: 56
  },
  starSmallContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    maxWidth: 16,
    maxHeight: 18
  },
  starSmall: {
    maxWidth: 16,
    maxHeight: 16
  },
  starMediumContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    maxWidth: 30,
    maxHeight: 30
  },
  starMedium: {
    maxWidth: 30,
    maxHeight: 30
  }
});

const StarRating = ({
  rating,
  size = 'lg',
  handlePresses = false,
  onSingleTap = () => {},
  onDoubleTap = () => {}
}) => {
  const onTapStarCallback = useCallback(
    item => {
      onSingleTap(item);
    },
    [onSingleTap]
  );

  const onDoubleTapStarCallback = useCallback(
    item => {
      onDoubleTap(item);
    },
    [onDoubleTap]
  );

  const renderStars = () => {
    let starContainerStyle = styles.starContainer;

    if (size === 'sm') {
      starContainerStyle = styles.starSmallContainer;
    }
    if (size === 'md') {
      starContainerStyle = styles.starMediumContainer;
    }

    return [1, 2, 3, 4, 5].map((item, index) => {
      if (handlePresses) {
        return (
          <DoubleTap
            onSingleTap={() => onTapStarCallback(item)}
            onDoubleTap={() => onDoubleTapStarCallback(item)}
            key={item}
            style={starContainerStyle}
          >
            {renderStar(index, rating)}
          </DoubleTap>
        );
      }
      return (
        <View key={item} style={starContainerStyle}>
          {renderStar(index, rating)}
        </View>
      );
    });
  };

  const renderStar = useCallback((index, rating) => {
    let starStyle = styles.star;
    if (size === 'sm') {
      starStyle = styles.starSmall;
    }
    if (size === 'md') {
      starStyle = styles.starMedium;
    }

    if (!rating) {
      return <Image source={StarEmpty} resizeMode="contain" style={starStyle} />;
    }
    if (index < rating && index + 1 > rating) {
      return <Image source={StarHalf} resizeMode="contain" style={starStyle} />;
    }
    if (index < rating) {
      return <Image source={StarFull} resizeMode="contain" style={starStyle} />;
    }

    return <Image source={StarEmpty} resizeMode="contain" style={starStyle} />;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.starRow}>{renderStars()}</View>
    </View>
  );
};

export default StarRating;
