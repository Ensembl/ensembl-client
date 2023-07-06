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

import React from 'react';

import { useAppDispatch } from 'src/store';

import { setModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import GeneSearchPanel from 'src/shared/components/gene-search-panel/GeneSearchPanel';

const SpeciesSelectorGeneSearchView = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(setModalView(null));
  };

  return <GeneSearchPanel onClose={onClose} />;
};

export default SpeciesSelectorGeneSearchView;