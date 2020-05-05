import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import * as urlHelper from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { getEntityViewerActiveGenomeId } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';

import { RootState } from 'src/store';
import { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';

import styles from './ExampleLinks.scss';

type ExampleGene = {
  id: string;
  symbol: string;
};

type ExampleLinksProps = {
  activeGenomeId: string | null;
  exampleEntities: ExampleFocusObject[]
};

const QUERY = gql`
  query Gene($id: String!) {
    gene(byId: { id: $id }) {
      id
      symbol
    }
  }`;

// NOTE: the component currently handles only example gene
const ExampleLinks = (props: ExampleLinksProps) => {
  const exampleGeneId = props.exampleEntities.find(({ type }) => type === 'gene')?.id;
  const { loading, data } = useQuery<{ gene: ExampleGene }>(QUERY, {
    variables: { id: exampleGeneId },
    skip: !exampleGeneId
  });

  if (!data) {
    return null;
  }

  const featureIdInUrl = buildFocusIdForUrl({ type: 'gene', objectId: data.gene.id });
  const path = urlHelper.entityViewer({
    genomeId: props.activeGenomeId,
    entityId: featureIdInUrl
  });

  return (
    <div>
      <div className={styles.exampleLinks__emptyTopbar} />
      <div className={styles.exampleLinks}>
        <Link to={path}>
          <span className={styles.exampleLinks__label}>Gene</span>
          <span>{data.gene.symbol}</span>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const exampleEntities = activeGenomeId
    ? getGenomeExampleFocusObjects(state, activeGenomeId)
    : []
  return {
    activeGenomeId,
    exampleEntities
  };
};

export default connect(mapStateToProps)(ExampleLinks);
