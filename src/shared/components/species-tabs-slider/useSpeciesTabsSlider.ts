import {
  useEffect,
  useReducer,
  type ReactNode,
  type RefObject
} from 'react';

type Params = {
  containerRef: RefObject<HTMLDivElement>;
  children: ReactNode;
};

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

const useSpeciesTabsSlider = (params: Params) => {
  const { containerRef, children } = params;
  const [scrollState, scrollStateDispatch] = useReducer(
    scrollStateReducer,
    initialScrollState
  );

  // connect intersection observers to the first and the last species tabs
  useEffect(() => {
    const tabsContainer = containerRef.current;
    if (!tabsContainer) {
      return;
    }

    const speciesTabs = [...tabsContainer.children];
    if (!speciesTabs.length) {
      scrollStateDispatch({
        canScrollLeft: false,
        canScrollRight: false
      });
      return;
    }

    const firstSpeciesTab = speciesTabs.at(0) as HTMLElement;
    const lastSpeciesTab = speciesTabs.at(-1) as HTMLElement;

    const tabIntersectionObserverOptions = {
      root: tabsContainer,
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

    firstTabIntersectionObserver.observe(firstSpeciesTab);
    lastTabIntersectionObserver.observe(lastSpeciesTab);

    return () => {
      firstTabIntersectionObserver.disconnect();
      lastTabIntersectionObserver.disconnect();
    }
  }, [children]);

  const updateScrollLeftState = (entries: IntersectionObserverEntry[]) => {
    const intersectionEntry = entries[0]; // we are only observing a single tab
    scrollStateDispatch({ canScrollLeft: !intersectionEntry.isIntersecting });
  };

  const updateScrollRightState = (entries: IntersectionObserverEntry[]) => {
    const intersectionEntry = entries[0]; // we are only observing a single tab
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
      if (Math.round(tabBoundingRect.x) < Math.round(tabsContainerBoundingRect.x)) {
        targetLozenge = tab as HTMLElement;
      }
    }

    const scrollTo = Math.floor(targetLozenge.offsetLeft - tabsContainer.offsetLeft);
    scrollTabsContainer(scrollTo);
  };

  const scrollRight = () => {
    const tabsContainer = containerRef.current as HTMLDivElement;
    const speciesTabs = [...tabsContainer.children];
    const tabsContainerBoundingRect = tabsContainer.getBoundingClientRect();
    let targetLozenge = speciesTabs[0] as HTMLElement;

    // find the fully or partly hidden lozenge that is the closest
    // to the right corner of the container
    for (const tab of speciesTabs) {
      const tabBoundingRect = tab.getBoundingClientRect();
      if (
        Math.round(tabBoundingRect.x) + Math.round(tabBoundingRect.width) >
        Math.round(tabsContainerBoundingRect.x) + Math.round(tabsContainerBoundingRect.width) + 1
      ) {
        targetLozenge = tab as HTMLElement;
        break
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


  return {
    ...scrollState,
    scrollLeft,
    scrollRight
  }
};

export default useSpeciesTabsSlider;
