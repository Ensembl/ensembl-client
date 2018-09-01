import launchbarIcon from 'assets/img/launchbar/launchbar_icon_placeholder.png';

export type LaunchbarApp = {
  description: string,
  icon: string,
  id: number,
  name: string
};

export type LaunchbarCategory = {
  apps: LaunchbarApp[],
  id: number,
  name: string,
  separator: boolean
};

export type LaunchbarDetails = {
  about: LaunchbarApp,
  categories: LaunchbarCategory[]
};

export const launchbarConfig: LaunchbarDetails = {
  about: {
    description: 'about ensembl',
    icon: launchbarIcon,
    id: 16,
    name: 'About'
  },
  categories: [
    {
      apps: [
        {
          description: 'global search',
          icon: launchbarIcon,
          id: 1,
          name: 'GlobalSearch'
        },
        {
          description: 'species selector',
          icon: launchbarIcon,
          id: 2,
          name: 'SpeciesSelector'
        }
      ],
      id: 1,
      name: 'search',
      separator: true,
    },
    {
      apps: [
        {
          description: 'species browser',
          icon: launchbarIcon,
          id: 3,
          name: 'SpeciesBrowser'
        },
        {
          description: 'compare browser',
          icon: launchbarIcon,
          id: 4,
          name: 'CompareBrowser',
        },
        {
          description: 'sequence browser',
          icon: launchbarIcon,
          id: 5,
          name: 'SequenceBrowser'
        }
      ],
      id: 2,
      name: 'browsers',
      separator: true,
    },
    {
      apps: [
        {
          description: 'BLAST/BLAT',
          icon: launchbarIcon,
          id: 6,
          name: 'Blast'
        },
        {
          description: 'VEP',
          icon: launchbarIcon,
          id: 7,
          name: 'VEP'
        },
        {
          description: 'Conversions',
          icon: launchbarIcon,
          id: 8,
          name: 'Conversions'
        },
        {
          description: 'LD calculator',
          icon: launchbarIcon,
          id: 9,
          name: 'LD'
        }
      ],
      id: 3,
      name: 'tools',
      separator: true
    },
    {
      apps: [
        {
          description: 'bulk download',
          icon: launchbarIcon,
          id: 10,
          name: 'BulkDownload'
        },
        {
          description: 'APIs download',
          icon: launchbarIcon,
          id: 11,
          name: 'APIDownload'
        }
      ],
      id: 4,
      name: 'downloads',
      separator: true
    },
    {
      apps: [
        {
          description: 'using ensembl',
          icon: launchbarIcon,
          id: 12,
          name: 'EnsemblHelp',
        },
        {
          description: 'help and documentation',
          icon: launchbarIcon,
          id: 13,
          name: 'HelpDocs'
        },
        {
          description: 'glossary',
          icon: launchbarIcon,
          id: 14,
          name: 'Glossary'
        },
        {
          description: 'what is new and what has changed',
          icon: launchbarIcon,
          id: 15,
          name: 'NewInfo'
        }
      ],
      id: 5,
      name: 'learning',
      separator: false,
    },
  ]
};
