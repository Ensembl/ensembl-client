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

import { useState, useRef, type PointerEventHandler } from 'react';
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

  const { onSliderPress } = useDraggableSlider({
    isDisabled: props.isDisabled,
    onPress: handlePress,
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
      <div className={styles.track}>
        <div
          ref={sliderRef}
          className={sliderClasses}
          onPointerDown={onSliderPress as unknown as PointerEventHandler}
        >
          <Chevron direction="right" className={styles.chevron} />
        </div>
      </div>
    </div>
  );
};

type UseDraggableSliderParams = {
  isDisabled: boolean;
  onPress: () => void;
  onRelease: () => void;
  onSnappedBack: () => void;
  onSlideCompleted: () => void;
};

const useDraggableSlider = (params: UseDraggableSliderParams) => {
  const { onSlideCompleted } = params;
  const initialPointerX = useRef<number | null>(null);
  const sliderRectsRef = useRef<{
    trackRect: DOMRect;
    sliderRect: DOMRect;
  } | null>(null);
  const pressRef = useRef(false);

  const recordSliderRects = (sliderElement: HTMLDivElement) => {
    const trackElement = sliderElement.parentElement as HTMLDivElement;
    const sliderRect = sliderElement.getBoundingClientRect();
    const trackRect = trackElement.getBoundingClientRect();
    sliderRectsRef.current = { trackRect, sliderRect };
  };

  const recordInitialPointerX = (event: PointerEvent) => {
    initialPointerX.current = event.clientX;
  };

  const getDistance = (event: PointerEvent) => {
    const currentPointerX = event.clientX;
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

  const updateTranslateX = ({
    slider,
    distance
  }: {
    slider: HTMLDivElement;
    distance: number;
  }) => {
    slider.style.setProperty('transform', `translateX(${distance}px)`);
  };

  const handleRelease = (event: PointerEvent) => {
    if (!pressRef.current) {
      // the cleanup has already happened
      return;
    }

    const sliderElement = event.target as HTMLDivElement;
    sliderElement.removeEventListener('pointermove', handleDrag);
    pressRef.current = false;
    updateTranslateX({ slider: sliderElement, distance: 0 });
    params.onRelease();

    sliderElement.addEventListener(
      'transitionend',
      () => {
        params.onSnappedBack();
      },
      { once: true }
    );
  };

  const handleDrag = (event: PointerEvent) => {
    const sliderElement = event.target as HTMLDivElement;
    const distance = getDistance(event);
    updateTranslateX({ slider: sliderElement, distance });

    if (hasReachedTrackEnd(distance)) {
      setTimeout(() => {
        handleRelease(event);
        onSlideCompleted();
      }, 10);
    }
  };

  const handlePress = (event: PointerEvent) => {
    const sliderElement = event.currentTarget as HTMLDivElement;
    pressRef.current = true;
    recordInitialPointerX(event);
    recordSliderRects(sliderElement);
    params.onPress();

    sliderElement.setPointerCapture(event.pointerId);
    sliderElement.addEventListener('pointermove', handleDrag);
    sliderElement.addEventListener('pointerup', handleRelease, { once: true });
  };

  return {
    onSliderPress: handlePress
  };
};

export default SubmitSlider;
