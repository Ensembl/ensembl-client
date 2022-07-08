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

type TrackPageView = {
  page_title?: string;
  page_location?: string;
  page_path: string;
};

type TrackEvent = {
  event_action: string;
  event_category: string;
  event_label?: string;
  event_value?: number;
};

type SetDimension = {
  event_name: string;
  dimension_key: string;
  dimension_value: string | null;
};

/**
 * The interface of the GoogleAnalytics class below
 * replicates the interface of the ReactGA library that we were using before
 */

class GoogleAnalytics {
  static googleAnalyticsKey: string;

  static initialize(googleAnalyticsKey: string) {
    loadGoogleAnalytics(googleAnalyticsKey);
    this.googleAnalyticsKey = googleAnalyticsKey;
  }

  // reference: example from Google's docs for gtag.js
  // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
  static pageview(params: TrackPageView) {
    window.gtag('event', 'page_view', {
      send_to: this.googleAnalyticsKey,
      ...params
    });
  }

  // reference: Google's docs for analytics.js
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#event_category
  static event(params: TrackEvent) {
    // clean up the params object before passing it to ga function
    // by removing from it any empty fields
    const options: {
      event_category: string;
      event_label?: string;
      value?: string;
    } = {
      event_category: params.event_category
    };

    if (params.event_label) {
      options['event_label'] = params.event_label;
    }

    if (params.event_value) {
      options['value'] = params.event_label;
    }

    window.gtag('event', params.event_action, options);
  }

  static setDimension(params: SetDimension) {
    window.gtag('event', params.event_name, {
      [params.dimension_key]: params.dimension_value
    });
  }
}

export default GoogleAnalytics;
