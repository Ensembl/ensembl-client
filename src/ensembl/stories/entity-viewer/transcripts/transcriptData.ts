import { fetchGene } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/geneData';
import { fetchTranscript } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Gene } from 'src/content/app/entity-viewer/types/gene';

enum FeatureType {
  Gene = 'Gene',
  Transcript = 'Transcript',
  Unknown = 'Unknown'
}

export const getTranscriptData = async (
  id: string
): Promise<Gene | Transcript | null> => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;
  const data = await fetch(url).then((response) => response.json());

  if (data.object_type === FeatureType.Gene) {
    return fetchGene(id);
  } else if (data.object_type === FeatureType.Transcript) {
    return fetchTranscript(id);
  } else {
    console.error(`${id} is not a valid id`);
    return null;
  }
};
