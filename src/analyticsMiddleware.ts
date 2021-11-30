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

import { LOCATION_CHANGE } from 'connected-react-router';

import analyticsTracking from './services/analytics-service';

export const analyticsMiddleWare = (store: any) => (next: any) => (
  action: any
) => {
  // If we have the google anlytics meta data passed in
  // We need to track this event
  if (action.meta && action.meta.ga && action.meta.ga.category) {
    // The action and category fields are mandatory
    analyticsTracking.trackEvent(action.meta.ga);
  } else if (
    action.type === LOCATION_CHANGE &&
    action.payload.location.pathname !==
      store.getState().router.location.pathname
  ) {
    // If the location history has been changed, track it as a pageview
    analyticsTracking.trackPageView(
      action.payload.location.pathname +
        action.payload.location.search +
        action.payload.location.hash
    );
  }

  next(action);
};
