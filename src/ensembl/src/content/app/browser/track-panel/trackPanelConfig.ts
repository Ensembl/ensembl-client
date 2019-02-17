import eyeOnIcon from 'static/img/track-panel/eye-on.svg';
import eyeOffIcon from 'static/img/track-panel/eye-off.svg';

import ellipsisOnIcon from 'static/img/track-panel/ellipsis-on.svg';
import ellipsisOffIcon from 'static/img/track-panel/ellipsis-off.svg';

enum TrackItemColour {
  BLUE = 'blue',
  DARK_GREY = 'darkGrey',
  GREY = 'grey',
  WHITE = 'white'
}

export type TrackPanelItem = {
  additionalInfo?: {
    other: string;
    selected?: string;
  };
  childTrackList?: TrackPanelItem[];
  color?: string;
  id: number;
  label: string;
  name: string;
};

export type TrackPanelCategory = {
  name: string;
  trackList: TrackPanelItem[];
};

export type TrackPanelIcon = {
  description: string;
  icon: {
    off: string;
    on: string;
  };
};

export type TrackPanelIcons = {
  [key: string]: TrackPanelIcon;
};

export type TrackPanelConfig = {
  main: TrackPanelItem;
  categories: TrackPanelCategory[];
};

export const trackPanelConfig: TrackPanelConfig = {
  categories: [
    {
      name: 'Genes & transcripts',
      trackList: [
        {
          additionalInfo: {
            other: 'Forward strand'
          },
          color: TrackItemColour.DARK_GREY,
          id: 1,
          label: 'Protein coding genes',
          name: 'gene-pc'
        },
        {
          additionalInfo: {
            other: 'Forward strand'
          },
          color: TrackItemColour.GREY,
          id: 2,
          label: 'Other genes',
          name: 'gene-other'
        },
        {
          additionalInfo: {
            other: 'Reverse strand'
          },
          color: TrackItemColour.DARK_GREY,
          id: 3,
          label: 'Protein coding genes',
          name: 'gene-pc-reverse'
        },
        {
          additionalInfo: {
            other: 'Reverse strand'
          },
          color: TrackItemColour.GREY,
          id: 4,
          label: 'Other genes',
          name: 'gene-other-reverse'
        }
      ]
    },
    {
      name: 'Assembly',
      trackList: [
        {
          id: 101,
          label: 'Contigs',
          name: 'contig'
        },
        {
          id: 102,
          label: '%GC',
          name: 'gc'
        }
      ]
    },
    {
      name: 'Comparative genomics',
      trackList: []
    },
    {
      name: 'Experiment design',
      trackList: []
    },
    {
      name: 'References & evidence',
      trackList: []
    }
  ],
  main: {
    additionalInfo: {
      other: 'Protein coding',
      selected: 'MANE Select'
    },
    childTrackList: [
      {
        color: TrackItemColour.BLUE,
        id: 0.1,
        label: 'ENST00000380152.7',
        name: 'transcript'
      }
    ],
    id: 0,
    label: 'BRCA2',
    name: 'gene'
  }
};

export const trackPanelIconConfig: TrackPanelIcons = {
  ellipsis: {
    description: 'open track',
    icon: {
      off: ellipsisOffIcon,
      on: ellipsisOnIcon
    }
  },
  eye: {
    description: 'enable/disable track',
    icon: {
      off: eyeOffIcon,
      on: eyeOnIcon
    }
  }
};
