export type TrackPage = {
  name: string,
  label: string
};

export type TrackPageList = {
  [key: string]: TrackPage[]
};

export const trackPagesConfig: TrackPageList = {
  'track-one': [
    {
      name: 'page-one',
      label: 'Page 1'
    },
    {
      name: 'page-two',
      label: 'Page 2'
    },
    {
      name: 'page-three',
      label: 'Page 3'
    }
  ],
  'track-two': []
};