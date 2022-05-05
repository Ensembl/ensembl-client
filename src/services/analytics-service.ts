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

import { CustomDimensions, type AnalyticsOptions } from 'src/analyticsHelper';

import config from 'config';

import GoogleAnalytics from 'src/services/google-analytics';

const { googleAnalyticsKey } = config;

class AnalyticsTracking {
  private googleAnalytics: typeof GoogleAnalytics;

  public constructor() {
    if (typeof window === 'undefined') {
      // we don't need google analytics on the server
      this.googleAnalytics = {} as any; // to make typescript happy
      return;
    }

    GoogleAnalytics.initialize(googleAnalyticsKey);
    this.googleAnalytics = GoogleAnalytics;
    this.setReporting();
  }

  private setReporting() {
    // don't send analytics other than in production deployment
    if (!config.shouldReportAnalytics) {
      this.googleAnalytics.ga('set', 'sendHitTask', null);
    }
  }

  // Track a pageview
  public trackPageView(pagePath: string) {
    this.googleAnalytics.pageview(pagePath);
  }

  // Track an event
  public trackEvent(ga: AnalyticsOptions) {
    ga.species && this.setSpeciesDimension(ga.species);
    ga.app && this.setAppDimension(ga.app);
    ga.feature && this.setFeatureDimension(ga.feature);

    this.googleAnalytics.event({
      eventAction: ga.action,
      eventCategory: ga.category,
      eventLabel: ga.label,
      eventValue: ga.value
    });

    ga.species && this.setSpeciesDimension(null);
    ga.feature && this.setFeatureDimension(null);
  }

  // Set app custom dimension
  public setAppDimension(app: string | null) {
    this.googleAnalytics.ga('set', CustomDimensions.APP, app);
  }

  // Set species custom dimension
  public setSpeciesDimension(speciesAnalyticsName: string | null) {
    this.googleAnalytics.ga(
      'set',
      CustomDimensions.SPECIES,
      speciesAnalyticsName
    );
  }

  // Set feature custom dimension
  public setFeatureDimension(featureType: string | null) {
    this.googleAnalytics.ga('set', CustomDimensions.FEATURE, featureType);
  }
}

const analyticsTracking = new AnalyticsTracking();

export default analyticsTracking;
