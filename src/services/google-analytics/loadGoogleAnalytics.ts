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

interface GA {
  (...args: any[]): void; // executes analytics commands
  q: any[]; // a container for queueing up analytics commands
  l: number; // is used for timestamps
}

// extend the window interface with the google analytics object
declare global {
  interface Window {
    ga: GA;
  }
}

const loadGoogleAnalytics = (trackerId: string) => {
  createGAShim(trackerId);
  loadScript();
};

// create a simplified google analytics object and assign it to window
// to keep a queue of any pending analytics commands
// until the real google analytics object is ready to replace it
const createGAShim = (trackerId: string) => {
  const ga = (...args: any[]) => {
    // the sole purpose of the shim is to enqueue commands that it receives
    // before the real Google Analytics script loads
    window.ga.q.push(args);
  };

  ga.q = [] as any[]; // initialise the command queue
  ga.l = new Date().getTime(); // Google uses this for timing hits
  window.ga = ga;

  window.ga('create', trackerId, 'auto'); // immediately enqueue a command for creating a tracker
};

const loadScript = () => {
  const scriptElement = document.createElement('script');
  scriptElement.async = true;
  scriptElement.src = 'https://www.google-analytics.com/analytics.js';
  document.body.appendChild(scriptElement);
};

export default once(loadGoogleAnalytics);
