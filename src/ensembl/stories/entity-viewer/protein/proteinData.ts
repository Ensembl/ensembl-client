import { fetchProtein } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/proteinData';
import { TranslationInResponse } from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';
import { Protein } from 'src/content/app/entity-viewer/types/protein';

enum FeatureType {
  PROTEIN = 'Translation'
}

export const getProteinData = async (id: string): Promise<Protein | null> => {
  const lookupUrl = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;
  const lookupData: TranslationInResponse = await fetch(
    lookupUrl
  ).then((response) => response.json());

  if (lookupData.object_type === FeatureType.PROTEIN) {
    const protein = await fetchProtein(id);

    return protein;
  } else {
    console.error(`${id} is not a valid id`);
    return null;
  }
};
