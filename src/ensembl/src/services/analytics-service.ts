import ReactGA from 'react-ga';

const googleTrackingID = process.env.GOOGLE_ANALYTICS_KEY
  ? process.env.GOOGLE_ANALYTICS_KEY
  : '';

class AnalyticsTracking {
  private reactGA: typeof ReactGA;

  constructor() {
    ReactGA.initialize(googleTrackingID);
    this.reactGA = ReactGA;
  }

  // Track a pageview
  public trackPageView(pathToTrack: string) {
    this.reactGA.pageview(pathToTrack);
  }

  // Track an event
  public trackEvent(action: any) {
    this.reactGA.event({
      action: action.meta.ga.action ? action.meta.ga.action : action.type,
      category: action.meta.ga.category,
      label: action.meta.ga.label,
      value: action.meta.ga.value,
      nonInteraction: action.meta.ga.nonInteraction
    });
  }
}

const GoogleAnalyticsTracking = new AnalyticsTracking();

export default GoogleAnalyticsTracking;
