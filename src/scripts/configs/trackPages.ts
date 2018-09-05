export type TrackPage = {
  label: string;
  name: string;
};

export type TrackPageList = {
  [key: string]: TrackPage[];
};

export const trackPagesConfig: TrackPageList = {
  'track-one': [
    {
      label: 'Page 1',
      name: 'page-one'
    },
    {
      label: 'Page 2',
      name: 'page-two'
    },
    {
      label: 'Page 3',
      name: 'page-three'
    }
  ],
  'track-two': []
};
