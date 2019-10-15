import faker from 'faker';

import { CogList } from 'src/content/app/browser/browserState';
import { Markup } from 'src/content/app/browser/zmenu/zmenu-types';
import { RegionValidationResponse } from 'src/content/app/browser/browserState';

export const createCogTrackList = (): CogList => ({
  'track:contig': 239,
  'track:gc': 491,
  'track:gene-feat': 50,
  'track:gene-other-fwd': 176,
  'track:gene-other-rev': 365,
  'track:gene-pc-fwd': 113,
  'track:gene-pc-rev': 302,
  'track:variant': 428
});

export const createTrackConfigLabel = () => ({
  'track:contig': true,
  'track:gc': true,
  'track:gene-feat': true,
  'track:gene-other-fwd': true,
  'track:gene-other-rev': true,
  'track:gene-pc-fwd': true,
  'track:gene-pc-rev': true,
  'track:variant': true
});

export const createTrackConfigNames = () => ({
  'track:contig': true,
  'track:gc': true,
  'track:gene-feat': true,
  'track:gene-other-fwd': true,
  'track:gene-other-rev': true,
  'track:gene-pc-fwd': true,
  'track:gene-pc-rev': true,
  'track:variant': true
});

export const createZmenuContent = () => [
  {
    id: faker.lorem.words(),
    lines: [
      [
        [
          { markup: [Markup.LIGHT], text: faker.lorem.words() },
          { markup: [], text: ' ' },
          { markup: [], text: faker.lorem.words() }
        ],
        [{ markup: [Markup.LIGHT, Markup.FOCUS], text: faker.lorem.words() }]
      ]
    ],
    track_id: 'track:gene-feat'
  }
];

export const createValidationInfo = (): RegionValidationResponse => ({
  end: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: 32400266
  },
  genome_id: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: 'homo_sapiens_GCA_000001405_27'
  },
  is_parseable: true,
  region: {
    error_code: null,
    error_message: null,
    is_valid: true,
    region_code: 'chromosome',
    region_name: '13'
  },
  region_id: 'homo_sapiens_GCA_000001405_27:region:13:32315086-32400266',
  start: {
    error_code: null,
    error_message: null,
    is_valid: true,
    value: 32315086
  }
});
