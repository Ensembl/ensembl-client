import { ProteinFeature } from '../rest-data-fetchers/proteinData';
import {
  ProteinDomainsResources,
  ProductType,
  Product
} from 'src/content/app/entity-viewer/types/product';
import { Protein } from 'src/content/app/entity-viewer/types/protein';
import { TranslationInResponse } from '../rest-data-fetchers/transcriptData';

// transform ensembl rest /overlap data into a transcript data structure
export const restProteinAdaptor = (
  translation: TranslationInResponse,
  proteinFeatures: ProteinFeature[]
): Protein => {
  const protein_domains_resources = buildProteinDomainsResources(
    proteinFeatures
  );

  const product: Product = {
    type: ProductType.PROTEIN,
    length: translation.length as number,
    protein_domains_resources
  };

  return {
    transcriptId: translation.Parent,
    product
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
