import Loadable from 'react-loadable';

export const TrackOne = Loadable({
  loader: () => import('../components/tracks/track-one/TrackOne'),
  loading: () => null
});

export const TrackTwo = Loadable({
  loader: () => import('../components/tracks/track-two/TrackTwo'),
  loading: () => null
});
