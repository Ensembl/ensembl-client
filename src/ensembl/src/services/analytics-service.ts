import ReactGA from 'react-ga';

// TODO this needs to be loaded from the config
const googleTrackingID = 'UA-58710484-17';

class AnalyticsTracking {
  reactGA: typeof ReactGA;

  constructor() {
    ReactGA.initialize(googleTrackingID);
    this.reactGA = ReactGA;
  }

  // Track a pageview
  trackPageView(pathToTrack: string) {
    this.reactGA.pageview(pathToTrack);
  }

  // Track an event
  trackEvent(action: any) {
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
