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

import ReactGA from 'react-ga';
import { AnalyticsOptions, CustomDimensions } from 'src/analyticsHelper';

import config from 'config';

const { googleAnalyticsKey } = config;

class AnalyticsTracking {
  private reactGA: typeof ReactGA;

  public constructor() {
    ReactGA.initialize(googleAnalyticsKey, {
      titleCase: false
    });
    this.reactGA = ReactGA;
  }

  // Track a pageview
  public trackPageView(pathToTrack: string) {
    this.reactGA.pageview(pathToTrack);
  }

  // Track an event
  public trackEvent(ga: AnalyticsOptions) {
    typeof ga.species === 'string' && this.setSpeciesDimension(ga.species);
    typeof ga.app === 'string' && this.setAppDimension(ga.app);

    this.reactGA.event({
      action: ga.action,
      category: ga.category,
      label: ga.label,
      nonInteraction: ga.nonInteraction,
      transport: 'xhr',
      value: ga.value
    });
  }

  // Set app custom dimension
  public setAppDimension(app: string) {
    this.reactGA.ga('set', CustomDimensions.APP, app);
  }

  // Set species custom dimension
  public setSpeciesDimension(speciesAnalyticsName: string) {
    this.reactGA.ga('set', CustomDimensions.SPECIES, speciesAnalyticsName);
  }
}

const analyticsTracking = new AnalyticsTracking();

export default analyticsTracking;
