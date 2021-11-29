/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useCallback, FormEvent } from 'react';
import { connect } from 'react-redux';
import set from 'lodash/fp/set';
import findIndex from 'lodash/findIndex';

import { RootState } from 'src/store';

import CheckboxGrid, {
  CheckboxGridOption
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import {
  getOrthologueAttributes,
  getOrthologueSearchTerm,
  getOrthologueSpecies,
  getOrthologueShowBestMatches,
  getOrthologueShowAll,
  getOrthologueApplyToAllSpecies,
  getSelectedAttributes
} from 'src/content/app/custom-download/state/attributes/attributesSelector';
import {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  fetchOrthologueSpecies,
  updateOrthologueSpecies,
  setOrthologueShowBestMatches,
  setOrthologueShowAll,
  setOrthologueApplyToAllSpecies,
  updateSelectedAttributes
} from 'src/content/app/custom-download/state/attributes/attributesActions';

import Input from 'src/shared/components/input/Input';
import { orthologueAttributes } from 'src/content/app/custom-download/sample-data/orthologue';
import JSONValue from 'src/shared/types/JSON';
import { AttributeWithOptions } from 'src/content/app/custom-download/types/Attributes';

import styles from './Orthologues.scss';

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
    const newOrthologueAttributes: { [key: string]: AttributeWithOptions } = {
      ...props.orthologueAttributes
    };

    const modifiedSpeciesIndex = findIndex(
      newOrthologueAttributes[species].options as CheckboxGridOption[],
      (attribute: CheckboxGridOption) => {
        return attribute.id === attributeId;
      }
    );

    (
      newOrthologueAttributes[species].options[
        modifiedSpeciesIndex
      ] as CheckboxGridOption
    ).isChecked = status;

    const path = ['orthologues', `${attributeId}(${species})`];

    const updatedAttributes = set(path, status, props.selectedAttributes);
    props.updateSelectedAttributes(updatedAttributes);

    props.setOrthologueAttributes(
      newOrthologueAttributes as {
        [key: string]: AttributeWithOptions;
      }
    );
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

    props.updateOrthologueSpecies(newOrthologueFilteredSpecies);

    const newOrthologueAttributes: { [key: string]: AttributeWithOptions } = {
      ...props.orthologueAttributes
    };

    if (status) {
      newOrthologueAttributes[displayName] = JSON.parse(
        JSON.stringify(orthologueAttributes)
      );
    } else {
      delete newOrthologueAttributes[displayName];
    }

    props.setOrthologueAttributes(newOrthologueAttributes);
  };

  const onInputChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const searchTerm = event.currentTarget.value;
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
          onChange={onInputChange}
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
                  options={
                    (
                      props.orthologueAttributes[
                        species
                      ] as AttributeWithOptions
                    ).options as CheckboxGridOption[]
                  }
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
  setOrthologueAttributes: (attributes: {
    [key: string]: AttributeWithOptions;
  }) => void;
  setOrthologueSearchTerm: (searchTerm: string) => void;
  updateOrthologueSpecies: (species: CheckboxGridOption[]) => void;
  fetchOrthologueSpecies: (
    searchTerm: string,
    species: CheckboxGridOption[]
  ) => void;
  setOrthologueShowBestMatches: (showBestMatches: boolean) => void;
  setOrthologueShowAll: (showAll: boolean) => void;
  setOrthologueApplyToAllSpecies: (applyToAllSpecies: boolean) => void;
  updateSelectedAttributes: (selectedAttributes: JSONValue) => void;
};

const mapDispatchToProps: DispatchProps = {
  setOrthologueAttributes,
  setOrthologueSearchTerm,
  updateOrthologueSpecies,
  fetchOrthologueSpecies,
  setOrthologueShowBestMatches,
  setOrthologueShowAll,
  setOrthologueApplyToAllSpecies,
  updateSelectedAttributes
};

type StateProps = {
  orthologueAttributes: { [key: string]: AttributeWithOptions };
  orthologueSearchTerm: string;
  orthologueSpecies: CheckboxGridOption[];
  shouldShowBestMatches: boolean;
  shouldShowAll: boolean;
  shouldApplyToAllSpecies: boolean;
  selectedAttributes: JSONValue;
};

const mapStateToProps = (state: RootState): StateProps => ({
  orthologueAttributes: getOrthologueAttributes(state),
  orthologueSearchTerm: getOrthologueSearchTerm(state),
  orthologueSpecies: getOrthologueSpecies(state),
  shouldShowBestMatches: getOrthologueShowBestMatches(state),
  shouldShowAll: getOrthologueShowAll(state),
  shouldApplyToAllSpecies: getOrthologueApplyToAllSpecies(state),
  selectedAttributes: getSelectedAttributes(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(Orthologue);
