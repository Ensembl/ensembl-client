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

import { useEffect, type ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import createRootReducer from 'src/root/rootReducer';

import { setSpeciesNameDisplayOption } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import type { SpeciesNameDisplayOption } from 'src/content/app/species-selector/types/speciesNameDisplayOption';

const SpeciesLozengeReduxWrapper = ({
  speciesNameDisplayOption,
  children
}: {
  speciesNameDisplayOption?: SpeciesNameDisplayOption;
  children: ReactNode;
}) => {
  const store = configureStore({
    reducer: createRootReducer()
  });

  useEffect(() => {
    if (speciesNameDisplayOption) {
      const dispatch = store.dispatch;
      dispatch(setSpeciesNameDisplayOption(speciesNameDisplayOption));
    }
  });

  return <Provider store={store}>{children}</Provider>;
};

export default SpeciesLozengeReduxWrapper;
