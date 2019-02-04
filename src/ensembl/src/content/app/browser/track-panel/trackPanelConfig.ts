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
          color: TrackItemColour.DARK_GREY,
          id: 1,
          label: 'Coding genes',
          name: 'coding-genes'
        },
        {
          color: TrackItemColour.GREY,
          id: 2,
          label: 'Non-coding-genes',
          name: 'non-coding-genes'
        },
        {
          color: TrackItemColour.WHITE,
          id: 3,
          label: 'Psuedogenes',
          name: 'psuedogenes'
        },
        {
          id: 4,
          label: 'Gencode annotation',
          name: 'gencode-annotation'
        },
        {
          id: 5,
          label: 'RefSeq',
          name: 'refseq'
        },
        {
          id: 6,
          label: 'RNASeq',
          name: 'rnaseq'
        }
      ]
    },
    {
      name: 'Assembly',
      trackList: [
        {
          id: 101,
          label: 'Assembly exceptions',
          name: 'assembly-exceptions'
        },
        {
          id: 102,
          label: 'Repeat regions',
          name: 'repeat-regions'
        },
        {
          id: 103,
          label: 'Encoding regions',
          name: 'encoding-regions'
        },
        {
          id: 104,
          label: 'Contigs',
          name: 'contigs'
        },
        {
          id: 105,
          label: 'Tilepath',
          name: 'tilepath'
        },
        {
          id: 106,
          label: 'ABC libraries',
          name: 'abc-libraries'
        }
      ]
    },
    {
      name: 'Experiment design',
      trackList: [
        {
          id: 201,
          label: 'Markers',
          name: 'markers'
        },
        {
          id: 202,
          label: 'Oligo probes',
          name: 'oligo-probes'
        }
      ]
    }
  ],
  main: {
    color: TrackItemColour.BLUE,
    id: 0,
    label: 'BRCA2-201',
    name: 'main'
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
