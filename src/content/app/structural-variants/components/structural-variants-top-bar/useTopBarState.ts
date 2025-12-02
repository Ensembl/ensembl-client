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

import { useReducer } from 'react';

import { useAppSelector } from 'src/store';

import {
  getReferenceGenome,
  getAlternativeGenome,
  getReferenceLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import {
  useGenomeGroupsQuery,
  useGenomesInGroupQuery
} from 'src/content/app/structural-variants/state/api/structuralVariantsApiSlice';
import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';
import type { Location } from 'src/content/app/structural-variants/types/location';

type TopBarState = {
  referenceGenome: BriefGenomeSummary | null;
  altGenome: BriefGenomeSummary | null;
  refGenomeLocation: Location | null;
  isEditing: boolean;
};

const initialState: TopBarState = {
  referenceGenome: null,
  altGenome: null,
  refGenomeLocation: null,
  isEditing: false
};

type SetGenomesAndLocationAction = {
  type: 'set_genomes_and_location';
  referenceGenome: BriefGenomeSummary;
  altGenome: BriefGenomeSummary;
  refGenomeLocation: Location;
};

type ChangeReferenceGenomeAction = {
  type: 'change_reference_genome';
  genome: BriefGenomeSummary;
};

type ChangeAltGenome = {
  type: 'change_alt_genome';
  genome: BriefGenomeSummary;
};

type ChangeReferenceGenomeLocationAction = {
  type: 'change_reference_genome_location';
  location: Location;
};

type ProgrammaticallyChangeReferenceGenomeLocationAction = {
  type: 'change_reference_genome_location_programmatically';
  location: Location;
};

type FinishEditingAction = {
  type: 'finish_editing';
  location: Location;
};

type Action =
  | SetGenomesAndLocationAction
  | ChangeReferenceGenomeAction
  | ChangeAltGenome
  | ChangeReferenceGenomeLocationAction
  | ProgrammaticallyChangeReferenceGenomeLocationAction
  | FinishEditingAction;

const reducer = (state: TopBarState, action: Action): TopBarState => {
  switch (action.type) {
    case 'set_genomes_and_location':
      return {
        ...initialState,
        referenceGenome: action.referenceGenome,
        altGenome: action.altGenome,
        refGenomeLocation: action.refGenomeLocation
      };
    case 'change_reference_genome':
      return {
        ...initialState,
        referenceGenome: action.genome,
        isEditing: true
      };
    case 'change_alt_genome':
      return {
        ...state,
        altGenome: action.genome,
        isEditing: true
      };
    case 'change_reference_genome_location':
      return {
        ...state,
        refGenomeLocation: action.location,
        isEditing: true
      };
    case 'change_reference_genome_location_programmatically':
      return {
        ...state,
        refGenomeLocation: action.location,
        isEditing: false
      };
    case 'finish_editing':
      return {
        ...state,
        isEditing: false
      };
    default:
      return state;
  }
};

const useTopBarState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const referenceGenomeFromRedux = useAppSelector(getReferenceGenome);
  const altGenomeFromRedux = useAppSelector(getAlternativeGenome);
  const refGenomeLocationFromRedux = useAppSelector(getReferenceLocation);

  const referenceGenomeId = state.referenceGenome?.genome_id;

  const { genomeGroups, genomesInGroup, exampleLocation } = useFetchedData({
    referenceGenomeId
  });

  if (
    !state.referenceGenome &&
    !state.altGenome &&
    !state.refGenomeLocation &&
    referenceGenomeFromRedux &&
    altGenomeFromRedux &&
    refGenomeLocationFromRedux
  ) {
    dispatch({
      type: 'set_genomes_and_location',
      referenceGenome: referenceGenomeFromRedux,
      altGenome: altGenomeFromRedux,
      refGenomeLocation: refGenomeLocationFromRedux
    });
  }

  const canSubmitSelection =
    state.referenceGenome &&
    state.altGenome &&
    state.refGenomeLocation &&
    state.isEditing;

  const changeReferenceGenome = (genome: BriefGenomeSummary) => {
    dispatch({
      type: 'change_reference_genome',
      genome
    });
  };

  const changeAltGenome = (genome: BriefGenomeSummary) => {
    dispatch({
      type: 'change_alt_genome',
      genome
    });
  };

  const changeReferenceGenomeLocation = (location: Location) => {
    dispatch({
      type: 'change_reference_genome_location',
      location
    });
  };

  return {
    referenceGenome: state.referenceGenome,
    altGenome: state.altGenome,
    referenceGenomeLocation: state.refGenomeLocation,
    canSubmitSelection,
    genomeGroups,
    genomesInGroup,
    exampleLocation,
    changeReferenceGenome,
    changeAltGenome,
    changeReferenceGenomeLocation
  };
};

const useFetchedData = ({
  referenceGenomeId
}: {
  referenceGenomeId: string | undefined;
}) => {
  const { data: genomeGroupsData } = useGenomeGroupsQuery();

  const getReferenceGenomeGroupId = () => {
    if (referenceGenomeId) {
      const group = genomeGroupsData?.genome_groups.find(
        (group) => group.reference_genome.genome_id === referenceGenomeId
      );
      if (group) {
        return group.id;
      }
    }
  };
  const referenceGenomeGroupId = getReferenceGenomeGroupId();

  const { currentData: genomesInGroup } = useGenomesInGroupQuery(
    referenceGenomeGroupId ?? '',
    {
      skip: !referenceGenomeGroupId
    }
  );
  const { currentData: exampleObjects } = useExampleObjectsForGenomeQuery(
    referenceGenomeId ?? '',
    {
      skip: !referenceGenomeId
    }
  );

  const exampleLocation = exampleObjects?.find(
    (obj) => obj.type === 'location'
  );

  return {
    genomeGroups: genomeGroupsData?.genome_groups,
    genomesInGroup: genomesInGroup?.genomes,
    exampleLocation: exampleLocation?.id
  };
};

export default useTopBarState;
