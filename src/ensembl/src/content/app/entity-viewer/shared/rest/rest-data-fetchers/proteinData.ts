import { restProteinAdaptor } from 'src/content/app/entity-viewer/shared/rest/rest-adaptors/rest-protein-adaptor';

import { Protein } from '../../../types/protein';
import { TranslationInResponse } from './transcriptData';

export type ProteinFeature = {
  translation_id: number;
  description: string;
  start: number;
  id: string;
  type: string;
  end: number;
};

export const fetchProtein = async (id: string): Promise<Protein> => {
  const translationUrl = `http://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;
  const proteinFeaturesUrl = `https://rest.ensembl.org/overlap/translation/${id}?feature=protein_feature;content-type=application/json`;
  const [translationResponse, proteinFeaturesResponse] = await Promise.all([
    fetch(translationUrl),
    fetch(proteinFeaturesUrl)
  ]);
  const translationData: TranslationInResponse = await translationResponse.json();
  const proteinFeaturesData: ProteinFeature[] = await proteinFeaturesResponse.json();

  return restProteinAdaptor(translationData, proteinFeaturesData);
};
