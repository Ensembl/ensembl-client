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

import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  type ReactNode
} from 'react';
import classNames from 'classnames';

import useSliderGestures from './useSliderGestures';

import Chevron from 'src/shared/components/chevron/Chevron';
import PillButton from 'src/shared/components/pill-button/PillButton';

import styles from './SpeciesTabsSlider.scss';

type Props = {
  children: ReactNode;
};

/**
 * BIG QUESTION: do we need to support imperative scrolling?
 *
 * Imagine: two different pages (e.g. genome browser and entity viewer),
 * with more lozenges that can fit the screen.
 *
 * The user scrolls the list of lozenges on one page, and maybe even selects
 * a species all the way to the right. Then he switches to a different page.
 * Then he comes back.
 *
 * It's probably reasonable to expect that the tabs will scroll to the same place
 * where he left them.
 *
 * If we have to support this, we will need to store in redux either the scroll position itself, for each app;
 * or the first (or last) visible species lozenge.
 */

const initialScrollState = {
  canScrollLeft: false,
  canScrollRight: false
};

const scrollStateReducer = (
  state: typeof initialScrollState,
  action: Partial<typeof initialScrollState>
) => {
  return {
    ...state,
    ...action
  };
};

const SpeciesTabsSlider = (props: Props) => {
  const [hiddenTabsCount, setHiddenTabsCount] = useState(0);
  const [scrollState, scrollStateDispatch] = useReducer(
    scrollStateReducer,
    initialScrollState
  );

  const tabsCountRef = useRef(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabIndexMap = useRef(new WeakMap<object, number>());
  const visibleTabIndexesRef = useRef(new Set<number>());

  useSliderGestures(tabsContainerRef);
  const { canScrollLeft, canScrollRight } = scrollState;

  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    if (!tabsContainer) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(
      updateVisibilityIndicators,
      {
        root: tabsContainer
      }
    );

    const speciesTabs = [...tabsContainer.children];
    tabsCountRef.current = speciesTabs.length;
    speciesTabs.forEach((element, index) => {
      tabIndexMap.current.set(element, index);
      intersectionObserver.observe(element);
    });

    const firstAndLastTabsObserver = new IntersectionObserver(newCallback, {
      root: tabsContainer,
      rootMargin: '1px', // to overcome rounding errors
      threshold: 1
    });
    [speciesTabs.at(0), speciesTabs.at(-1)].forEach((element) => {
      firstAndLastTabsObserver.observe(element as HTMLElement);
    });

    return () => {
      intersectionObserver.disconnect();
      firstAndLastTabsObserver.disconnect();
    };
  }, [props.children]);

  const updateVisibilityIndicators = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const tabIndex = tabIndexMap.current.get(entry.target) as number;
      if (entry.isIntersecting) {
        visibleTabIndexesRef.current.add(tabIndex);
      } else {
        visibleTabIndexesRef.current.delete(tabIndex);
      }
    });
    const newHiddenTabsCount =
      tabsCountRef.current - visibleTabIndexesRef.current.size;
    if (newHiddenTabsCount !== hiddenTabsCount) {
      setHiddenTabsCount(newHiddenTabsCount);
    }
  };

  const newCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const element = entry.target;
      if (tabIndexMap.current.get(element) === 0) {
        // this is the first tab
        scrollStateDispatch({ canScrollLeft: !entry.isIntersecting });
      } else {
        // this must be the last tab
        scrollStateDispatch({ canScrollRight: !entry.isIntersecting });
      }
    });
  };

  const leftArrowClasses = classNames(styles.arrow, styles.arrowLeft, {
    [styles.arrowDisabled]: !canScrollLeft
  });

  const rightArrowClasses = classNames(styles.arrow, styles.arrowRight, {
    [styles.arrowDisabled]: !canScrollRight
  });

  const scrollLeft = () => {
    // get to the previous invisible tab
    const firstVisibleTabIndex = [...visibleTabIndexesRef.current]
      .sort((a, b) => a - b)
      .shift() as number;
    const tabsContainer = tabsContainerRef.current as HTMLElement;
    const tabElements = [...tabsContainer.children];

    let scrollTo: number;

    if (firstVisibleTabIndex > 0) {
      const scrollTabElement = tabElements.find((element) => {
        const elementIndex = tabIndexMap.current.get(element) as number;
        return elementIndex === firstVisibleTabIndex - 1;
      }) as HTMLElement;
      scrollTo = scrollTabElement.offsetLeft - tabsContainer.offsetLeft;
    } else {
      // the tab partly visible on the left is the first tab
      scrollTo = 0;
    }

    scrollTabsContainer(scrollTo);
  };

  const scrollRight = () => {
    // get to the next invisible tab
    const lastVisibleTabIndex = [...visibleTabIndexesRef.current]
      .sort((a, b) => a - b)
      .pop() as number;
    const tabsContainer = tabsContainerRef.current as HTMLElement;
    const tabElements = [...tabsContainer.children];

    let scrollTabElement: HTMLElement; // tab to whose right corner container needs to scroll

    if (tabElements.length - 1 > lastVisibleTabIndex) {
      scrollTabElement = tabElements.find((element) => {
        const elementIndex = tabIndexMap.current.get(element) as number;
        return elementIndex === lastVisibleTabIndex + 1;
      }) as HTMLElement;
    } else {
      // the tab partly visible on the right is the last tab
      scrollTabElement = tabElements[lastVisibleTabIndex] as HTMLElement;
    }

    const scrollToRightX =
      scrollTabElement.offsetLeft +
      scrollTabElement.offsetWidth -
      tabsContainer.offsetLeft;
    scrollTabsContainer(scrollToRightX - tabsContainer.offsetWidth);
  };

  const scrollTabsContainer = (scrollTo: number) => {
    const tabsContainer = tabsContainerRef.current as HTMLElement;
    tabsContainer.style.scrollBehavior = 'smooth';
    tabsContainer.scrollLeft = scrollTo;
    setTimeout(() => {
      (tabsContainer.style.scrollBehavior = 'auto'), 1000; // just guessing how long it should take browser to scroll
    });
  };

  return (
    <div className={styles.speciesTabsSlider}>
      <Chevron
        direction="left"
        className={leftArrowClasses}
        onClick={scrollLeft}
      />
      <div ref={tabsContainerRef} className={styles.tabsContainer}>
        {props.children}
      </div>
      <HiddenTabsCount count={hiddenTabsCount} />
      <Chevron
        direction="right"
        className={rightArrowClasses}
        onClick={scrollRight}
      />
    </div>
  );
};

const HiddenTabsCount = (props: { count: number }) => {
  if (!props.count) {
    return null;
  }

  return (
    <PillButton className={styles.hiddenTabsCountPill} disabled={true}>
      + {props.count}
    </PillButton>
  );
};

export default SpeciesTabsSlider;
