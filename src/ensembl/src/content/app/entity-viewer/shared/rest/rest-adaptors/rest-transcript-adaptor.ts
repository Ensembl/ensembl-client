import sortBy from 'lodash/sortBy';

import {
  TranscriptInResponse,
  ExonInResponse,
  FeatureInResponse,
  TranslationInResponse,
  ProteinFeature,
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import {
  Product,
  ProductType,
} from 'src/content/app/entity-viewer/types/product';
import { Strand } from 'src/content/app/entity-viewer/types/strand';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import { CDS } from 'src/content/app/entity-viewer/types/cds';
import { ProteinDomainsResources } from 'src/content/app/entity-viewer/types/product';
import {
  TranscriptInLookupResponse,
  ExonInLookupResponse,
  TranslationInLookupResponse,
} from '../rest-data-fetchers/geneData';

// transform ensembl rest /overlap data into a transcript data structure
export const restTranscriptAdaptor = (
  transcriptId: string,
  data: FeatureInResponse[]
) => {
  const transcript = data.find(
    (feature) => feature.id === transcriptId
  ) as TranscriptInResponse;
  return buildTranscript(transcript, data);
};

const buildProteinDomainsResources = (
  proteinFeatures: ProteinFeature[]
): ProteinDomainsResources => {
  const domainsResources: ProteinDomainsResources = {};

  proteinFeatures.forEach((entry) => {
    const resourceName = entry.type;
    const domainName = entry.description;

    const domain = {
      name: domainName,
      source_uri: '',
      source: {
        name: '',
        uri: '',
      },
      location: {
        start: entry.start,
        end: entry.end,
      },
      score: 0,
    };

    if (!domainsResources[resourceName]) {
      domainsResources[resourceName] = {
        name: resourceName,
        domains: [domain],
      };
    } else {
      domainsResources[resourceName].domains.push(domain);
    }
  });

  return domainsResources;
};

export const buildTranscriptFromLookup = (
  transcript: TranscriptInLookupResponse
) => {
  const exons = transcript.Exon.map((exon) => buildExon(exon, transcript));
  let translation;

  if (transcript.Translation) {
    translation = buildTranslationFromLookup(transcript.Translation);
  }

  return {
    type: 'Transcript',
    id: transcript.id,
    symbol: transcript.display_name,
    so_term: transcript.biotype,
    slice: {
      location: {
        start: transcript.start,
        end: transcript.end,
      },
      region: {
        name: transcript.seq_region_name,
        strand: {
          code: transcript.strand === 1 ? Strand.FORWARD : Strand.REFVERSE,
        },
      },
    },
    exons,
    translation,
  };
};

export const buildTranscript = (
  transcript: TranscriptInResponse,
  data: FeatureInResponse[]
): Transcript => {
  const exons = data
    .filter(
      (feature) =>
        feature.feature_type === 'exon' && feature.Parent === transcript.id
    )
    .map((exon) => buildExon(exon as ExonInResponse, transcript));

  const translationResponse =
    (data[data.length - 1] as TranslationInResponse).object_type ===
    'Translation'
      ? (data[data.length - 1] as TranslationInResponse)
      : null;

  let product;

  if (translationResponse) {
    const protein_domains_resources = buildProteinDomainsResources(
      translationResponse.protein_domains_resources
    );

    product = {
      type: ProductType.PROTEIN,
      length: translationResponse.length,
      protein_domains_resources: protein_domains_resources,
    } as Product;
  }

  const cds = buildCDS(transcript, data);

  return {
    type: 'Transcript',
    id: transcript.id,
    symbol: transcript.external_name,
    so_term: transcript.biotype,
    slice: {
      location: {
        start: transcript.start,
        end: transcript.end,
      },
      region: {
        name: transcript.seq_region_name,
        strand: {
          code: transcript.strand === 1 ? Strand.FORWARD : Strand.REFVERSE,
        },
      },
    },
    exons,
    cds,
    product: product as Product,
  };
};

const buildExon = (
  exon: ExonInResponse | ExonInLookupResponse,
  transcript: TranscriptInResponse | TranscriptInLookupResponse
): Exon => {
  return {
    id: exon.id,
    slice: {
      location: {
        start: exon.start,
        end: exon.end,
      },
    },
    relative_location: {
      start: calculateRelativeLocation(exon.start, transcript.start),
      end: calculateRelativeLocation(exon.end, transcript.start),
    },
  };
};

const buildTranslationFromLookup = (
  translation: TranslationInLookupResponse
) => {
  return {
    id: translation.id,
    length: translation.length,
    start: translation.start,
    end: translation.end,
  };
};

const buildCDS = (
  transcript: TranscriptInResponse,
  data: FeatureInResponse[]
): CDS | null => {
  const cdss = data.filter(
    (feature) =>
      feature.feature_type === 'cds' && feature.Parent === transcript.id
  );

  if (!cdss.length) {
    return null;
  }

  const sortedCdss = sortBy(cdss, (cds) => cds.start);
  const firstCds = sortedCdss[0];
  const lastCds = sortedCdss[cdss.length - 1];

  return {
    start: firstCds.start,
    end: lastCds.end,
    relative_location: {
      start: calculateRelativeLocation(firstCds.start, transcript.start),
      end: calculateRelativeLocation(lastCds.end, transcript.start),
    },
  };
};

const calculateRelativeLocation = (
  featurePosition: number,
  parentPosition: number
) => {
  return featurePosition - parentPosition; // not sure if this is correct
};
