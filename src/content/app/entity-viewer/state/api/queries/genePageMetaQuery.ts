import { gql } from 'graphql-request';

export const genePageMetaQuery = gql`
  query GenePageMeta($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      symbol
    }
  }
`;


export type GenePageMetaQueryResult = {
  gene: {
    stable_id: string;
    symbol: string;
  };
};


/**
 * TODO in the future:
 * - Add information for page description meta tag
 * - Add information for a bioschema
 *   - see https://bioschemas.org/profiles/Gene/1.0-RELEASE
 *   - see also an `application/ld+json` script on current Ensembl gene page
*/

export type GenePageMeta = {
  title: string;
};