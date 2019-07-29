import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import { GenomeInfoData } from 'src/genome/genomeTypes';

import { getBrowserActiveGenomeId } from '../../../browserSelectors';
import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import * as urlFor from 'src/shared/helpers/urlHelper';
import { getCommaSeparatedNumber } from 'src/shared/helpers/numberFormatter';

import upperFirst from 'lodash/upperFirst';

import styles from '../TrackPanelModal.scss';

type StateProps = {
  activeGenomeId: string | null;
  genomeInfo: GenomeInfoData;
  exampleEnsObjects: EnsObject[];
};

type DispatchProps = {
  fetchExampleEnsObjects: (objectId: string) => void;
};

type OwnProps = {};

type TrackPanelBookmarksProps = StateProps & DispatchProps & OwnProps;

export const TrackPanelBookmarks = (props: TrackPanelBookmarksProps) => {
  const getExampleObjLabel = (exampleObject: EnsObject) => {
    if (exampleObject.object_type === 'gene') {
      return exampleObject.label;
    } else {
      const { chromosome, start, end } = exampleObject.location;

      return `${chromosome}:${getCommaSeparatedNumber(
        start
      )}:${getCommaSeparatedNumber(end)}`;
    }
  };

  const getPreviouslyViewed = () => {
    return props.exampleEnsObjects.map((exampleObject) => {
      const locationStr = `${exampleObject.location.chromosome}:${exampleObject.location.start}-${exampleObject.location.end}`;
      const path = urlFor.browser({
        genomeId: props.activeGenomeId,
        focus: exampleObject.object_id,
        location: locationStr
      });

      return (
        <dd key={exampleObject.object_id}>
          <Link to={path}>
            {upperFirst(exampleObject.object_type)}:{' '}
            {getExampleObjLabel(exampleObject)}
          </Link>
        </dd>
      );
    });
  };

  return (
    <section className="trackPanelBookmarks">
      <h3>Bookmarks</h3>
      <p>Save multiple browser configurations</p>
      {props.exampleEnsObjects.length ? (
        <dl className={styles.previouslyViewed}>
          <dt>Previously viewed</dt>
          {getPreviouslyViewed()}
        </dl>
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  genomeInfo: getGenomeInfo(state),
  exampleEnsObjects: getExampleEnsObjects(state)
});

const mapDispatchToProps = {
  fetchExampleEnsObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelBookmarks);
