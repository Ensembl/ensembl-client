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

import { type AnalyticsOptions } from 'src/analyticsHelper';

import config from 'config';

import GoogleAnalytics, {
  TrackEventParams
} from 'src/services/google-analytics';

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
    // https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
    if (!config.shouldReportAnalytics) {
      (window as any)[`ga-disable-${googleAnalyticsKey}`] = true;
    }
  }

  // Track a pageview
  public trackPageView(pagePath: string) {
    this.googleAnalytics.pageview({
      page_path: pagePath
    });
  }

  // Track an event
  public trackEvent(options: AnalyticsOptions) {
    const eventParams: TrackEventParams = {
      event_action: options.action,
      event_category: options.category
    };

    if (options.label) {
      eventParams.event_label = options.label;
    }

    if (options.value) {
      eventParams.value = options.value;
    }

    if (options.species) {
      eventParams.species = options.species;
    }

    if (options.app) {
      eventParams.app = options.app;
    }

    if (options.feature) {
      eventParams.feature = options.feature;
    }

    this.googleAnalytics.event(eventParams);
  }
}

const analyticsTracking = new AnalyticsTracking();

export default analyticsTracking;
