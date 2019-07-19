import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import CheckboxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import findIndex from 'lodash/findIndex';

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

import Attribute, {
  Attributes
} from 'src/content/app/custom-download/types/Attributes';

import { orthologueAttributes } from 'src/content/app/custom-download/sample-data/orthologue';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Orthologue = (props: Props) => {
  const attributesOnChangeHandler = (
    status: boolean,
    species: string,
    attributeId: string
  ) => {
    const newOrthologueAttributes: any = { ...props.orthologueAttributes };

    const modifiedSpeciesIndex = findIndex(
      newOrthologueAttributes[species].options,
      (attribute: Attribute) => {
        return attribute.id === attributeId;
      }
    );

    newOrthologueAttributes[species].options[
      modifiedSpeciesIndex
    ].isChecked = status;

    props.setOrthologueAttributes(newOrthologueAttributes);
  };

  const speciesOnChangeHandler = (status: boolean, attributeId: string) => {
    const newOrthologueFilteredSpecies = [...props.orthologueSpecies];

    const modifiedSpeciesIndex = findIndex(
      newOrthologueFilteredSpecies,
      (species) => {
        return species.id === attributeId;
      }
    );

    const displayName =
      newOrthologueFilteredSpecies[modifiedSpeciesIndex].label;

    newOrthologueFilteredSpecies[modifiedSpeciesIndex].isChecked = status;

    props.setOrthologueSpecies(newOrthologueFilteredSpecies);

    const newOrthologueAttributes: any = { ...props.orthologueAttributes };

    if (status) {
      newOrthologueAttributes[displayName] = JSON.parse(
        JSON.stringify(orthologueAttributes)
      );
    } else {
      delete newOrthologueAttributes[displayName];
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
    const totalSpecies = props.orthologueSpecies.length;
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
            onChange={speciesOnChangeHandler}
            options={props.orthologueSpecies}
            hideLabel={props.hideTitles}
            label={''}
          />
        </div>
      )}

      {!!props.orthologueAttributes &&
        Object.keys(props.orthologueAttributes).map(
          (species: string, key: number) => {
            return (
              <div key={key}>
                <CheckboxGrid
                  onChange={(status, id) =>
                    attributesOnChangeHandler(status, species, id)
                  }
                  options={props.orthologueAttributes[species].options}
                  label={species}
                />
              </div>
            );
          }
        )}
    </div>
  );
};

type DispatchProps = {
  setOrthologueAttributes: (setOrthologueAttributes: Attributes) => void;
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
  orthologueAttributes: any;
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
