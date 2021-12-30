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

import { matchPath } from 'react-router';

/**
 * React-router version 6 has removed optional url parameters
 * and other powerful features based on what they call "regexp route paths"
 * (see https://github.com/remix-run/react-router/blob/17f8e8e977110e0f2e3b9fac0310ad2b16bb5de0/docs/faq.md#what-happened-to-regexp-routes-paths)
 *
 * This hook tries to bring back the functionality that we need.
 * It uses react-router's matchPath function to parse pathnames.
 * Maybe in the future it will be possible to use browser's native URL Pattern API
 * (https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API),
 * or maybe the team behind React router will change their mind. Again.
 */

// a general-purpose function based on react-router's matchPath
export const getPathParameters = <ParamKey extends string>(
  patternOrPatterns: string | string[],
  pathname: string
): Partial<Record<ParamKey, string>> => {
  const patterns =
    typeof patternOrPatterns === 'string'
      ? [patternOrPatterns]
      : patternOrPatterns;
  return patterns.reduce((params, pattern) => {
    const matchResult = matchPath(pattern, pathname);
    return { ...params, ...matchResult?.params };
  }, {}) as Partial<Record<ParamKey, string>>;
  // if (Object.keys(params).length) {
  //   return params as Record<ParamKey, string>;
  // } else {
  //   return null;
  // }
};

// exported as a React hook
export const useUrlParams = getPathParameters;
