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

import reduce from 'lodash/reduce';

import windowService from 'src/services/window-service';

export const getCurrentMediaSize = (queries: { [key: string]: string }) => {
  return reduce(
    queries,
    (result: string | null, mediaQuery, mediaSize) => {
      const mediaQueryList = getMediaQueryList(mediaQuery);
      if (mediaQueryList.matches) {
        return mediaSize;
      } else {
        return result;
      }
    },
    null
  );
};

export const observeMediaQueries = (
  queries: { [key: string]: string },
  callback: (key: string) => void
) => {
  // First, get instant media query match
  const currentMediaSize = getCurrentMediaSize(queries);
  if (currentMediaSize) {
    callback(currentMediaSize);
  }

  // Second, subscribe to subsequent media query changes
  const observableQueries = Object.entries(queries).map(([key, query]) => {
    const mediaQueryList = getMediaQueryList(query);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        callback(key);
      }
    };
    mediaQueryList.addEventListener('change', onChange);
    return { mediaQueryList, onChange };
  });

  const unsubscribe = () => {
    observableQueries.forEach(({ mediaQueryList, onChange }) => {
      mediaQueryList.removeEventListener('change', onChange);
    });
  };
  return { unsubscribe };
};

const getMediaQueryList = (query: string) => {
  const matchMedia = windowService.getMatchMedia();
  return matchMedia(query);
};
