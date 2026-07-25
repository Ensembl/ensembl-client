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

import { useCallback, useRef, useReducer } from 'react';

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

const useSpeciesTabsSlider = () => {
  const [scrollState, scrollStateDispatch] = useReducer(
    scrollStateReducer,
    initialScrollState
  );

  const containerRef = useRef<HTMLElement>(null);
  const intersectionObserverRefs = useRef<IntersectionObserver[]>([]);

  /**
   * NOTE for the two functions below:
   *
   * Although intersection observers only observe a single tab per observer,
   * sometimes an observer can fire several times (as when .scrollIntoView method is used).
   *
   * In this case, intersection entries will be ordered in the array chronologically;
   * and we can just inspect the last of them
   */

  const updateScrollLeftState = (entries: IntersectionObserverEntry[]) => {
    const intersectionEntry = entries.at(-1) as IntersectionObserverEntry;
    scrollStateDispatch({ canScrollLeft: !intersectionEntry.isIntersecting });
  };

  const updateScrollRightState = (entries: IntersectionObserverEntry[]) => {
    const intersectionEntry = entries.at(-1) as IntersectionObserverEntry;
    scrollStateDispatch({ canScrollRight: !intersectionEntry.isIntersecting });
  };

  /**
   * NOTE: the reason the scroll functions below calculate scroll distance imperatively,
   * instead of relying on the convenient element.scrollIntoView method
   * is because the scrollIntoView method did not scroll species lozenges quite all the way in,
   * and as a result the intersection observer for the last lozenge did not fire.
   * Passing an { inline: 'end' } option did not help.
   */
  const scrollLeft = () => {
    const tabsContainer = containerRef.current as HTMLDivElement;
    const speciesTabs = [...tabsContainer.children];
    const tabsContainerBoundingRect = tabsContainer.getBoundingClientRect();
    let targetLozenge = speciesTabs[0] as HTMLElement;

    // find the fully or partly hidden lozenge that is the closest
    // to the left corner of the container
    for (const tab of speciesTabs) {
      const tabBoundingRect = tab.getBoundingClientRect();
      if (
        Math.round(tabBoundingRect.x) < Math.round(tabsContainerBoundingRect.x)
      ) {
        targetLozenge = tab as HTMLElement;
      }
    }

    const scrollTo = Math.floor(
      targetLozenge.offsetLeft - tabsContainer.offsetLeft
    );
    scrollTabsContainer(scrollTo);
  };

  const scrollRight = () => {
    const tabsContainer = containerRef.current as HTMLDivElement;
    const speciesTabs = [...tabsContainer.children];
    const tabsContainerBoundingRect = tabsContainer.getBoundingClientRect();
    let targetLozenge = speciesTabs.at(-1) as HTMLElement;

    // find the fully or partly hidden lozenge that is the closest
    // to the right corner of the container
    for (const tab of speciesTabs) {
      const tabBoundingRect = tab.getBoundingClientRect();
      if (
        Math.round(tabBoundingRect.x) + Math.round(tabBoundingRect.width) >
        Math.round(tabsContainerBoundingRect.x) +
          Math.round(tabsContainerBoundingRect.width) +
          1
      ) {
        targetLozenge = tab as HTMLElement;
        break;
      }
    }

    const scrollTo = Math.ceil(
      targetLozenge.offsetLeft +
        targetLozenge.offsetWidth -
        tabsContainer.offsetWidth -
        tabsContainer.offsetLeft
    );
    scrollTabsContainer(scrollTo);
  };

  const scrollTabsContainer = (scrollTo: number) => {
    const tabsContainer = containerRef.current as HTMLElement;
    tabsContainer.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  const clearIntersectionObservers = useCallback(() => {
    // clear old intersection observers
    intersectionObserverRefs.current.forEach((observer) => {
      observer.disconnect();
    });
    intersectionObserverRefs.current = [];
  }, []);

  const setIntersectionObservers = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    const genomeTabs = [...container.children];
    if (!genomeTabs.length) {
      scrollStateDispatch({
        canScrollLeft: false,
        canScrollRight: false
      });
      return;
    }

    const firstGenomeTab = genomeTabs.at(0) as HTMLElement;
    const lastGenomeTab = genomeTabs.at(-1) as HTMLElement;

    const tabIntersectionObserverOptions = {
      root: container,
      rootMargin: '1px', // to overcome rounding errors
      threshold: 1
    };

    const firstTabIntersectionObserver = new IntersectionObserver(
      updateScrollLeftState,
      tabIntersectionObserverOptions
    );

    const lastTabIntersectionObserver = new IntersectionObserver(
      updateScrollRightState,
      tabIntersectionObserverOptions
    );

    firstTabIntersectionObserver.observe(firstGenomeTab);
    lastTabIntersectionObserver.observe(lastGenomeTab);

    intersectionObserverRefs.current = [
      firstTabIntersectionObserver,
      lastTabIntersectionObserver
    ];
  }, []);

  const mutationObserverCallback: MutationCallback = useCallback(() => {
    clearIntersectionObservers();
    setIntersectionObservers();
  }, [setIntersectionObservers, clearIntersectionObservers]);

  const refCallback = useCallback(
    (element: HTMLElement) => {
      containerRef.current = element;
      setIntersectionObservers();

      // set up a mutation observer to react to changes
      // in the number of genome lozenges
      const mutationObserverConfig = { childList: true };
      const mutationObserver = new MutationObserver(mutationObserverCallback);
      mutationObserver.observe(element, mutationObserverConfig);

      return () => {
        mutationObserver.disconnect();
        clearIntersectionObservers();
        containerRef.current = null;
      };
    },
    [
      mutationObserverCallback,
      setIntersectionObservers,
      clearIntersectionObservers
    ]
  );

  return {
    ...scrollState,
    refCallback,
    scrollLeft,
    scrollRight
  };
};

export default useSpeciesTabsSlider;
