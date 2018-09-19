import Loadable from 'react-loadable';

export type TrackComponent = (React.ComponentClass<{}, any> & Loadable.LoadableComponent) | (React.StatelessComponent<{}> & Loadable.LoadableComponent);

export const TrackOne = Loadable({
  loader: () => import('../components/tracks/track-one/TrackOne'),
  loading: () => null
});

export const TrackTwo = Loadable({
  loader: () => import('../components/tracks/track-two/TrackTwo'),
  loading: () => null
});
