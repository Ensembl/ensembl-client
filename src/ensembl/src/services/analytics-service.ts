import ReactGA from 'react-ga';
import { AnalyticsOptions, CustomDimensionOptions } from 'src/analyticsHelper';

import config from 'config';

const { googleAnalyticsKey = '', isTest } = config;

class AnalyticsTracking {
  private reactGA: typeof ReactGA;

  public constructor() {
    ReactGA.initialize(googleAnalyticsKey, {
      titleCase: false,
      testMode: isTest
    });
    this.reactGA = ReactGA;
  }

  // Track a pageview
  public trackPageView(pathToTrack: string) {
    this.reactGA.pageview(pathToTrack);
  }

  // Track an event
  public trackEvent(ga: AnalyticsOptions) {
    this.reactGA.event({
      action: ga.action,
      category: ga.category,
      label: ga.label,
      nonInteraction: ga.nonInteraction,
      transport: 'xhr',
      value: ga.value
    });
  }

  // Send a custom dimension event
  public setCustomDimension(ga: CustomDimensionOptions) {
    this.reactGA.ga('set', ga.diemension, ga.value);
  }
}

const analyticsTracking = new AnalyticsTracking();

export default analyticsTracking;
