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
    options.species && this.setSpeciesDimension(options.species);
    options.app && this.setAppDimension(options.app);
    options.feature && this.setFeatureDimension(options.feature);

    this.googleAnalytics.event({
      event_action: options.action,
      event_category: options.category,
      event_label: options.label,
      event_value: options.value
    });

    options.species && this.setSpeciesDimension(null);
    options.feature && this.setFeatureDimension(null);
  }

  // Set app custom dimension
  public setAppDimension(app: string | null) {
    this.googleAnalytics.setDimension({
      event_name: 'set_app_dimension',
      dimension_key: CustomDimensions.APP,
      dimension_value: app
    });
  }

  // Set species custom dimension
  public setSpeciesDimension(speciesAnalyticsName: string | null) {
    this.googleAnalytics.setDimension({
      event_name: 'set_species_dimension',
      dimension_key: CustomDimensions.SPECIES,
      dimension_value: speciesAnalyticsName
    });
  }

  // Set feature custom dimension
  public setFeatureDimension(featureType: string | null) {
    this.googleAnalytics.setDimension({
      event_name: 'set_feature_dimension',
      dimension_key: CustomDimensions.FEATURE,
      dimension_value: featureType
    });
  }
}

const analyticsTracking = new AnalyticsTracking();

export default analyticsTracking;
