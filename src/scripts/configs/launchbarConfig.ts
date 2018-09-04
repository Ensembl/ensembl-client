import ensemblIcon from 'assets/img/launchbar/ensembl.svg';
import ensemblSelectedIcon from 'assets/img/launchbar/ensembl-selected.svg';

import searchIcon from 'assets/img/launchbar/search.svg';
import searchSelectedIcon from 'assets/img/launchbar/search-selected.svg';

import speciesSelectorIcon from 'assets/img/launchbar/species-selector.svg';
import speciesSelectorSelectedIcon from 'assets/img/launchbar/species-selector-selected.svg';

import browserIcon from 'assets/img/launchbar/browser.svg';
import browserSelectedIcon from 'assets/img/launchbar/browser-selected.svg';

import blastIcon from 'assets/img/launchbar/blast.svg';
import blastSelectedIcon from 'assets/img/launchbar/blast-selected.svg';

import vepIcon from 'assets/img/launchbar/vep.svg';
import vepSelectedIcon from 'assets/img/launchbar/vep-selected.svg';

import conversionsIcon from 'assets/img/launchbar/conversions.svg';
import conversionsSelectedIcon from 'assets/img/launchbar/conversions-selected.svg';

import ldIcon from 'assets/img/launchbar/ld.svg';
import ldSelectedIcon from 'assets/img/launchbar/ld-selected.svg';

import biomartIcon from 'assets/img/launchbar/biomart.svg';
import biomartSelectedIcon from 'assets/img/launchbar/biomart-selected.svg';

import bulkDownloadIcon from 'assets/img/launchbar/bulk-download.svg';
import bulkDownloadSelectedIcon from 'assets/img/launchbar/bulk-download-selected.svg';

import customDownloadIcon from 'assets/img/launchbar/custom-download.svg';
import customDownloadSelectedIcon from 'assets/img/launchbar/custom-download-selected.svg';

import helpIcon from 'assets/img/launchbar/help.svg';
import helpSelectedIcon from 'assets/img/launchbar/help-selected.svg';

import glossaryIcon from 'assets/img/launchbar/glossary.svg';
import glossarySelectedIcon from 'assets/img/launchbar/glossary-selected.svg';

import newInfoIcon from 'assets/img/launchbar/new-info.svg';
import newInfoSelectedIcon from 'assets/img/launchbar/new-info-selected.svg';

export type LaunchbarApp = {
  description: string,
  icon: {
    default: string,
    selected: string
  },
  name: string
};

export type LaunchbarCategory = {
  apps: LaunchbarApp[],
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
    icon: {
      default: ensemblIcon,
      selected: ensemblSelectedIcon,
    },
    name: 'about'
  },
  categories: [
    {
      apps: [
        {
          description: 'global search',
          icon: {
            default: searchIcon,
            selected: searchSelectedIcon
          },
          name: 'global-search'
        },
        {
          description: 'species selector',
          icon: {
            default: speciesSelectorIcon,
            selected: speciesSelectorSelectedIcon
          },
          name: 'species-selector'
        }
      ],
      name: 'search',
      separator: true,
    },
    {
      apps: [
        {
          description: 'browser',
          icon: {
            default: browserIcon,
            selected: browserSelectedIcon
          },
          name: 'browser'
        }
      ],
      name: 'browsers',
      separator: true,
    },
    {
      apps: [
        {
          description: 'BLAST/BLAT',
          icon: {
            default: blastIcon,
            selected: blastSelectedIcon
          },
          name: 'blast'
        },
        {
          description: 'VEP',
          icon: {
            default: vepIcon,
            selected: vepSelectedIcon
          },
          name: 'vep'
        },
        {
          description: 'Conversions',
          icon: {
            default: conversionsIcon,
            selected: conversionsSelectedIcon
          },
          name: 'conversions'
        },
        {
          description: 'LD calculator',
          icon: {
            default: ldIcon,
            selected: ldSelectedIcon
          },
          name: 'ld'
        },
        {
          description: 'biomart',
          icon: {
            default: biomartIcon,
            selected: biomartSelectedIcon
          },
          name: 'biomart'
        }
      ],
      name: 'tools',
      separator: true
    },
    {
      apps: [
        {
          description: 'bulk download',
          icon: {
            default: bulkDownloadIcon,
            selected: bulkDownloadSelectedIcon
          },
          name: 'bulk-download'
        },
        {
          description: 'custom download',
          icon: {
            default: customDownloadIcon,
            selected: customDownloadSelectedIcon
          },
          name: 'custom-download'
        }
      ],
      name: 'downloads',
      separator: true
    },
    {
      apps: [
        {
          description: 'help and documentation',
          icon: {
            default: helpIcon,
            selected: helpSelectedIcon
          },
          name: 'help-docs'
        },
        {
          description: 'glossary',
          icon: {
            default: glossaryIcon,
            selected: glossarySelectedIcon
          },
          name: 'glossary'
        },
        {
          description: 'what is new and what has changed',
          icon: {
            default: newInfoIcon,
            selected: newInfoSelectedIcon
          },
          name: 'new-info'
        }
      ],
      name: 'learning',
      separator: false,
    },
  ]
};
