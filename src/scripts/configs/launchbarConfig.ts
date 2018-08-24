export type LaunchbarApp = {
  name: string,
  icon: string,
  description: string
};

export type LaunchbarCategory = {
  name: string,
  separator: boolean,
  apps: Array<LaunchbarApp>
};

export type LaunchbarDetails = {
  categories: Array<LaunchbarCategory>,
  about: LaunchbarApp
};

const launchbarIcon = require('assets/img/launchbar/launchbar_icon_placeholder.png');

export const launchbarConfig: LaunchbarDetails = {
  categories: [
    {
      name: 'search',
      separator: true,
      apps: [
        {
          name: 'GlobalSearch',
          icon: launchbarIcon,
          description: 'global search'
        },
        {
          name: 'SpeciesSelector',
          icon: launchbarIcon,
          description: 'species selector'
        }
      ]
    },
    {
      name: 'browsers',
      separator: true,
      apps: [
        {
          name: 'SpeciesBrowser',
          icon: launchbarIcon,
          description: 'species browser'
        },
        {
          name: 'CompareBrowser',
          icon: launchbarIcon,
          description: 'compare browser'
        },
        {
          name: 'SequenceBrowser',
          icon: launchbarIcon,
          description: 'sequence browser'
        }
      ]
    },
    {
      name: 'tools',
      separator: true,
      apps: [
        {
          name: 'Blast',
          icon: launchbarIcon,
          description: 'BLAST/BLAT'
        },
        {
          name: 'VEP',
          icon: launchbarIcon,
          description: 'VEP'
        },
        {
          name: 'Conversions',
          icon: launchbarIcon,
          description: 'Conversions'
        },
        {
          name: 'LD',
          icon: launchbarIcon,
          description: 'LD calculator'
        }
      ]
    },
    {
      name: 'downloads',
      separator: true,
      apps: [
        {
          name: 'BulkDownload',
          icon: launchbarIcon,
          description: 'bulk download'
        },
        {
          name: 'APIDownload',
          icon: launchbarIcon,
          description: 'APIs download'
        }
      ]
    },
    {
      name: 'learning',
      separator: false,
      apps: [
        {
          name: 'EnsemblHelp',
          icon: launchbarIcon,
          description: 'using ensembl'
        },
        {
          name: 'HelpDocs',
          icon: launchbarIcon,
          description: 'help and documentation'
        },
        {
          name: 'Glossary',
          icon: launchbarIcon,
          description: 'glossary'
        },
        {
          name: 'NewInfo',
          icon: launchbarIcon,
          description: 'what is new and what has changed'
        }
      ]
    },
  ],
  about: {
    name: 'About',
    icon: launchbarIcon,
    description: 'about ensembl'
  }
};
