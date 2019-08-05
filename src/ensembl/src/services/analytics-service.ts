import ReactGA from 'react-ga';
import { AnalyticsOptions } from 'src/analyticsHelper';

import config from 'config';

const { googleAnalyticsKey } = config;

class AnalyticsTracking {
  private reactGA: typeof ReactGA;

  public constructor() {
    ReactGA.initialize(googleAnalyticsKey, {
      titleCase: false
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
}

const analyticsTracking = new AnalyticsTracking();

export default analyticsTracking;
