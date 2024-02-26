import { gql } from 'graphql-request';

import type { VariantPredictedMolecularConsequence } from 'src/shared/types/variation-api/variantPredictedMolecularConsequence';


// FIXME: the string value of the consequence for a given allele in a given transcript
// is currently erronously returned in the `accession_id` field of the consequence structure.
// It should be changed from `accession_id` to `value` very soon.
// Once that is done, delete the accession_id field from the query.
export const variantPredictedMolecularConsequencesQuery = gql`
  query VariantPredictedMolecularConsequences($genomeId: String!, $variantId: String!) {
    variant(by_id: { genome_id: $genomeId, variant_id: $variantId }) {
      alleles {
        predicted_molecular_consequences {
          feature_stable_id
          consequences {
            accession_id
            value
          }
        }
      }
    }
  }
`;

type PredictedMolecularConsequenceInResponse = Pick<VariantPredictedMolecularConsequence, 'feature_stable_id' | 'consequences'>;

type VariantAlleleInResponse = {
  urlId: string;
  predicted_molecular_consequences: PredictedMolecularConsequenceInResponse[];
};

type VariantInResponse = {
  alleles: VariantAlleleInResponse[];
};

export type VariantPredictedMolecularConsequencesResponse = {
  variant: VariantInResponse
};
