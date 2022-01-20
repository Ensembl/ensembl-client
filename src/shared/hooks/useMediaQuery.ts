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

import { useState, useEffect } from 'react';
import { isClient } from 'src/shared/helpers/environment';

// will return null in the server-side environment, or true/false in the client-side environment
const useMediaQuery = (mediaQuery: string): boolean | null => {
  const mediaQueryList = getMediaQueryList(mediaQuery);
  const [doesMatch, setDoesMatch] = useState(mediaQueryList?.matches ?? null);

  const onChange = (event: MediaQueryListEvent) => {
    setDoesMatch(event.matches);
  };

  useEffect(() => {
    mediaQueryList?.addEventListener('change', onChange);

    return () => mediaQueryList?.removeEventListener('change', onChange);
  }, [mediaQuery]);

  return doesMatch;
};

const getMediaQueryList = (mediaQuery: string) => {
  if (isClient()) {
    return window.matchMedia(mediaQuery);
  }
};

export default useMediaQuery;
