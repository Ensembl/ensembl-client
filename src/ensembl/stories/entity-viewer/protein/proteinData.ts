import { fetchProtein } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';
import {
  TranslationInResponse,
  fetchTranscript
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';
import { Protein } from 'src/content/app/entity-viewer/types/protein';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

enum FeatureType {
  PROTEIN = 'Translation'
}

export type ProteinData = {
  transcript: Transcript;
  protein: Protein;
};

export const getProteinData = async (
  id: string
): Promise<ProteinData | null> => {
  const lookupUrl = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;
  const lookupData: TranslationInResponse = await fetch(
    lookupUrl
  ).then((response) => response.json());

  if (lookupData.object_type === FeatureType.PROTEIN) {
    const transcript = await fetchTranscript(lookupData.Parent);
    const protein = await fetchProtein(id);

    return { transcript, protein };
  } else {
    console.error(`${id} is not a valid id`);
    return null;
  }
};
