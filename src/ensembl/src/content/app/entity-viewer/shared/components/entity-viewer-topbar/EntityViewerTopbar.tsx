import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import ScaleSwitcher from './scale-switcher/ScaleSwitcher';
import { GeneSummaryStrip } from 'src/shared/components/feature-summary-strip';

import { Slice } from 'src/content/app/entity-viewer/types/slice';

import styles from './EntityViewerTopbar.scss';

export type EntityViewerTopbarProps = {
  genomeId: string; // We'll need it when we start getting data from Thoas
  entityId: string;
};

const QUERY = gql`
  query Gene($id: String!) {
    gene(byId: { id: $id }) {
      id
      version
      symbol
      biotype
      slice {
        location {
          start
          end
        }
        region {
          strand {
            code
          }
        }
      }
    }
  }
`;

type Gene = {
  id: string;
  version: string;
  symbol: string;
  biotype: string;
  slice: Slice;
};

export const EntityViewerTopbar = (props: EntityViewerTopbarProps) => {
  const entityId = props.entityId.split(':').pop();
  const { data } = useQuery<{ gene: Gene }>(QUERY, {
    variables: { id: entityId }
  });

  return (
    <div className={styles.container}>
      {data ? (
        <GeneSummaryStrip gene={geneToEnsObjectFields(data.gene)} />
      ) : null}

      <div className={styles.scaleSwitcher}>
        <ScaleSwitcher />
      </div>
    </div>
  );
};

// NOTE: temporary adaptor
const geneToEnsObjectFields = (gene: Gene) => {
  return {
    stable_id: gene.id,
    versioned_stable_id: `${gene.id}.${gene.version}`,
    label: gene.symbol,
    bio_type: gene.biotype,
    strand: gene.slice.region.strand.code,
    location: {
      chromosome: gene.slice.region.name,
      start: gene.slice.location.start,
      end: gene.slice.location.end
    }
  };
};

export default EntityViewerTopbar;
