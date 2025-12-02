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

import { useState, useReducer } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import {
  getReferenceGenome,
  getAlternativeGenome,
  getReferenceLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import {
  useGenomeGroupsQuery,
  useGenomesInGroupQuery
} from 'src/content/app/structural-variants/state/api/structuralVariantsApiSlice';
import { setGenomesAndLocations } from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSlice';
import { useExampleObjectsForGenomeQuery } from 'src/shared/state/genome/genomeApiSlice';

import {
  getGenomicLocationFromString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';
import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

type TopBarState = {
  referenceGenome: BriefGenomeSummary | null;
  altGenome: BriefGenomeSummary | null;
  refGenomeLocation: GenomicLocation | null;
  refGenomeLocationDraft: string | null; // for users to mess with
  isEditing: boolean;
};

const initialState: TopBarState = {
  referenceGenome: null,
  altGenome: null,
  refGenomeLocation: null,
  refGenomeLocationDraft: null,
  isEditing: false
};

type SetGenomesAndLocationAction = {
  type: 'set_genomes_and_location';
  referenceGenome: BriefGenomeSummary;
  altGenome: BriefGenomeSummary;
  refGenomeLocation: GenomicLocation;
};

type ChangeReferenceGenomeAction = {
  type: 'change_reference_genome';
  genome: BriefGenomeSummary;
};

type ChangeAltGenome = {
  type: 'change_alt_genome';
  genome: BriefGenomeSummary;
};

type ChangeRefGenomeLocationDraftAction = {
  type: 'change_reference_genome_location_draft';
  location: string;
};

type ChangeReferenceGenomeLocationAction = {
  type: 'change_reference_genome_location';
  location: GenomicLocation;
  isEditing?: boolean;
};

type FinishEditingAction = {
  type: 'finish_editing';
};

type Action =
  | SetGenomesAndLocationAction
  | ChangeReferenceGenomeAction
  | ChangeAltGenome
  | ChangeReferenceGenomeLocationAction
  | ChangeRefGenomeLocationDraftAction
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
    case 'change_reference_genome_location_draft':
      return {
        ...state,
        refGenomeLocationDraft: action.location,
        isEditing: true
      };
    case 'change_reference_genome_location':
      return {
        ...state,
        refGenomeLocation: action.location,
        isEditing:
          action.isEditing !== undefined ? action.isEditing : state.isEditing
      };
    case 'finish_editing':
      return {
        ...state,
        refGenomeLocationDraft: null,
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
  const reduxDispatch = useAppDispatch();

  const [prevRefGenomeLocationFromRedux, setPrevGenomeLocationFromRedux] =
    useState<GenomicLocation | null>(refGenomeLocationFromRedux);

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
  } else if (!state.refGenomeLocation && exampleLocation) {
    const location = getGenomicLocationFromString(exampleLocation);
    dispatch({
      type: 'change_reference_genome_location',
      location
    });
  }
  if (
    refGenomeLocationFromRedux &&
    refGenomeLocationFromRedux !== prevRefGenomeLocationFromRedux
  ) {
    dispatch({
      type: 'change_reference_genome_location',
      location: refGenomeLocationFromRedux,
      isEditing: false
    });
    setPrevGenomeLocationFromRedux(refGenomeLocationFromRedux);
  }

  const canSubmitSelection =
    !!state.referenceGenome &&
    !!state.altGenome &&
    !!state.refGenomeLocation &&
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

  const changeReferenceGenomeLocationDraft = (location: string) => {
    dispatch({
      type: 'change_reference_genome_location_draft',
      location
    });
  };

  const submitSelection = () => {
    let refGenomeLocation: GenomicLocation;
    if (state.refGenomeLocationDraft) {
      // TODO: handle errors!
      refGenomeLocation = getGenomicLocationFromString(
        state.refGenomeLocationDraft
      );

      // update location in the state with parsed location from the draft
      dispatch({
        type: 'change_reference_genome_location',
        location: refGenomeLocation
      });
    } else {
      refGenomeLocation = state.refGenomeLocation as GenomicLocation;
    }

    dispatch({
      type: 'finish_editing'
    });

    reduxDispatch(
      setGenomesAndLocations({
        referenceGenome: state.referenceGenome,
        referenceGenomeLocation: refGenomeLocation, // don't read the location from the state; it's too late for that
        alternativeGenome: state.altGenome,
        alternativeGenomeLocation: null
      })
    );
  };

  let referenceGenomeLocationString: string;
  if (state.refGenomeLocationDraft) {
    referenceGenomeLocationString = state.refGenomeLocationDraft;
  } else if (state.refGenomeLocation) {
    referenceGenomeLocationString = getFormattedLocation({
      chromosome: state.refGenomeLocation.regionName,
      start: state.refGenomeLocation.start,
      end: state.refGenomeLocation.end
    });
  } else {
    referenceGenomeLocationString = '';
  }

  return {
    referenceGenome: state.referenceGenome,
    altGenome: state.altGenome,
    referenceGenomeLocation: referenceGenomeLocationString,
    canSubmitSelection,
    genomeGroups,
    genomesInGroup,
    changeReferenceGenome,
    changeAltGenome,
    changeReferenceGenomeLocation: changeReferenceGenomeLocationDraft,
    submitSelection
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
