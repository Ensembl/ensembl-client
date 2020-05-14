import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { CDS } from 'src/content/app/entity-viewer/types/cds';
import { Strand } from 'src/content/app/entity-viewer/types/strand';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import {
  TranscriptInResponse,
  ExonInResponse,
  TranslationInResponse,
  ProteinFeature
} from '../rest-data-fetchers/transcriptData';
import {
  ProductType,
  Product,
  ProteinDomainsResources
} from 'src/content/app/entity-viewer/types/product';

export const restTranscriptAdaptor = (
  transcript: TranscriptInResponse,
  proteinFeatures?: ProteinFeature[]
): Transcript => {
  const exons = transcript.Exon.map((exon) => buildExon(exon, transcript));
  let cds = null;
  let product = null;

  if (transcript.Translation) {
    cds = buildCDSFromLookup(transcript.Translation, transcript);

    if (proteinFeatures) {
      product = buildProduct(transcript.Translation, proteinFeatures);
    }
  }

  return {
    type: 'Transcript',
    id: transcript.id,
    symbol: transcript.display_name,
    so_term: transcript.biotype,
    slice: {
      location: {
        start: transcript.start,
        end: transcript.end
      },
      region: {
        name: transcript.seq_region_name,
        strand: {
          code: transcript.strand === 1 ? Strand.FORWARD : Strand.REFVERSE
        }
      }
    },
    exons,
    cds,
    product
  };
};

const buildExon = (
  exon: ExonInResponse,
  transcript: TranscriptInResponse
): Exon => {
  return {
    id: exon.id,
    slice: {
      location: {
        start: exon.start,
        end: exon.end
      }
    },
    relative_location: {
      start: calculateRelativeLocation(exon.start, transcript.start),
      end: calculateRelativeLocation(exon.end, transcript.start)
    }
  };
};

const buildCDSFromLookup = (
  translation: TranslationInResponse,
  transcript: TranscriptInResponse
): CDS => {
  return {
    protein_length: translation.length,
    start: translation.start,
    end: translation.end,
    relative_location: {
      start: calculateRelativeLocation(translation.start, transcript.start),
      end: calculateRelativeLocation(translation.end, transcript.start)
    }
  };
};

const calculateRelativeLocation = (
  featurePosition: number,
  parentPosition: number
) => {
  return featurePosition - parentPosition; // not sure if this is correct
};

// transform ensembl rest /overlap data into a transcript data structure
export const buildProduct = (
  translation: TranslationInResponse,
  proteinFeatures: ProteinFeature[]
): Product => {
  const protein_domains_resources = buildProteinDomainsResources(
    proteinFeatures
  );

  return {
    type: ProductType.PROTEIN,
    stable_id: translation.id,
    length: translation.length,
    protein_domains_resources
  };
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
        uri: ''
      },
      location: {
        start: entry.start,
        end: entry.end
      },
      score: 0
    };

    if (!domainsResources[resourceName]) {
      domainsResources[resourceName] = {
        name: resourceName,
        domains: [domain]
      };
    } else {
      domainsResources[resourceName].domains.push(domain);
    }
  });

  return domainsResources;
};
