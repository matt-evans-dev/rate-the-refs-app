import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getLinkPreview } from 'link-preview-js';
import { Image, Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Links } from '../functions';

// eslint-disable-next-line no-useless-escape
const REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;

const UrlPreview = ({
  onLoad = () => {},
  onError = () => {},
  text = null,
  containerStyle = defaultStyles.containerStyle,
  imageStyle = defaultStyles.imageStyle,
  faviconStyle = defaultStyles.faviconStyle,
  textContainerStyle = defaultStyles.textContainerStyle,
  title = true,
  titleStyle = defaultStyles.titleStyle,
  titleNumberOfLines = 2,
  descriptionStyle = defaultStyles.descriptionStyle,
  descriptionNumberOfLines = Platform.isPad ? 4 : 3,
  imageProps = { resizeMode: 'contain' }
}) => {
  const [state, setState] = useState({
    isUri: false,
    linkTitle: undefined,
    linkDesc: undefined,
    linkImg: undefined,
    linkFavicon: undefined,
    checked: false
  });
  const mounted = useRef(true);

  const { checked, isUri, linkImg, linkFavicon, linkTitle, linkDesc } = state;

  const getPreview = useCallback(
    text => {
      getLinkPreview(text)
        .then(data => {
          if (mounted.current) {
            onLoad(data);
            setState({
              isUri: true,
              linkTitle: data.title ? data.title : undefined,
              linkDesc: data.description ? data.description : undefined,
              linkImg:
                data.images && data.images.length > 0
                  ? data.images.find(element => {
                      return (
                        element.includes('.png') ||
                        element.includes('.jpg') ||
                        element.includes('.jpeg')
                      );
                    })
                  : undefined,
              linkFavicon:
                data.favicons && data.favicons.length > 0
                  ? data.favicons[data.favicons.length - 1]
                  : undefined,
              checked: true
            });
          }
        })
        .catch(error => {
          if (mounted.current) {
            onError(error);
            setState(prev => ({ ...prev, isUri: false, checked: true }));
            console.log('LinkPreview error : ', error);
          }
        });
    },
    [onError, onLoad]
  );

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // if checked already no need to getPreview again
    if (text !== null && !checked) {
      // get Preview if text contains a URL
      if (mounted.current) {
        if (text.match(REGEX)) {
          getPreview(text);
        } else {
          // Not a URL - do nothing
          setState(prev => ({ ...prev, isUri: false, checked: true }));
        }
      }
    }
  }, [text, checked, getPreview]);

  const _onLinkPressed = useCallback(() => {
    Links.openUrl(text.match(REGEX)[0]);
  }, [text]);

  const renderImage = (imageLink, faviconLink, imageStyle, faviconStyle, imageProps) => {
    // eslint-disable-next-line no-nested-ternary
    return imageLink ? (
      <Image style={imageStyle} source={{ uri: imageLink }} {...imageProps} />
    ) : faviconLink ? (
      <Image style={faviconStyle} source={{ uri: faviconLink }} {...imageProps} />
    ) : null;
  };

  const renderText = (
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines
  ) => {
    return (
      <View style={textContainerStyle}>
        {showTitle && (
          <Text numberOfLines={titleNumberOfLines} style={titleStyle}>
            {title}
          </Text>
        )}
        {description && (
          <Text numberOfLines={descriptionNumberOfLines} style={descriptionStyle}>
            {description}
          </Text>
        )}
      </View>
    );
  };

  const renderLinkPreview = (
    text,
    containerStyle,
    imageLink,
    faviconLink,
    imageStyle,
    faviconStyle,
    showTitle,
    title,
    description,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines,
    imageProps
  ) => {
    return (
      <TouchableOpacity
        style={[styles.containerStyle, containerStyle]}
        activeOpacity={0.9}
        onPress={_onLinkPressed}
      >
        {renderImage(imageLink, faviconLink, imageStyle, faviconStyle, imageProps)}
        {renderText(
          showTitle,
          title,
          description,
          textContainerStyle,
          titleStyle,
          descriptionStyle,
          titleNumberOfLines,
          descriptionNumberOfLines
        )}
      </TouchableOpacity>
    );
  };

  if (!isUri) return null;

  return renderLinkPreview(
    text,
    containerStyle,
    linkImg,
    linkFavicon,
    imageStyle,
    faviconStyle,
    title,
    linkTitle,
    linkDesc,
    textContainerStyle,
    titleStyle,
    descriptionStyle,
    titleNumberOfLines,
    descriptionNumberOfLines,
    imageProps
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row'
  }
});

const defaultStyles = StyleSheet.create({
  containerStyle: { backgroundColor: 'rgba(239, 239, 244,0.62)', alignItems: 'center' },
  imageStyle: {
    width: Platform.isPad ? 160 : 110,
    height: Platform.isPad ? 160 : 110,
    paddingRight: 10,
    paddingLeft: 10
  },
  faviconStyle: { width: 40, height: 40, paddingRight: 10, paddingLeft: 10 },
  textContainerStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10
  },
  titleStyle: {
    fontSize: 17,
    color: '#000',
    marginRight: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
    fontFamily: 'Helvetica'
  },
  descriptionStyle: {
    fontSize: 14,
    color: '#81848A',
    marginRight: 10,
    alignSelf: 'flex-start',
    fontFamily: 'Helvetica'
  }
});

export default UrlPreview;
