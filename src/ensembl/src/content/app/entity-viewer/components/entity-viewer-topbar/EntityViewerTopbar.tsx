import React from 'react';
import { connect } from 'react-redux';

import ScaleSwitcher from './scale-switcher/ScaleSwitcher';
import FeatureSummaryStrip from 'src/shared/components/feature-summary-strip/FeatureSummaryStrip';

import { RootState } from 'src/store';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';
import { getEntityViewerActiveEnsObject } from '../../state/general/entityViewerGeneralSelectors';

import styles from './EntityViewerTopbar.scss';

export type EntityViewerTopbarProps = {
  ensObject: EnsObject | null;
};

export const EntityViewerTopbar = (props: EntityViewerTopbarProps) => {
  return (
    <div className={styles.container}>
      {props.ensObject ? (
        <FeatureSummaryStrip ensObject={props.ensObject} isGhosted={false} />
      ) : null}

      <div className={styles.scaleSwitcher}>
        <ScaleSwitcher />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    ensObject: getEntityViewerActiveEnsObject(state)
  };
};

export default connect(mapStateToProps)(EntityViewerTopbar);
