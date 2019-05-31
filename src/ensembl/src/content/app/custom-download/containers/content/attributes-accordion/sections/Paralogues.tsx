import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import CheckBoxGrid, {
  getAttributesCount
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import {
  getOrthologueAttributes,
  getOrthologueSearchTerm,
  getOrthologueSpecies,
  getOrthologueFilteredSpecies,
  getOrthologueShowBestMatches,
  getOrthologueShowAll,
  getOrthologueApplyToAllSpecies
} from '../attributesAccordionSelector';

import {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  setOrthologueSpecies,
  setOrthologueFilteredSpecies,
  setOrthologueShowBestMatches,
  setOrthologueShowAll,
  setOrthologueApplyToAllSpecies
} from '../attributesAccordionActions';

import { getMatchedSpeciesList } from './helpers';

import Input from 'src/shared/input/Input';

import styles from './Styles.scss';

import { orthologueAttributes } from 'src/content/app/custom-download/sampledata.tsx';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Orthologue = (props: Props) => {
  const attributesOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newOrthologueAttributes = { ...props.orthologueAttributes };

      newOrthologueAttributes[subSection][attributeId].checkedStatus = status;

      props.setOrthologueAttributes(newOrthologueAttributes);
    },
    [props.orthologueAttributes]
  );

  const speciesOnChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newOrthologueFilteredSpecies = {
        ...props.orthologueFilteredSpecies
      };

      newOrthologueFilteredSpecies[subSection][
        attributeId
      ].checkedStatus = status;

      props.setOrthologueFilteredSpecies(newOrthologueFilteredSpecies);

      const newOrthologueAttributes = { ...props.orthologueAttributes };
      const sectionHeader =
        props.orthologueFilteredSpecies.default[attributeId].label;

      if (status) {
        newOrthologueAttributes[sectionHeader] = JSON.parse(
          JSON.stringify(orthologueAttributes)
        );
      } else {
        delete newOrthologueAttributes[sectionHeader];
      }

      props.setOrthologueAttributes(newOrthologueAttributes);
    },
    [props.orthologueFilteredSpecies, props.orthologueAttributes]
  );

  const inputOnChangeHandler = useCallback(
    (searchTerm: string) => {
      props.setOrthologueSearchTerm(searchTerm);
    },
    [props.orthologueSearchTerm]
  );

  useEffect(() => {
    getMatchedSpeciesList(props.orthologueSearchTerm, props);
  }, [
    props.orthologueSearchTerm,
    props.shouldShowBestMatches,
    props.shouldShowAll
  ]);

  const showBestMatches = useCallback(() => {
    props.setOrthologueShowBestMatches(!props.shouldShowBestMatches);
  }, [props.shouldShowBestMatches, props.orthologueFilteredSpecies]);

  const showAll = useCallback(() => {
    props.setOrthologueShowAll(!props.shouldShowAll);
  }, [props.shouldShowAll, props.orthologueFilteredSpecies]);

  const getResultCounter = () => {
    if (props.shouldShowBestMatches || props.shouldShowAll) {
      return (
        <>
          <span>{getAttributesCount(props.orthologueFilteredSpecies)}/</span>
          <span>{props.orthologueSpecies.length}</span>
          <span>results</span>
        </>
      );
    }

    return (
      <>
        <span>{props.orthologueSpecies.length}</span>
        <span>results</span>
      </>
    );
  };

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
            <span className={styles.resultCounter}>{getResultCounter()}</span>
            <span
              className={styles.bestMatchesFilter}
              onClick={showBestMatches}
            >
              {props.shouldShowBestMatches
                ? 'Hide best matches'
                : 'View best matches'}
            </span>
            <span className={styles.showAllFilter} onClick={showAll}>
              {props.shouldShowAll ? 'Hide all' : 'Show all'}
            </span>
          </span>
        )}
      </div>

      {!!props.orthologueFilteredSpecies && (
        <div className={styles.paralogueSearchResult}>
          <CheckBoxGrid
            checkboxOnChange={speciesOnChangeHandler}
            gridData={props.orthologueFilteredSpecies}
            hideTitles={props.hideTitles}
            columns={3}
          />
        </div>
      )}

      {!!props.orthologueAttributes &&
        Object.keys(props.orthologueAttributes).map(
          (species: string, key: number) => {
            return (
              <div key={key}>
                <div className={styles.speciesAttributesSectionTitle}>
                  <span>{species}</span>
                </div>
                <CheckBoxGrid
                  checkboxOnChange={attributesOnChangeHandler}
                  gridData={{ [species]: props.orthologueAttributes[species] }}
                  hideTitles={true}
                  columns={3}
                />
              </div>
            );
          }
        )}
    </div>
  );
};

type DispatchProps = {
  setOrthologueAttributes: (setOrthologueAttributes: {}) => void;
  setOrthologueSearchTerm: (setOrthologueSearchTerm: string) => void;
  setOrthologueSpecies: (setOrthologueSpecies: []) => void;
  setOrthologueFilteredSpecies: (setOrthologueFilteredSpecies: {}) => void;
  setOrthologueShowBestMatches: (setOrthologueShowBestMatches: boolean) => void;
  setOrthologueShowAll: (setOrthologueShowAll: boolean) => void;
  setOrthologueApplyToAllSpecies: (
    setOrthologueApplyToAllSpecies: boolean
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  setOrthologueSpecies,
  setOrthologueFilteredSpecies,
  setOrthologueShowBestMatches,
  setOrthologueShowAll,
  setOrthologueApplyToAllSpecies
};

type StateProps = {
  orthologueAttributes: any;
  orthologueSearchTerm: string;
  orthologueSpecies: any;
  orthologueFilteredSpecies: any;
  shouldShowBestMatches: boolean;
  shouldShowAll: boolean;
  shouldApplyToAllSpecies: boolean;
};

const mapStateToProps = (state: RootState): StateProps => ({
  orthologueAttributes: getOrthologueAttributes(state),
  orthologueSearchTerm: getOrthologueSearchTerm(state),
  orthologueSpecies: getOrthologueSpecies(state),
  orthologueFilteredSpecies: getOrthologueFilteredSpecies(state),
  shouldShowBestMatches: getOrthologueShowBestMatches(state),
  shouldShowAll: getOrthologueShowAll(state),
  shouldApplyToAllSpecies: getOrthologueApplyToAllSpecies(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orthologue);
