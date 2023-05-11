import React, { useCallback, useEffect } from 'react';
import Touchable from './Touchable';

const DoubleTap = ({ children = [], onSingleTap = () => {}, onDoubleTap = () => {}, style }) => {
  let lastTap = Date.now();
  let firstTap = true;
  const delay = 300;
  let timer = false;

  const onTap = useCallback(() => {
    const now = Date.now();
    if (firstTap) {
      firstTap = false;

      timer = setTimeout(() => {
        onSingleTap();
        firstTap = true;
        timer = false;
      }, delay);

      lastTap = now;
    } else if (now - lastTap < delay) {
      if (timer) {
        clearTimeout(timer);
      }
      onDoubleTap();
      firstTap = true;
    }
  }, [onDoubleTap, onSingleTap]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <Touchable style={style} onPress={onTap}>
      {children}
    </Touchable>
  );
};

export default DoubleTap;
