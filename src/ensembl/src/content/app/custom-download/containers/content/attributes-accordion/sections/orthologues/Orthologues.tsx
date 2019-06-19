import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import CheckboxGrid, {
  getAttributesCount
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import {
  getOrthologueAttributes,
  getOrthologueSearchTerm,
  getOrthologueSpecies,
  getOrthologueShowBestMatches,
  getOrthologueShowAll,
  getOrthologueApplyToAllSpecies
} from '../../state/attributesAccordionSelector';

import {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  fetchOrthologueSpecies,
  setOrthologueSpecies,
  setOrthologueShowBestMatches,
  setOrthologueShowAll,
  setOrthologueApplyToAllSpecies
} from '../../state/attributesAccordionActions';

import Input from 'src/shared/input/Input';

import styles from './Orthologues.scss';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

import { orthologueAttributes } from 'src/content/app/custom-download/sampledata.tsx';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Orthologue = (props: Props) => {
  const attributesOnChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    const newOrthologueAttributes = { ...props.orthologueAttributes };

    newOrthologueAttributes[subSection][attributeId].isChecked = status;

    props.setOrthologueAttributes(newOrthologueAttributes);
  };

  const speciesOnChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    const newOrthologueFilteredSpecies = {
      ...props.orthologueSpecies
    };

    newOrthologueFilteredSpecies[subSection][attributeId].isChecked = status;

    props.setOrthologueSpecies(newOrthologueFilteredSpecies);

    const newOrthologueAttributes = { ...props.orthologueAttributes };
    const sectionHeader = props.orthologueSpecies.default[attributeId].label;

    if (status) {
      newOrthologueAttributes[sectionHeader] = JSON.parse(
        JSON.stringify(orthologueAttributes)
      );
    } else {
      delete newOrthologueAttributes[sectionHeader];
    }

    props.setOrthologueAttributes(newOrthologueAttributes);
  };

  const inputOnChangeHandler = useCallback(
    (searchTerm: string) => {
      props.setOrthologueSearchTerm(searchTerm);
      props.fetchOrthologueSpecies(searchTerm, props.orthologueSpecies);
    },
    [props.orthologueSearchTerm, props.orthologueSpecies]
  );

  const getResultCounter = () => {
    const totalSpecies = getAttributesCount(props.orthologueSpecies);
    return (
      <>
        <span>{totalSpecies ? totalSpecies : 0}</span>
        <span> result{totalSpecies > 1 ? 's' : ''}</span>
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
          </span>
        )}
      </div>

      {!!props.orthologueSpecies && (
        <div>
          <CheckboxGrid
            checkboxOnChange={speciesOnChangeHandler}
            gridData={props.orthologueSpecies}
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
                <CheckboxGrid
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
  setOrthologueAttributes: (setOrthologueAttributes: AttributesSection) => void;
  setOrthologueSearchTerm: (setOrthologueSearchTerm: string) => void;
  setOrthologueSpecies: (setOrthologueSpecies: any) => void;
  fetchOrthologueSpecies: (searchTerm: string, orthologueSpecies: any) => void;
  setOrthologueShowBestMatches: (setOrthologueShowBestMatches: boolean) => void;
  setOrthologueShowAll: (setOrthologueShowAll: boolean) => void;
  setOrthologueApplyToAllSpecies: (
    setOrthologueApplyToAllSpecies: boolean
  ) => void;
};

const mapDispatchToProps: DispatchProps = {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  setOrthologueSpecies: setOrthologueSpecies.success,
  fetchOrthologueSpecies,
  setOrthologueShowBestMatches,
  setOrthologueShowAll,
  setOrthologueApplyToAllSpecies
};

type StateProps = {
  orthologueAttributes: AttributesSection;
  orthologueSearchTerm: string;
  orthologueSpecies: any;
  shouldShowBestMatches: boolean;
  shouldShowAll: boolean;
  shouldApplyToAllSpecies: boolean;
};

const mapStateToProps = (state: RootState): StateProps => ({
  orthologueAttributes: getOrthologueAttributes(state),
  orthologueSearchTerm: getOrthologueSearchTerm(state),
  orthologueSpecies: getOrthologueSpecies(state),
  shouldShowBestMatches: getOrthologueShowBestMatches(state),
  shouldShowAll: getOrthologueShowAll(state),
  shouldApplyToAllSpecies: getOrthologueApplyToAllSpecies(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orthologue);
