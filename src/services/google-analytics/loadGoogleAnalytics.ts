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

import once from 'lodash/once';

/**
 * References:
 * - Google's instructions for adding google analytics to a site (written mostly for a layman):
 * https://developers.google.com/analytics/devguides/collection/analyticsjs
 *
 * - Google's reference documentation containing the unminified version of their code snippet,
 * with explanations:
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/tracking-snippet-reference
 *
 */

interface GTAG {
  (...args: any[]): void; // executes analytics commands
}

// extend the window interface with the google analytics object
declare global {
  interface Window {
    gtag: GTAG;
    dataLayer: any[];
  }
}

const loadGoogleAnalytics = (trackerId: string) => {
  loadScript(trackerId);
  createGAShim(trackerId);
};

// create a simplified google analytics object and assign it to window
// to keep a queue of any pending analytics commands
// until the real google analytics object is ready to replace it
const createGAShim = (trackerId: string) => {
  window.gtag = function () {
    // gtag is really particular in that it wants the Arguments object
    // which is only available on non-arrow functions
    window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
  };

  window.dataLayer = window.dataLayer || []; // initialise the command queue
  window.gtag('js', new Date()); // Google uses this for timing hits

  // It is better to disable sending pageviews automatically as it will trigger too many calls in genome browser
  window.gtag('config', trackerId, { send_page_view: false });
};

const loadScript = (trackerId: string) => {
  const scriptElement = document.createElement('script');
  scriptElement.async = true;
  scriptElement.src = `https://www.googletagmanager.com/gtag/js?id=${trackerId}`;
  document.head.appendChild(scriptElement);
};

export default once(loadGoogleAnalytics);
