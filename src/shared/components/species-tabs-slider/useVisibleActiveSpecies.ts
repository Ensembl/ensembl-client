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
    updatePositionWhenFontsAreReady();
  }, []);

  // for proper calculation of tab positions, wait until fonts are ready
  const updatePositionWhenFontsAreReady = async () => {
    await document.fonts.ready;
    scrollToActiveSpeciesTab();
  };

  const scrollToActiveSpeciesTab = () => {
    const container = ref.current;
    const activeSpeciesLozenge = container?.querySelector(
      'button[data-active="true"]'
    );

    if (!container || !activeSpeciesLozenge) {
      return;
    }

    const containerBoundingRect = container.getBoundingClientRect();
    const lozengeBoundingRect = activeSpeciesLozenge.getBoundingClientRect();

    if (lozengeBoundingRect.x < containerBoundingRect.x) {
      // lozenge hidden towards container start
      // (almost certainly impossible when container has just mounted)
      container.scrollLeft = 0;
    } else if (
      lozengeBoundingRect.x + lozengeBoundingRect.width >
      containerBoundingRect.x + containerBoundingRect.width
    ) {
      // lozenge hidden towards container end
      // const distance = Math.ceil(lozengeBoundingRect.x + lozengeBoundingRect.width - containerBoundingRect.x - containerBoundingRect.width);
      // container.scrollTo({ left: distance });
      activeSpeciesLozenge.scrollIntoView();
    }
  };
};

export default useVisibleActiveSpecies;
