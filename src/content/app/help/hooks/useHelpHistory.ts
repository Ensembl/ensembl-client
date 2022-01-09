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

import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React-router uses the `history` library (maintained by the same team),
 * which adds a unique `key` property to every location.
 * Thus, even if several locations are associated with the same url,
 * as may happen when page1 links to page2, while page2 links to page1:
 * [page1 -> page2 -> page1], location keys will still be different.
 *
 * This can be used to distinguish a click on the browser back button
 * from a click on the browser forward button.
 */

const useHelpHistory = () => {
  const { key } = useLocation();
  const locationKeysRef = useRef<string[]>([]);

  const locationKeys = locationKeysRef.current;

  const currentKeyIndex = locationKeys.indexOf(key);

  const hasNext: boolean =
    currentKeyIndex > -1 && currentKeyIndex < locationKeys.length - 1;
  const hasPrevious: boolean = locationKeys.length > 1 && currentKeyIndex > 0;

  if (currentKeyIndex === -1) {
    locationKeysRef.current.push(key);
  }

  return {
    hasNext,
    hasPrevious
  };
};

export default useHelpHistory;
