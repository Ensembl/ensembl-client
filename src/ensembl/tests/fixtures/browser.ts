import faker from 'faker';

import { CogList, ChrLocation } from 'src/content/app/browser/browserState';
import { Markup } from 'src/content/app/browser/zmenu/zmenu-types';
import { RegionValidationResponse } from 'src/content/app/browser/browserState';

export const createCogTrackList = (): CogList => ({
  'track:contig': Math.random(),
  'track:gc': Math.random(),
  'track:gene-feat': Math.random(),
  'track:gene-other-fwd': Math.random(),
  'track:gene-other-rev': Math.random(),
  'track:gene-pc-fwd': Math.random(),
  'track:gene-pc-rev': Math.random(),
  'track:variant': Math.random()
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
    track_id: faker.lorem.words()
  }
];

export const createValidationInfo = (): RegionValidationResponse => {
  const randomValue = Math.random();

  return {
    end: {
      error_code: null,
      error_message: null,
      is_valid: true,
      value: randomValue
    },
    genome_id: {
      error_code: null,
      error_message: null,
      is_valid: true,
      value: faker.lorem.words()
    },
    is_parseable: true,
    region: {
      error_code: null,
      error_message: null,
      is_valid: true,
      region_code: 'chromosome',
      region_name: '13'
    },
    region_id: faker.lorem.words(),
    start: {
      error_code: null,
      error_message: null,
      is_valid: true,
      value: randomValue + Math.random()
    }
  };
};

export const createChrLocationValues = () => {
  const region = faker.lorem.words();
  const start = faker.random.number();
  const end = faker.random.number();

  return {
    tuppleValue: [region, start, end] as ChrLocation,
    stringValue: `${region}:${start}-${end}`
  };
};
