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

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type RefObject
} from 'react';
import classNames from 'classnames';

import Chevron from 'src/shared/components/chevron/Chevron';

import styles from './SubmitSlider.module.css';

type Props = {
  isDisabled: boolean;
  className?: string;
  onSlideCompleted: () => void;
};

const SubmitSlider = (props: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isSnappingBack, setIsSnappingBack] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePress = () => {
    setIsDragging(true);
  };

  const handleRelease = () => {
    setIsDragging(false);
    setIsSnappingBack(true);
  };

  const handleSnapBack = () => {
    setIsSnappingBack(false);
  };

  useDraggableSlider({
    trackRef,
    sliderRef,
    isDisabled: props.isDisabled,
    onRelease: handleRelease,
    onSnappedBack: handleSnapBack,
    onSlideCompleted: props.onSlideCompleted
  });

  const containerClasses = classNames(styles.container, props.className);

  const sliderClasses = classNames(styles.slider, {
    [styles.sliderDisabled]: props.isDisabled,
    [styles.sliderDragged]: isDragging,
    [styles.sliderSnappingBack]: isSnappingBack
  });

  return (
    <div className={containerClasses}>
      <div className={styles.track} ref={trackRef}>
        <div
          ref={sliderRef}
          className={sliderClasses}
          onMouseDown={handlePress}
          onTouchStart={handlePress}
        >
          <Chevron direction="right" className={styles.chevron} />
        </div>
      </div>
    </div>
  );
};

type UseDraggableSliderParams = {
  trackRef: RefObject<HTMLElement | null>;
  sliderRef: RefObject<HTMLElement | null>;
  isDisabled: boolean;
  onRelease: () => void;
  onSnappedBack: () => void;
  onSlideCompleted: () => void;
};

const useDraggableSlider = (params: UseDraggableSliderParams) => {
  const initialPointerX = useRef<number | null>(null);
  const sliderRectsRef = useRef<{
    trackRect: DOMRect;
    sliderRect: DOMRect;
  } | null>(null);
  const pressRef = useRef(false);

  useEffect(() => {
    if (params.isDisabled) {
      return;
    }
    const slider = params.sliderRef.current;
    if (!slider) {
      return;
    }

    slider.addEventListener('mousedown', handlePress);
    slider.addEventListener('touchstart', handlePress);

    return () => {
      slider.removeEventListener('mousedown', handlePress);
      slider.removeEventListener('touchstart', handlePress);
    };
  }, [params.isDisabled]);

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

    setTimeout(() => {
      params.onSnappedBack();
    }, 80); // <-- 80ms; to align with transition time
  }, []);

  const handleDrag = useCallback((event: TouchEvent | MouseEvent) => {
    const distance = getDistance(event);
    updateTranslateX(distance);

    if (hasReachedTrackEnd(distance)) {
      setTimeout(() => {
        handleRelease();
        params.onSlideCompleted();
      }, 10);
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

    return Math.max(minValue, Math.min(currentValue, maxValue));
  };

  const hasReachedTrackEnd = (distance: number) => {
    if (!sliderRectsRef.current) {
      return;
    }
    const { trackRect, sliderRect } = sliderRectsRef.current;
    const { right: trackRight } = trackRect;
    const { right: initialSliderRight } = sliderRect;
    return initialSliderRight + distance >= trackRight;
  };

  const updateTranslateX = (distance: number) => {
    const sliderElement = params.sliderRef.current;
    if (!sliderElement) {
      // shouldn't happen
      return;
    }

    sliderElement.style.transform = `translateX(${distance}px)`;
  };

  const getCurrentPointerX = (event: TouchEvent | MouseEvent) => {
    if ('touches' in event) {
      return event.touches[0].clientX;
    } else {
      return event.clientX;
    }
  };
};

export default SubmitSlider;
