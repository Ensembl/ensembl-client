import { useEffect, type RefObject } from 'react';

/**
 * The purpose of this hook is to make sure that, when the SpeciesTabsSlider mounts,
 * the active selected species lozenge is visible.
 * 
 * If the active lozenge is not visible within the scrolling area of the tabs container,
 * then it is scrolled to the nearest visible side of the container.
 */

const useVisibleActiveSpecies = (ref: RefObject<HTMLDivElement>) => {

  useEffect(() => {
    // delay the position calculation and the scrolling until the next macrotask
    // (there is a slight miscalculation of the scrolling distance otherwise)
    setTimeout(doWork, 0);
  }, []);


  const doWork = () => {
    const container = ref.current;
    const activeSpeciesLozenge = container?.querySelector('button[data-active="true"]');

    if (!container || !activeSpeciesLozenge) {
      return;
    }

    const containerBoundingRect = container.getBoundingClientRect();
    const lozengeBoundingRect = activeSpeciesLozenge.getBoundingClientRect();


    if (lozengeBoundingRect.x < containerBoundingRect.x) {
      // lozenge hidden towards container start
      // (almost certainly impossible when container has just mounted)
      container.scrollLeft = 0;
    } else if (lozengeBoundingRect.x + lozengeBoundingRect.width > containerBoundingRect.x + containerBoundingRect.width) {
      // lozenge hidden towards container end
      const distance = lozengeBoundingRect.x + lozengeBoundingRect.width - containerBoundingRect.x - containerBoundingRect.width;
      container.scrollTo({ left: distance });
    }
  };

};

export default useVisibleActiveSpecies;
