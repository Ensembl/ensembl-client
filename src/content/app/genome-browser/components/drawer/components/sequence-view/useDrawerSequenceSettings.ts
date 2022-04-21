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

import { useAppDispatch, useAppSelector } from 'src/store';

import {
  isDrawerSequenceVisible,
  getDrawerSequenceType,
  isDrawerSequenceReverseComplement
} from 'src/content/app/genome-browser/state/drawer/drawer-sequence/drawerSequenceSelectors';

import {
  showSequence,
  hideSequence,
  changeSequenceType,
  changeReverseComplement
} from 'src/content/app/genome-browser/state/drawer/drawer-sequence/drawerSequenceSlice';

import type { SequenceType } from 'src/content/app/genome-browser/state/drawer/drawer-sequence/drawerSequenceSlice';

type Params = {
  genomeId: string;
  featureId: string;
};

const useDrawerSequenceSettings = (params: Params) => {
  const { genomeId, featureId } = params;
  const dispatch = useAppDispatch();

  const isSequenceVisible = useAppSelector((state) =>
    isDrawerSequenceVisible(state, genomeId)
  );
  const selectedSequenceType = useAppSelector((state) =>
    getDrawerSequenceType(state, genomeId, featureId)
  );
  const isReverseComplement = useAppSelector((state) =>
    isDrawerSequenceReverseComplement(state, genomeId, featureId)
  );

  const toggleSequenceVisibility = () => {
    isSequenceVisible
      ? dispatch(hideSequence({ genomeId }))
      : dispatch(showSequence({ genomeId }));
  };

  const onSequenceTypeChange = (sequenceType: SequenceType) => {
    dispatch(
      changeSequenceType({
        genomeId,
        featureId,
        sequenceType
      })
    );
  };

  const toggleReverseComplement = () => {
    const actionParams = {
      genomeId,
      featureId,
      isReverseComplement: !isReverseComplement
    };

    dispatch(changeReverseComplement(actionParams));
  };

  return {
    isExpanded: isSequenceVisible,
    toggleSequenceVisibility,
    sequenceType: selectedSequenceType,
    onSequenceTypeChange,
    isReverseComplement,
    toggleReverseComplement
  };
};

export default useDrawerSequenceSettings;
