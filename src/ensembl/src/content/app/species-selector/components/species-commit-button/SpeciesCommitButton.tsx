import React from 'react';
import { connect } from 'react-redux';

import {
  hasCurrentSpecies,
  canCommitSpecies
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { commitSelectedSpecies } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { PrimaryButton } from 'src/shared/button/Button';

import { RootState } from 'src/store';

type Props = {
  hasCurrentSpecies: boolean; // tells whether a species has been selected and can be committed
  disabled: boolean;
  onCommit: () => void;
};

export const SpeciesCommitButton = (props: Props) => {
  const handleClick = () => {
    props.onCommit();
  };

  return props.hasCurrentSpecies ? (
    <div>
      <PrimaryButton onClick={handleClick} isDisabled={props.disabled}>
        Add
      </PrimaryButton>
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState) => ({
  hasCurrentSpecies: hasCurrentSpecies(state),
  disabled: !canCommitSpecies(state)
});

const mapDispatchToProps = {
  onCommit: commitSelectedSpecies
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesCommitButton);
