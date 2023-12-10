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
    if (!ref.current) {
      return;
    }

    // set up a mutation observer to react to any of the species lozenges
    // becoming active when user clicks on it
    const mutationObserverConfig = { attributes: true, subtree: true };
    const mutationObserver = new MutationObserver(mutationObserverCallback);
    mutationObserver.observe(ref.current, mutationObserverConfig);

    updatePositionWhenFontsAreReady();

    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  const mutationObserverCallback: MutationCallback = (mutationList) => {
    const attributeChangeMutation = mutationList.find((mutation) => {
      return (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'data-active' &&
        (mutation.target as HTMLElement).dataset.active
      );
    });
    if (attributeChangeMutation) {
      scrollToActiveSpeciesTab({ behavior: 'smooth' });
    }
  };

  // for proper calculation of tab positions, wait until fonts are ready
  const updatePositionWhenFontsAreReady = async () => {
    await document.fonts.ready;
    scrollToActiveSpeciesTab();
  };

  const scrollToActiveSpeciesTab = (
    scrollOptions: ScrollIntoViewOptions = {}
  ) => {
    const container = ref.current;
    const activeSpeciesLozenge = container?.querySelector(
      'button[data-active="true"]'
    ) as HTMLElement | null;

    if (!container || !activeSpeciesLozenge) {
      return;
    }

    const elementBoundingClientRect =
      activeSpeciesLozenge.getBoundingClientRect();
    const containerBoundingClientRect = container.getBoundingClientRect();
    const { x: elementX, width: elementWidth } = elementBoundingClientRect;
    const { x: containerX, width: containerWidth } =
      containerBoundingClientRect;

    if (
      elementX >= containerX &&
      elementX + elementWidth <= containerX + containerWidth
    ) {
      // species lozenge is visible inside of the container
      return;
    }
    let scrollTo: number;

    if (elementX < containerX) {
      // species lozenge is at least partly hidden behind the left corner
      // of the container
      scrollTo = Math.floor(
        activeSpeciesLozenge.offsetLeft - container.offsetLeft
      );
    } else {
      // species lozenge is at least partly hidden behind the right corner
      // of the container
      scrollTo = Math.ceil(
        activeSpeciesLozenge.offsetLeft +
          activeSpeciesLozenge.offsetWidth -
          container.offsetWidth -
          container.offsetLeft
      );
    }
    container.scrollTo({ ...scrollOptions, left: scrollTo });
  };
};

export default useVisibleActiveSpecies;
