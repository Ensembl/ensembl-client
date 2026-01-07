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

/**
 * The functions in this module use the Navigation API,
 * which is becoming available across modern browsers in early 2026.
 */

export const doesSupportNavigationApi = () => {
  return 'navigation' in globalThis;
};

/**
 * A common request from designer seems to be to have a "Back" button.
 * Such button would go one step back in the navigation history;
 * but in order to show such button, it is usually necessary to know:
 * - Are there any previous pages that user has visited on this site
 *   (as opposed to opening the page via direct navigation, in which case
 *    we shouldn't send the user back)
 * - Is the previous page within the current app (sometimes the back navigation
 *   will only make sense as long as it happens within the current app)
 */
export const getPreviousPageUrl = () => {
  // NOTE: typescript does not yet have type definitions for the navigation api;
  // but hopefully will be released soon.
  // We could install @types/dom-navigation; but it probably isn't worth it.

  // @ts-expect-error types for navigation api not yet available
  const historyEntries = navigation.entries();
  // @ts-expect-error types for navigation api not yet available
  const previousEntry = historyEntries[navigation.currentEntry.index - 1];

  if (previousEntry) {
    return previousEntry.url as string;
  } else {
    return null;
  }
};
