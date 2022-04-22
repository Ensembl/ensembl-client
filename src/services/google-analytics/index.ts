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

import loadGoogleAnalytics from './loadGoogleAnalytics';

/**
 * The interface of the GoogleAnalytics class below
 * replicates the interface of the ReactGA library that we were using before
 */

class GoogleAnalytics {
  static initialize(googleAnalyticsKey: string) {
    loadGoogleAnalytics(googleAnalyticsKey);
  }

  static ga(...args: any[]) {
    window.ga(...args);
  }

  // referencee: example from Google's docs for analytics.js
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#hitType
  static pageview(pagePath: string) {
    window.ga('send', {
      hitType: 'pageview',
      page: pagePath
    });
  }

  // referencee: Google's docs for analytics.js
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventCategory
  static event(params: {
    eventAction: string;
    eventCategory: string;
    eventLabel?: string;
    eventValue?: number;
  }) {
    // clean up the params object before passing it to ga function
    // by removing from it any empty fields
    const options = Object.entries(params).reduce(
      (obj, [key, value]): Partial<typeof params> => {
        return value !== undefined ? { ...obj, [key]: value } : obj;
      },
      {}
    );
    window.ga('send', 'event', options);
  }
}

export default GoogleAnalytics;
