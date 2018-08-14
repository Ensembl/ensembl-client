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

const imgBaseUrl = '/assets/img';

export const launchbarConfig: LaunchbarDetails = {
  categories: [
    {
      name: 'search',
      separator: true,
      apps: [
        {
          name: 'GlobalSearch',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'global search'
        },
        {
          name: 'SpeciesSelector',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
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
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'species browser'
        },
        {
          name: 'CompareBrowser',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'compare browser'
        },
        {
          name: 'SequenceBrowser',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
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
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'BLAST/BLAT'
        },
        {
          name: 'VEP',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'VEP'
        },
        {
          name: 'Conversions',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'Conversions'
        },
        {
          name: 'LD',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
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
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'bulk download'
        },
        {
          name: 'APIDownload',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
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
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'using ensembl'
        },
        {
          name: 'HelpDocs',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'help and documentation'
        },
        {
          name: 'Glossary',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'glossary'
        },
        {
          name: 'NewInfo',
          icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
          description: 'what is new and what has changed'
        }
      ]
    },
  ],
  about: {
    name: 'About',
    icon: `${imgBaseUrl}/launchbar/launchbar_icon_placeholder.png`,
    description: 'about ensembl'
  }
};
