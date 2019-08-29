import React, { FunctionComponent, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootState } from 'src/store';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import upperFirst from 'lodash/upperFirst';
import { getRegionValidationInfo } from '../browserSelectors';

import * as urlFor from 'src/shared/helpers/urlHelper';

import styles from '../Browser.scss';

type StateProps = {
  regionValidationInfo: any;
  exampleEnsObjects: EnsObject[];
};

type OwnProps = {
  focus: string;
};

export type BrowserHomeProps = StateProps & OwnProps;

export const BrowserHome: FunctionComponent<BrowserHomeProps> = (
  props: BrowserHomeProps
) => {

  if(!props.regionValidationInfo.genome_id || props.regionValidationInfo.status === 'loading'){
    return null;
  }

  if(!props.regionValidationInfo.genome_id.is_valid){
    return <h2>Genome ID is invalid.</h2>;
  }

  if(!props.regionValidationInfo.region.is_valid){
    return <ExampleObjectLinks {...props} />
  }

  if(props.regionValidationInfo.status === 'error'){
    return <h1>Oops! Something went wrong with the URL...</h1>;
  }
  
  return null;
};

const ExampleObjectLinks = (props: BrowserHomeProps) => {
  const { exampleEnsObjects } = props;

  const links = exampleEnsObjects.map((exampleObject: EnsObject) => {
    const path = urlFor.browser({
      genomeId: exampleObject.genome_id,
      focus: exampleObject.object_id
    });

    return (
      <div key={exampleObject.object_id} className={styles.exampleLink}>
        <Link to={path}>
          <span className={styles.objectType}>
            {upperFirst(exampleObject.object_type)}
          </span>
          <span className={styles.objectLabel}>{exampleObject.label}</span>
        </Link>
      </div>
    );
  });

  return <div className={styles.exampleLinks}>{links}</div>;
};

const mapStateToProps = (state: RootState): StateProps => ({
  regionValidationInfo: getRegionValidationInfo(state),
  exampleEnsObjects: getExampleEnsObjects(state)
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserHome);
