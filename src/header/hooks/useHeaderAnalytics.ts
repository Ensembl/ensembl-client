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
import { useLocation } from 'react-router-dom';

import analyticsTracking from 'src/services/analytics-service';

import { type AnalyticsOptions } from 'src/analyticsHelper';

const useHeaderAnalytics = () => {
  const location = useLocation();
  const appName: string =
    location.pathname.split('/').filter(Boolean)[0] || 'homepage';

  const sendTrackEvent = (ga: AnalyticsOptions) => {
    analyticsTracking.trackEvent({
      ...ga,
      app: ga.app ?? appName
    });
  };

  const trackLaunchbarAppChange = (selectedApp: string) => {
    sendTrackEvent({
      category: 'launchbar',
      action: 'app_selected',
      label: selectedApp
    });
  };

  return {
    trackLaunchbarAppChange
  };
};

export default useHeaderAnalytics;
