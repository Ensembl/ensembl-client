import {
  fetchGene,
  fetchTranscript
} from 'src/content/app/entity-viewer/rest/rest-data-fetchers/transcriptData';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

enum FeatureType {
  Gene = 'Gene',
  Transcript = 'Transcript',
  Unknown = 'Unknown'
}

export const getTranscriptData = async (
  id: string
): Promise<Gene | Transcript | null> => {
  const featureType = await getFeatureType(id);

  if (featureType === FeatureType.Gene) {
    return fetchGene(id);
  } else if (featureType === FeatureType.Transcript) {
    return fetchTranscript(id);
  } else {
    console.log(`${id} is not a valid id`); // eslint-disable-line no-console
    return null;
  }
};

const getFeatureType = async (id: string) => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;

  const data = await fetch(url).then((response) => response.json());
  return data.object_type;
};
