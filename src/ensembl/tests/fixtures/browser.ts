import { CogList } from 'src/content/app/browser/browserState';

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
