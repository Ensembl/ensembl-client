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

import { useEffect, useRef } from 'react';

import analyticsTracking from 'src/services/analytics-service';

import { type AnalyticsOptions } from 'src/analyticsHelper';
import { useAppSelector } from 'src/store';
import { getCurrentApp } from '../globalSelectors';

const useGlobalAnalytics = () => {
  const appName = useAppSelector(getCurrentApp) || 'homepage';
  const globalAnalyticsRef = useRef<HTMLDivElement | null>(null);

  const sendTrackEvent = (ga: AnalyticsOptions) => {
    analyticsTracking.trackEvent({
      ...ga,
      app: ga.app ?? appName
    });
  };

  const handleAnalyticsCustomEvent = (event: CustomEvent<AnalyticsOptions>) => {
    sendTrackEvent({
      ...event.detail
    });
  };

  useEffect(() => {
    globalAnalyticsRef.current?.addEventListener(
      'analytics',
      handleAnalyticsCustomEvent as EventListener
    );
    return () => {
      globalAnalyticsRef.current?.removeEventListener(
        'analytics',
        handleAnalyticsCustomEvent as EventListener
      );
    };
  }, [globalAnalyticsRef, appName]);

  return {
    globalAnalyticsRef
  };
};

export default useGlobalAnalytics;
