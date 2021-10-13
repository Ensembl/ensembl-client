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

import storageService, {
  StorageServiceInterface,
  StorageType
} from 'src/services/storage-service';
import { AnalyticsOptions, CustomDimensions } from 'src/analyticsHelper';
import config from 'config';

const options = {
  storage: StorageType.SESSION_STORAGE
};

const { googleAnalyticsKey } = config;

class AnalyticsTracking {
  private reactGA: typeof ReactGA;
  private storageService: StorageServiceInterface;
  private isTestModeEnabled: boolean | undefined;

  public constructor(storageService: StorageServiceInterface) {
    ReactGA.initialize(googleAnalyticsKey, {
      titleCase: false
    });
    this.reactGA = ReactGA;
    this.storageService = storageService;
  }

  // Track a pageview
  public trackPageView(pathToTrack: string) {
    this.reactGA.pageview(pathToTrack);
  }

  // Track an event
  public trackEvent(ga: AnalyticsOptions) {
    if (this.isTestModeEnabled === undefined) {
      this.isTestModeEnabled =
        this.storageService.get('analytics_test_mode', options) || false;
    }

    if (this.isTestModeEnabled) {
      // eslint-disable-next-line no-console
      console.log(`Analytics event: ${JSON.stringify(ga, undefined, 2)}`);
      return;
    }

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

    ga.species && this.setSpeciesDimension(null);
    ga.feature && this.setFeatureDimension(null);
  }

  // Set app custom dimension
  public setAppDimension(app: string | null) {
    this.reactGA.ga('set', CustomDimensions.APP, app);
  }

  // Set species custom dimension
  public setSpeciesDimension(speciesAnalyticsName: string | null) {
    this.reactGA.ga('set', CustomDimensions.SPECIES, speciesAnalyticsName);
  }

  // Set feature custom dimension
  public setFeatureDimension(featureType: string | null) {
    this.reactGA.ga('set', CustomDimensions.FEATURE, featureType);
  }
}

const analyticsTracking = new AnalyticsTracking(storageService);

export default analyticsTracking;
