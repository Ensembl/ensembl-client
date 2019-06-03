import windowService from 'src/services/window-service';

// FIXME: this should be moved to a file with general functions
export const ensureAbsoluteUrl = (url: string) => {
  if (typeof window === 'undefined') {
    // this helper only makes sense for client-side rendering
    return url;
  }
  const location = windowService.getLocation();

  return /^https?/.test(url)
    ? url
    : `${location.protocol}//${location.host}${url}`;
};
