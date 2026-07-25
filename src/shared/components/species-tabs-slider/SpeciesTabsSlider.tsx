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

import { memo, type ReactNode, useCallback } from 'react';
import classNames from 'classnames';

import useSpeciesTabsSlider from './useSpeciesTabsSlider';
import useSliderGestures from './useSliderGestures';
import useVisibleActiveSpecies from './useVisibleActiveSpecies';

import Chevron from 'src/shared/components/chevron/Chevron';

import styles from './SpeciesTabsSlider.module.css';

type Props = {
  children: ReactNode;
};

const SpeciesTabsSlider = (props: Props) => {
  const {
    refCallback: hookRefCallback1,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight
  } = useSpeciesTabsSlider();
  const { refCallback: hookRefCallback2 } = useSliderGestures();
  const { refCallback: hookRefCallback3 } = useVisibleActiveSpecies();

  const refCallback = useCallback(
    (element: HTMLDivElement) => {
      const cleanup1 = hookRefCallback1(element);
      const cleanup2 = hookRefCallback2(element);
      const cleanup3 = hookRefCallback3(element);
      return () => {
        cleanup1();
        cleanup2();
        cleanup3();
      };
    },
    [hookRefCallback1, hookRefCallback2, hookRefCallback3]
  );

  const areAllTabsInViewport = !canScrollLeft && !canScrollRight;

  const arrowButtonClasses = classNames(styles.arrowButton, {
    [styles.hidden]: areAllTabsInViewport
  });

  const leftArrowClasses = classNames(styles.arrow, {
    [styles.arrowDisabled]: !canScrollLeft
  });

  const rightArrowClasses = classNames(styles.arrow, {
    [styles.arrowDisabled]: !canScrollRight
  });

  return (
    <div className={styles.speciesTabsSlider}>
      <div className={styles.leftCorner}>
        <button
          className={arrowButtonClasses}
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <Chevron direction="left" className={leftArrowClasses} />
        </button>
      </div>

      <div ref={refCallback} className={styles.tabsContainer}>
        {props.children}
      </div>

      <div className={styles.rightCorner}>
        <button
          className={arrowButtonClasses}
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <Chevron direction="right" className={rightArrowClasses} />
        </button>
      </div>
    </div>
  );
};

export default memo(SpeciesTabsSlider);
