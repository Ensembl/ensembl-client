import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import CheckBoxGrid, {
  getAttributesCount
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import {
  getOrthologueAttributes,
  getOrthologueSearchTerm,
  getOrthologueSpecies
} from 'src/content/app/custom-download/customDownloadSelectors';
import {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  setOrthologueSpecies
} from 'src/content/app/custom-download/customDownloadActions';

import { getMatchedSpeciesList } from './helpers';

import { Input } from 'src/shared';

import styles from './Styles.scss';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Orthologue = (props: Props) => {
  const onChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newOrthologueAttributes = { ...props.orthologueAttributes };

      newOrthologueAttributes[subSection][attributeId].checkedStatus = status;

      props.setOrthologueAttributes(newOrthologueAttributes);
    },
    [props.orthologueAttributes]
  );

  const inputOnChangeHandler = useCallback(
    (searchTerm: string) => {
      props.setOrthologueSearchTerm(searchTerm);
    },
    [props.orthologueSearchTerm]
  );

  useEffect(() => {
    getMatchedSpeciesList(props.orthologueSearchTerm, props);
  }, [props.orthologueSearchTerm]);

  return (
    <div className={styles.orthologues}>
      <div className={styles.filterWrapper}>
        <label>Find</label>
        <Input
          value={props.orthologueSearchTerm}
          onChange={inputOnChangeHandler}
          placeholder={'Species'}
        />
        {props.orthologueSearchTerm.length > 0 && (
          <span>
            <span className={styles.resultCounter}>
              <span>{props.orthologueSpecies.length}</span>
              <span>results</span>
            </span>
            <span className={styles.bestMatchesFilter}>View best matches</span>
            <span className={styles.showAllFilter}>Show all</span>
          </span>
        )}
      </div>

      {!!props.orthologueAttributes && (
        <div>
          <CheckBoxGrid
            checkboxOnChange={onChangeHandler}
            gridData={props.orthologueAttributes}
            hideTitles={props.hideTitles}
            columns={3}
          />
        </div>
      )}
    </div>
  );
};

type DispatchProps = {
  setOrthologueAttributes: (setOrthologueAttributes: {}) => void;
  setOrthologueSearchTerm: (setOrthologueSearchTerm: string) => void;
  setOrthologueSpecies: (setOrthologueSpecies: []) => void;
};

const mapDispatchToProps: DispatchProps = {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  setOrthologueSpecies
};

type StateProps = {
  orthologueAttributes: any;
  orthologueSearchTerm: string;
  orthologueSpecies: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  orthologueAttributes: getOrthologueAttributes(state),
  orthologueSearchTerm: getOrthologueSearchTerm(state),
  orthologueSpecies: getOrthologueSpecies(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orthologue);
