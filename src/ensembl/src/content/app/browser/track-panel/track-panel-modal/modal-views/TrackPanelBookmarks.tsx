import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { GenomeInfo } from 'src/genome/genomeTypes';

import { getBrowserActiveGenomeId } from '../../../browserSelectors';
import {
  getGenomeExampleEnsObjects,
  getGenomeInfo
} from 'src/genome/genomeSelectors';
import { fetchGenomeExampleEnsObjects } from 'src/genome/genomeActions';
import * as urlFor from 'src/shared/helpers/urlHelper';

import styles from '../TrackPanelModal.scss';

type StateProps = {
  activeGenomeId: string;
  genomeInfo: GenomeInfo;
  genomeExampleEnsObjects: EnsObject[];
};

type DispatchProps = {
  fetchGenomeExampleEnsObjects: (genomeId: string) => void;
};

type OwnProps = {};

type TrackPanelBookmarksProps = StateProps & DispatchProps & OwnProps;

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  useEffect(() => {
    const {
      activeGenomeId,
      genomeExampleEnsObjects,
      fetchGenomeExampleEnsObjects
    } = props;

    if (
      genomeExampleEnsObjects.length === 0 ||
      genomeExampleEnsObjects[0].genome_id !== activeGenomeId
    ) {
      fetchGenomeExampleEnsObjects(activeGenomeId);
    }
  }, []);

  const getExampleObjectNode = (exampleObject: EnsObject) => {
    const { ensembl_object_id, label, location } = exampleObject;
    const locationStr = `${location.chromosome}:${location.start}-${location.end}`;
    const path = urlFor.browser(
      props.activeGenomeId,
      ensembl_object_id,
      locationStr
    );

    return (
      <dd key={ensembl_object_id}>
        <Link to={path}>
          {props.genomeInfo.common_name} {label}
        </Link>
      </dd>
    );
  };

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      <p>Save multiple browser configurations</p>
      <p>Not ready yet &hellip;</p>
      {props.genomeExampleEnsObjects.length ? (
        <dl className={styles.previouslyViewed}>
          <dt>Previously viewed</dt>
          {props.genomeExampleEnsObjects.map((exampleObject) =>
            getExampleObjectNode(exampleObject)
          )}
        </dl>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  genomeInfo: getGenomeInfo(state),
  genomeExampleEnsObjects: getGenomeExampleEnsObjects(state)
});

const mapDispatchToProps = {
  fetchGenomeExampleEnsObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
