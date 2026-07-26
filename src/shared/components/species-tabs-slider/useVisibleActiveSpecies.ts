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

import { useRef, useCallback } from 'react';

/**
 * The purpose of this hook is to make sure that, when the SpeciesTabsSlider mounts,
 * the active selected species lozenge is visible.
 *
 * If the active lozenge is not visible within the scrolling area of the tabs container,
 * then it is scrolled to the nearest visible side of the container.
 */

const useVisibleActiveSpecies = () => {
  const elementRef = useRef<HTMLElement>(null);

  // NOTE:
  // When all our target browsers start supporting the container: "nearest" option
  // of element.scrollIntoView method, the below function will become as easy as:
  // activeSpeciesLozenge.scrollIntoView({ behavior: 'smooth', inline: 'nearest', container: 'nearest' })
  // See https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  const scrollToActiveSpeciesTab = useCallback(
    (
      params: {
        scrollOptions?: ScrollIntoViewOptions;
      } = {}
    ) => {
      const { scrollOptions = {} } = params;
      const container = elementRef.current as HTMLElement;
      const activeSpeciesLozenge = container?.querySelector(
        '[data-active="true"]'
      ) as HTMLElement | null;

      if (!container || !activeSpeciesLozenge) {
        return;
      }

      const left = activeSpeciesLozenge.offsetLeft;
      const right = left + activeSpeciesLozenge.offsetWidth;

      const visibleLeft = container.scrollLeft;
      const visibleRight = visibleLeft + container.clientWidth;

      if (left < visibleLeft) {
        container.scrollTo({
          left: left - container.offsetLeft,
          ...scrollOptions
        });
      } else if (right > visibleRight) {
        container.scrollTo({
          left: right - container.offsetLeft - container.clientWidth,
          ...scrollOptions
        });
      }
    },
    []
  );

  // for proper calculation of tab positions, wait until fonts are ready
  const updatePositionWhenFontsAreReady = useCallback(async () => {
    await document.fonts.ready;
    scrollToActiveSpeciesTab();
  }, [scrollToActiveSpeciesTab]);

  const mutationObserverCallback: MutationCallback = useCallback(
    (mutationList) => {
      const attributeChangeMutation = mutationList.find((mutation) => {
        return (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-active' &&
          (mutation.target as HTMLElement).dataset.active
        );
      });
      if (attributeChangeMutation) {
        scrollToActiveSpeciesTab({ scrollOptions: { behavior: 'smooth' } });
      }
    },
    [scrollToActiveSpeciesTab]
  );

  const refCallback = useCallback(
    (element: HTMLElement) => {
      elementRef.current = element;

      // set up a mutation observer to react to any of the species lozenges
      // becoming active when user clicks on it
      const mutationObserverConfig = { attributes: true, subtree: true };
      const mutationObserver = new MutationObserver(mutationObserverCallback);
      mutationObserver.observe(element, mutationObserverConfig);

      updatePositionWhenFontsAreReady();

      return () => {
        mutationObserver.disconnect();
        elementRef.current = null;
      };
    },
    [mutationObserverCallback, updatePositionWhenFontsAreReady]
  );

  return {
    refCallback
  };
};

export default useVisibleActiveSpecies;
