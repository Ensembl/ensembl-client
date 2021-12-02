/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import classNames from 'classnames';
import clamp from 'lodash/clamp';

import Chevron from 'src/shared/components/chevron/Chevron';

import styles from './SubmitSlider.scss';

type Props = {
  isDisabled: boolean;
  className?: string;
  onSlideCompleted: () => void;
};

const SubmitSlider = (props: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePress = () => {
    setIsDragging(true);
  };

  const handleRelease = () => {
    setIsDragging(false);
  };

  const springStyles = useDraggableSlider({
    trackRef,
    sliderRef,
    isDisabled: props.isDisabled,
    onRelease: handleRelease,
    onSlideCompleted: props.onSlideCompleted
  });

  const containerClasses = classNames(styles.container, props.className);

  const sliderClasses = classNames(styles.slider, {
    [styles.sliderDisabled]: props.isDisabled,
    [styles.sliderDragged]: isDragging
  });

  return (
    <div className={containerClasses}>
      <div className={styles.track} ref={trackRef}></div>
      <animated.div
        ref={sliderRef}
        className={sliderClasses}
        style={springStyles}
        onMouseDown={handlePress}
        onTouchStart={handlePress}
      >
        <Chevron direction="right" classNames={{ svg: styles.chevron }} />
      </animated.div>
    </div>
  );
};

type UseDraggableSliderParams = {
  trackRef: React.RefObject<HTMLDivElement>;
  sliderRef: React.RefObject<HTMLDivElement>;
  isDisabled: boolean;
  onRelease: () => void;
  onSlideCompleted: () => void;
};

const useDraggableSlider = (params: UseDraggableSliderParams) => {
  const initialPointerX = useRef<number | null>(null);
  const sliderRectsRef = useRef<{
    trackRect: DOMRect;
    sliderRect: DOMRect;
  } | null>(null);
  const pressRef = useRef(false);

  const [springStyles, api] = useSpring(() => ({
    config: { clamp: true },
    to: {
      transform: 'translateX(0)'
    }
  }));

  useEffect(() => {
    return () => {
      if (pressRef.current) {
        // shouldn't happen, but being cautious
        removeMovementListeners();
      }
    };
  }, []);

  useEffect(() => {
    if (params.isDisabled) {
      return;
    }

    params.sliderRef.current?.addEventListener('mousedown', handlePress);
    params.sliderRef.current?.addEventListener('touchstart', handlePress);

    return () => {
      params.sliderRef.current?.removeEventListener('mousedown', handlePress);
      params.sliderRef.current?.removeEventListener('touchstart', handlePress);
    };
  }, [params.isDisabled, params.sliderRef.current]);

  const addMovementListeners = useCallback(() => {
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('touchmove', handleDrag);
    window.addEventListener('mouseup', handleRelease);
    window.addEventListener('touchend', handleRelease);
  }, []);

  const removeMovementListeners = useCallback(() => {
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('touchmove', handleDrag);
    window.removeEventListener('mouseup', handleRelease);
    window.removeEventListener('touchend', handleRelease);
  }, []);

  const handlePress = useCallback((event: TouchEvent | MouseEvent) => {
    pressRef.current = true;
    recordInitialPointerX(event);
    recordSliderRects();
    setGrabbingCursor(true);
    addMovementListeners();
  }, []);

  const handleRelease = useCallback(() => {
    pressRef.current = false;
    updateTranslateX(0);
    setGrabbingCursor(false);
    removeMovementListeners();
    params.onRelease();
  }, []);

  const handleDrag = useCallback((event: TouchEvent | MouseEvent) => {
    const distance = getDistance(event);

    if (hasNotReachedTrackEnd(distance)) {
      updateTranslateX(distance);
    } else {
      handleRelease();
      params.onSlideCompleted();
    }
  }, []);

  const setGrabbingCursor = (isGrabbing: boolean) => {
    if (isGrabbing) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = '';
    }
  };

  const recordSliderRects = () => {
    const trackRect =
      params.trackRef.current?.getBoundingClientRect() as DOMRect;
    const sliderRect =
      params.sliderRef.current?.getBoundingClientRect() as DOMRect;
    sliderRectsRef.current = { trackRect, sliderRect };
  };

  const recordInitialPointerX = (event: TouchEvent | MouseEvent) => {
    initialPointerX.current = getCurrentPointerX(event);
  };

  const getDistance = (event: TouchEvent | MouseEvent) => {
    const currentPointerX = getCurrentPointerX(event);
    const trackRect = sliderRectsRef.current?.trackRect as DOMRect;
    const sliderRect = sliderRectsRef.current?.sliderRect as DOMRect;
    const minValue = 0;
    const maxValue = trackRect.width - sliderRect.width;
    const currentValue = currentPointerX - (initialPointerX.current as number);

    return clamp(minValue, currentValue, maxValue);
  };

  const hasNotReachedTrackEnd = (distance: number) => {
    if (!sliderRectsRef.current) {
      return;
    }
    const { trackRect, sliderRect } = sliderRectsRef.current;
    const { right: trackRight } = trackRect;
    const { right: initialSliderRight } = sliderRect;
    return initialSliderRight + distance < trackRight;
  };

  const updateTranslateX = (distance: number) => {
    api.start({
      to: { transform: `translateX(${distance}px)` },
      config: { mass: 1, tension: 380, friction: 1, velocity: 0.01 },
      immediate: pressRef.current
    });
  };

  const getCurrentPointerX = (
    event: TouchEvent | React.TouchEvent | MouseEvent | React.MouseEvent
  ) => {
    if ('touches' in event) {
      return event.touches[0].clientX;
    } else {
      return event.clientX;
    }
  };

  return springStyles;
};

export default SubmitSlider;
