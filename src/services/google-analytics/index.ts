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

import { CustomDimensionsOptions } from 'src/analyticsHelper';
import loadGoogleAnalytics from './loadGoogleAnalytics';

type TrackPageView = {
  page_title?: string;
  page_location?: string;
  page_path: string;
};

export type TrackEventParams = CustomDimensionsOptions & {
  event_action: string;
  event_category: string;
  event_label?: string;
  event_value?: number;
};

/**
 * The interface of the GoogleAnalytics class below
 * replicates the interface of the ReactGA library that we were using before
 */

class GoogleAnalytics {
  static initialize(googleAnalyticsKey: string) {
    loadGoogleAnalytics(googleAnalyticsKey);
  }

  // reference: example from Google's docs for gtag.js
  // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
  static pageview(params: TrackPageView) {
    window.gtag('event', 'page_view', {
      ...params
    });
  }

  // reference: Google's docs for analytics.js
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#event_category
  static event(eventParams: TrackEventParams) {
    window.gtag('event', eventParams.event_action, eventParams);
  }
}

export default GoogleAnalytics;
